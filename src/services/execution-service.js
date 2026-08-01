import { access, mkdir, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { assertStageTransition, assertVerificationRecoveryTransition } from '../domain/state-machine.js';
import { buildBuilderPrompt, ORCHESTRATOR_EXECUTION_POLICY } from './execution-policy.js';
import { resolveExecutable } from '../utils/process.js';
import { nowIso } from '../utils/time.js';

const ACTIVE_RUN_STATUSES = new Set(['claimed', 'running', 'verifying', 'awaiting_approval']);

export class ExecutionService {
  #controllers = new Map();

  constructor(loaded, store, programme, git, agentProvider, verification, logDir) {
    Object.assign(this, { loaded, store, programme, git, agentProvider, verification, logDir });
  }

  async enqueue(stageId, requestedBy, dryRun = false, options = {}) {
    const stage = this.loaded.stages.get(stageId);
    if (!stage) throw new Error(`Unknown stage: ${stageId}`);
    if (options.agentCheck && !dryRun) throw new Error('--agent-check is only valid with --dry-run');
    const agentDefaults = this.loaded.manifest.defaults.agent;
    const run = {
      id: randomUUID(),
      stageId,
      status: 'queued',
      requestedBy,
      dryRun,
      agentCheck: Boolean(options.agentCheck),
      createdAt: nowIso(),
      metadata: {
        provider: this.agentProvider.name,
        model: agentDefaults.model ?? null,
        builderSandbox: 'workspace-write',
        verifierSandbox: 'read-only',
        timeoutMs: agentDefaults.timeout_ms,
      },
    };

    await this.store.update('stage.enqueue', (state) => {
      if (state.paused) throw new Error(`Programme is paused${state.pauseReason ? `: ${state.pauseReason}` : ''}`);
      const runtime = state.stages[stageId];
      if (!runtime || !['ready', 'failed', 'cancelled'].includes(runtime.status)) {
        throw new Error(`Stage ${stageId} is not runnable; current status: ${runtime?.status ?? 'unknown'}`);
      }
      const activeCount = Object.values(state.runs).filter((candidate) => ACTIVE_RUN_STATUSES.has(candidate.status)).length;
      const maxConcurrent = this.loaded.manifest.defaults.execution.max_concurrent_runs;
      if (activeCount >= maxConcurrent) {
        throw new Error(`Maximum concurrent runs reached (${maxConcurrent})`);
      }
      transitionStage(state, stageId, 'queued', { activeRunId: run.id });
      state.runs[run.id] = run;
      state.queue.push(run.id);
    }, { stageId, runId: run.id, requestedBy, dryRun, agentCheck: run.agentCheck });
    return run;
  }

  async claimNext(workerId = `worker-${process.pid}`) {
    return this.store.update('worker.claim', (state) => {
      this.#requeueExpiredClaims(state);
      if (state.paused) return undefined;
      const runId = state.queue.shift();
      if (!runId) return undefined;
      const run = requiredRun(state, runId);
      if (run.status !== 'queued') throw new Error(`Queue contains non-queued run ${runId}`);
      run.status = 'claimed';
      run.claimedBy = workerId;
      run.claimedAt = nowIso();
      run.claimLeaseExpiresAt = new Date(Date.now() + this.loaded.manifest.defaults.execution.claim_lease_ms).toISOString();
      return structuredClone(run);
    }, { workerId });
  }

  async processNext(workerId) {
    const claimed = await this.claimNext(workerId);
    return claimed ? this.execute(claimed.id) : undefined;
  }

  async execute(runId) {
    const snapshot = await this.store.read();
    const existing = snapshot.runs[runId];
    if (!existing) throw new Error(`Unknown run: ${runId}`);
    if (!['queued', 'claimed'].includes(existing.status)) {
      throw new Error(`Run ${runId} cannot execute from status ${existing.status}`);
    }
    const stage = this.loaded.stages.get(existing.stageId);
    if (!stage) throw new Error(`Unknown stage: ${existing.stageId}`);

    if (existing.dryRun) return this.completeDryRun(runId, stage);

    const controller = new AbortController();
    this.#controllers.set(runId, controller);
    let worktree;

    try {
      await this.git.assertPathExists();
      await this.git.assertRepository();
      await this.git.assertRemoteMatches(this.loaded.manifest.programme.target_repository.full_name);
      await this.git.assertClean();
      await this.git.fetch();
      const gitDefaults = this.loaded.manifest.defaults.git;
      worktree = await this.git.createWorktree(
        stage.id,
        runId,
        gitDefaults.base_branch,
        gitDefaults.integration_branch,
        gitDefaults.branch_prefix,
      );
      await mkdir(this.logDir, { recursive: true });
      await this.store.update('stage.start', (state) => {
        const run = requiredRun(state, runId);
        if (!['queued', 'claimed'].includes(run.status)) throw new Error(`Run ${runId} is not startable`);
        state.queue = state.queue.filter((id) => id !== runId);
        Object.assign(run, {
          status: 'running',
          startedAt: nowIso(),
          branch: worktree.branch,
          worktreePath: worktree.path,
          baseCommit: worktree.baseCommit,
          lifecycleGates: initialLifecycleGates(stage),
        });
        delete run.claimLeaseExpiresAt;
        transitionStage(state, stage.id, 'running', {
          branch: worktree.branch,
          worktreePath: worktree.path,
        });
      }, { runId, stageId: stage.id, branch: worktree.branch });

      const stagePrompt = await readFile(this.programme.resolvePromptPath(stage.id), 'utf8');
      const prompt = buildBuilderPrompt(stagePrompt);
      const agentDefaults = this.loaded.manifest.defaults.agent;
      const agent = await this.agentProvider.execute({
        prompt,
        cwd: worktree.path,
        runId,
        logDir: this.logDir,
        model: agentDefaults.model,
        sandbox: agentDefaults.sandbox,
        timeoutMs: agentDefaults.timeout_ms,
        signal: controller.signal,
      });
      if (agent.exitCode !== 0) throw new Error(`Agent exited with code ${agent.exitCode}`);

      await this.store.update('stage.verifying', (state) => {
        const run = requiredRun(state, runId);
        Object.assign(run, { status: 'verifying', agent });
        run.lifecycleGates.implementation = gate('passed', 'Builder completed and left the intended worktree changes for verification.');
        run.lifecycleGates.preCommitVerification = gate('in_progress', 'Deterministic checks and independent read-only verification are running.');
        transitionStage(state, stage.id, 'verifying');
      }, { runId, stageId: stage.id });

      const diffContext = await this.git.diffContext(worktree.path, worktree.baseCommit);
      const verification = await this.verification.verify({
        stageId: stage.id,
        runId,
        cwd: worktree.path,
        signal: controller.signal,
        stagePrompt,
        executionPolicy: ORCHESTRATOR_EXECUTION_POLICY,
        baseCommit: worktree.baseCommit,
        diffContext,
      });
      await this.store.update('stage.verification-result', (state) => {
        const run = requiredRun(state, runId);
        appendVerificationRecord(run, verification, 'initial');
        run.lifecycleGates.preCommitVerification = gate(
          verification.passed ? 'passed' : 'failed',
          verification.passed ? 'Pre-commit verification passed.' : 'Pre-commit verification found a genuine blocker.',
        );
      }, { runId, stageId: stage.id, passed: verification.passed });
      if (!verification.passed) throw new Error('Stage verification failed');

      let resultCommit;
      if (gitDefaults.auto_commit) {
        resultCommit = await this.git.commitAll(worktree.path, `build(${stage.id}): complete programme stage`);
      }
      if (!resultCommit && !stage.allow_no_changes) {
        throw new Error(`Stage ${stage.id} produced no commit; set allow_no_changes only for an intentional no-op stage`);
      }
      await this.store.update('stage.commit-created', (state) => {
        const run = requiredRun(state, runId);
        if (resultCommit) run.resultCommit = resultCommit;
        run.lifecycleGates.orchestratorCommit = resultCommit
          ? gate('passed', `Orchestrator created stage commit ${resultCommit}.`)
          : gate('not_required', 'Stage is an allowed no-op.');
      }, { runId, stageId: stage.id, resultCommit });
      if (!stage.requires_human_approval && resultCommit) {
        await this.git.advanceIntegrationBranch(gitDefaults.integration_branch, resultCommit);
        if (gitDefaults.push_integration_branch) {
          await this.git.pushIntegrationBranch(gitDefaults.integration_branch, gitDefaults.base_branch);
        }
      }

      const finalStatus = stage.requires_human_approval ? 'awaiting_approval' : 'completed';
      const finalRun = await this.store.update('stage.executed', (state) => {
        const run = requiredRun(state, runId);
        run.lifecycleGates.humanApproval = stage.requires_human_approval
          ? gate('pending', 'Awaiting human approval.')
          : gate('not_required', 'This stage does not require human approval.');
        run.lifecycleGates.postApprovalIntegration = finalStatus === 'completed'
          ? gate('passed', 'Integration branch advanced after all required gates; configured integration push completed when enabled.')
          : gate('pending', 'Integration movement and push are blocked until human approval.');
        Object.assign(run, {
          status: finalStatus,
          finishedAt: nowIso(),
          ...(resultCommit ? { resultCommit } : {}),
        });
        transitionStage(state, stage.id, finalStatus, {
          ...(finalStatus === 'completed' ? { completedRunId: runId } : {}),
        });
        return structuredClone(run);
      }, { runId, stageId: stage.id, finalStatus, resultCommit });

      if (finalStatus === 'completed') {
        await this.store.update('programme.recompute', (state) => this.programme.recomputeReadiness(state));
      }
      if (gitDefaults.cleanup_worktree_on_success && finalStatus === 'completed' && worktree) {
        await this.git.removeWorktree(worktree.path);
      }
      return finalRun;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return this.store.update('stage.failed', (state) => {
        const run = requiredRun(state, runId);
        const status = controller.signal.aborted ? 'cancelled' : 'failed';
        state.queue = state.queue.filter((id) => id !== runId);
        Object.assign(run, { status, error: message, finishedAt: nowIso() });
        if (run.lifecycleGates?.preCommitVerification?.status === 'in_progress') {
          run.lifecycleGates.preCommitVerification = gate('failed', message);
        } else if (run.lifecycleGates?.preCommitVerification?.status === 'passed'
          && run.lifecycleGates?.orchestratorCommit?.status === 'pending') {
          run.lifecycleGates.orchestratorCommit = gate('failed', message);
        } else if (run.lifecycleGates?.orchestratorCommit?.status === 'passed'
          && run.lifecycleGates?.postApprovalIntegration?.status === 'pending') {
          run.lifecycleGates.postApprovalIntegration = gate('failed', message);
        }
        delete run.claimLeaseExpiresAt;
        transitionStage(state, run.stageId, status, { lastError: message });
        return structuredClone(run);
      }, { runId, stageId: existing.stageId, error: message });
    } finally {
      this.#controllers.delete(runId);
    }
  }

  async resumeRun(runId, from, requestedBy) {
    if (from !== 'verification') throw new Error('resume-run currently requires --from verification');
    if (!requestedBy) throw new Error('resume-run requires --by <actor>');
    const snapshot = await this.store.read();
    const failed = requiredRun(snapshot, runId);
    const stage = this.loaded.stages.get(failed.stageId);
    if (!stage) throw new Error(`Unknown stage: ${failed.stageId}`);
    assertVerificationRecoveryState(snapshot, stage.id, runId);
    if (!failed.worktreePath || !failed.branch || !failed.baseCommit) {
      throw new Error(`Run ${runId} has no preserved worktree, stage branch, or base commit`);
    }
    if (failed.resultCommit) throw new Error(`Run ${runId} already has a stage commit and cannot resume from pre-commit verification`);
    if (!failed.agent || failed.agent.exitCode !== 0) {
      throw new Error(`Run ${runId} has no successful builder evidence to preserve`);
    }
    const activeControllerRunId = [...this.#controllers.keys()].find((candidateId) => {
      const candidate = snapshot.runs[candidateId];
      return candidateId === runId || (candidate
        && (candidate.worktreePath === failed.worktreePath || candidate.branch === failed.branch));
    });
    if (activeControllerRunId) {
      throw new Error(`Run ${activeControllerRunId} still has an active builder or verifier process on the preserved recovery context`);
    }
    const conflicting = Object.values(snapshot.runs).find((candidate) => candidate.id !== runId
      && ACTIVE_RUN_STATUSES.has(candidate.status)
      && (candidate.worktreePath === failed.worktreePath || candidate.branch === failed.branch));
    if (conflicting) throw new Error(`Run ${conflicting.id} is active on the preserved worktree or stage branch`);

    const controller = new AbortController();
    this.#controllers.set(runId, controller);
    const attemptId = `recovery-${(failed.recoveryAttempts?.length ?? 0) + 1}`;
    let attemptStarted = false;
    let recoveryPhase = 'verification';
    try {
      const safety = await this.git.assertRecoverableWorktree(failed.worktreePath, failed.branch, failed.baseCommit);
      const stagePrompt = await readFile(this.programme.resolvePromptPath(stage.id), 'utf8');
      const diffContext = await this.git.diffContext(failed.worktreePath, failed.baseCommit);

      await this.store.update('stage.recovery-start', (state) => {
        const run = requiredRun(state, runId);
        assertVerificationRecoveryState(state, stage.id, runId, {
          branch: failed.branch,
          worktreePath: failed.worktreePath,
          baseCommit: failed.baseCommit,
        });
        const conflictingRun = Object.values(state.runs).find((candidate) => candidate.id !== runId
          && ACTIVE_RUN_STATUSES.has(candidate.status)
          && (candidate.worktreePath === run.worktreePath || candidate.branch === run.branch));
        if (conflictingRun) {
          throw new Error(`Run ${conflictingRun.id} is active on the preserved worktree or stage branch`);
        }
        transitionStageForVerificationRecovery(state, stage.id, runId);
        const attempt = {
          id: attemptId,
          from: 'verification',
          requestedBy,
          startedAt: nowIso(),
          status: 'running',
          priorError: run.error ?? null,
          priorFinishedAt: run.finishedAt ?? null,
          worktreePath: run.worktreePath,
          branch: run.branch,
          safety: { passed: true, checkedAt: nowIso(), ...safety },
        };
        run.recoveryAttempts ??= [];
        run.recoveryAttempts.push(attempt);
        run.status = 'verifying';
        run.lifecycleGates ??= initialLifecycleGates(stage);
        run.lifecycleGates.implementation = gate('passed', 'Earlier successful builder output is preserved; the builder was not rerun.');
        run.lifecycleGates.preCommitVerification = gate('in_progress', 'Recovery is rerunning deterministic and independent pre-commit verification.');
        run.lifecycleGates.orchestratorCommit = gate('pending', 'Commit remains blocked until recovery verification passes.');
        run.lifecycleGates.humanApproval = stage.requires_human_approval
          ? gate('pending', 'Human approval follows the orchestrator commit.')
          : gate('not_required', 'This stage does not require human approval.');
        run.lifecycleGates.postApprovalIntegration = gate('pending', 'Integration movement and push remain blocked.');
      }, { runId, stageId: stage.id, attemptId, requestedBy, from });
      attemptStarted = true;

      const verification = await this.verification.verify({
        stageId: stage.id,
        runId: `${runId}-${attemptId}`,
        cwd: failed.worktreePath,
        signal: controller.signal,
        stagePrompt,
        executionPolicy: ORCHESTRATOR_EXECUTION_POLICY,
        baseCommit: failed.baseCommit,
        diffContext,
      });
      await this.store.update('stage.recovery-verification-result', (state) => {
        const run = requiredRun(state, runId);
        appendVerificationRecord(run, verification, attemptId);
        const attempt = currentRecoveryAttempt(run, attemptId);
        attempt.verificationRecordIndex = run.verificationRecords.length - 1;
        run.lifecycleGates.preCommitVerification = gate(
          verification.passed ? 'passed' : 'failed',
          verification.passed ? 'Recovery pre-commit verification passed.' : 'Recovery verification found a genuine blocker.',
        );
      }, { runId, stageId: stage.id, attemptId, passed: verification.passed });
      if (!verification.passed) throw new Error('Stage recovery verification failed');

      recoveryPhase = 'commit';
      const gitDefaults = this.loaded.manifest.defaults.git;
      let resultCommit;
      if (gitDefaults.auto_commit) {
        resultCommit = await this.git.commitAll(failed.worktreePath, `build(${stage.id}): complete programme stage`);
      }
      if (!resultCommit && !stage.allow_no_changes) {
        throw new Error(`Stage ${stage.id} produced no commit; set allow_no_changes only for an intentional no-op stage`);
      }
      await this.store.update('stage.recovery-commit-created', (state) => {
        const run = requiredRun(state, runId);
        const attempt = currentRecoveryAttempt(run, attemptId);
        if (resultCommit) run.resultCommit = resultCommit;
        attempt.resultCommit = resultCommit ?? null;
        run.lifecycleGates.orchestratorCommit = resultCommit
          ? gate('passed', `Orchestrator created stage commit ${resultCommit} after verification passed.`)
          : gate('not_required', 'Stage is an allowed no-op.');
      }, { runId, stageId: stage.id, attemptId, resultCommit });

      recoveryPhase = 'integration';
      if (!stage.requires_human_approval && resultCommit) {
        await this.git.advanceIntegrationBranch(gitDefaults.integration_branch, resultCommit);
        if (gitDefaults.push_integration_branch) {
          await this.git.pushIntegrationBranch(gitDefaults.integration_branch, gitDefaults.base_branch);
        }
      }
      const finalStatus = stage.requires_human_approval ? 'awaiting_approval' : 'completed';
      const recovered = await this.store.update('stage.recovery-complete', (state) => {
        const run = requiredRun(state, runId);
        const attempt = currentRecoveryAttempt(run, attemptId);
        Object.assign(attempt, { status: 'passed', finishedAt: nowIso(), resultCommit: resultCommit ?? null });
        run.lifecycleGates.humanApproval = stage.requires_human_approval
          ? gate('pending', 'Awaiting human approval.')
          : gate('not_required', 'This stage does not require human approval.');
        run.lifecycleGates.postApprovalIntegration = finalStatus === 'completed'
          ? gate('passed', 'Integration branch advanced and configured integration push completed when enabled.')
          : gate('pending', 'Integration movement and push are blocked until human approval.');
        Object.assign(run, {
          status: finalStatus,
          finishedAt: nowIso(),
          ...(resultCommit ? { resultCommit } : {}),
        });
        delete run.error;
        transitionStage(state, stage.id, finalStatus, {
          ...(finalStatus === 'completed' ? { completedRunId: runId } : {}),
        });
        return structuredClone(run);
      }, { runId, stageId: stage.id, attemptId, finalStatus, resultCommit });
      if (finalStatus === 'completed') {
        await this.store.update('programme.recompute', (state) => this.programme.recomputeReadiness(state));
        if (gitDefaults.cleanup_worktree_on_success) await this.git.removeWorktree(failed.worktreePath);
      }
      return recovered;
    } catch (error) {
      if (!attemptStarted) throw error;
      const message = error instanceof Error ? error.message : String(error);
      return this.store.update('stage.recovery-failed', (state) => {
        const run = requiredRun(state, runId);
        const attempt = currentRecoveryAttempt(run, attemptId);
        Object.assign(attempt, { status: 'failed', phase: recoveryPhase, error: message, finishedAt: nowIso() });
        Object.assign(run, { status: 'failed', error: message, finishedAt: nowIso() });
        if (recoveryPhase === 'commit') run.lifecycleGates.orchestratorCommit = gate('failed', message);
        else if (recoveryPhase === 'integration') run.lifecycleGates.postApprovalIntegration = gate('failed', message);
        else run.lifecycleGates.preCommitVerification = gate('failed', message);
        transitionStage(state, stage.id, 'failed', { lastError: message });
        return structuredClone(run);
      }, { runId, stageId: stage.id, attemptId, phase: recoveryPhase, error: message });
    } finally {
      this.#controllers.delete(runId);
    }
  }

  async approve(runId, decidedBy, note) {
    const snapshot = await this.store.read();
    const pending = requiredRun(snapshot, runId);
    if (pending.status !== 'awaiting_approval') throw new Error('Run is not awaiting approval');
    const stage = this.loaded.stages.get(pending.stageId);
    if (!pending.resultCommit && !stage?.allow_no_changes) throw new Error('Cannot approve a run without a result commit');
    const gitDefaults = this.loaded.manifest.defaults.git;
    if (pending.resultCommit) {
      await this.git.advanceIntegrationBranch(gitDefaults.integration_branch, pending.resultCommit);
      if (gitDefaults.push_integration_branch) {
        await this.git.pushIntegrationBranch(gitDefaults.integration_branch, gitDefaults.base_branch);
      }
    }

    const run = await this.store.update('stage.approve', (state) => {
      const target = requiredRun(state, runId);
      Object.assign(target, {
        status: 'completed',
        approval: {
          decision: 'approved',
          decidedBy,
          decidedAt: nowIso(),
          ...(note ? { note } : {}),
        },
      });
      target.lifecycleGates ??= initialLifecycleGates(stage);
      target.lifecycleGates.humanApproval = gate('passed', `Approved by ${decidedBy}.`);
      target.lifecycleGates.postApprovalIntegration = gate('passed', 'Approved integration branch advanced and configured push completed.');
      transitionStage(state, target.stageId, 'completed', { completedRunId: runId });
      return structuredClone(target);
    }, { runId, stageId: pending.stageId, decidedBy, decision: 'approved' });
    await this.store.update('programme.recompute', (state) => this.programme.recomputeReadiness(state));
    if (gitDefaults.cleanup_worktree_on_success && pending.worktreePath) {
      await this.git.removeWorktree(pending.worktreePath);
    }
    return run;
  }

  async reject(runId, decidedBy, note) {
    return this.store.update('stage.reject', (state) => {
      const target = requiredRun(state, runId);
      if (target.status !== 'awaiting_approval') throw new Error('Run is not awaiting approval');
      const error = note ?? 'Rejected during human approval';
      Object.assign(target, {
        status: 'failed',
        error,
        approval: {
          decision: 'rejected',
          decidedBy,
          decidedAt: nowIso(),
          ...(note ? { note } : {}),
        },
      });
      transitionStage(state, target.stageId, 'failed', { lastError: error });
      return structuredClone(target);
    }, { runId, decidedBy, decision: 'rejected' });
  }

  async cancel(runId) {
    const controller = this.#controllers.get(runId);
    controller?.abort();
    return this.store.update('stage.cancel.requested', (state) => {
      const run = requiredRun(state, runId);
      if (['queued', 'claimed'].includes(run.status)) {
        state.queue = state.queue.filter((id) => id !== runId);
        Object.assign(run, { status: 'cancelled', finishedAt: nowIso() });
        delete run.claimLeaseExpiresAt;
        transitionStage(state, run.stageId, 'cancelled');
      } else if (!controller && ['running', 'verifying', 'awaiting_approval'].includes(run.status)) {
        Object.assign(run, {
          status: 'cancelled',
          error: 'Cancelled during interruption recovery',
          finishedAt: nowIso(),
        });
        transitionStage(state, run.stageId, 'cancelled', { lastError: run.error });
      }
      return structuredClone(run);
    }, { runId });
  }

  async completeDryRun(runId, stage) {
    const preflight = await this.#preflight(runId, stage);
    const failedChecks = preflight.checks.filter((check) => !check.passed);
    return this.store.update('stage.dry-run', (state) => {
      const run = requiredRun(state, runId);
      state.queue = state.queue.filter((id) => id !== runId);
      Object.assign(run, {
        status: preflight.passed ? 'completed' : 'failed',
        finishedAt: nowIso(),
        preflight,
        dryRunPlan: {
          stageId: stage.id,
          phaseId: stage.phaseId,
          promptPath: this.programme.resolvePromptPath(stage.id),
          dependencies: stage.effectiveDependsOn ?? stage.depends_on,
          verificationCommands: [
            ...this.loaded.manifest.defaults.verification.commands,
            ...stage.verification.commands,
          ],
          requiresHumanApproval: stage.requires_human_approval,
        },
        ...(!preflight.passed ? {
          error: `Dry-run preflight failed: ${failedChecks.map((check) => `${check.id}: ${check.error}`).join('; ')}`,
        } : {}),
      });
      transitionStage(state, stage.id, 'ready', {
        ...(!preflight.passed ? { lastError: run.error } : {}),
      });
      delete state.stages[stage.id].activeRunId;
      if (preflight.passed) delete state.stages[stage.id].lastError;
      return structuredClone(run);
    }, { runId, stageId: stage.id, passed: preflight.passed });
  }

  async #preflight(runId, stage) {
    const checks = [];
    const check = async (id, label, action) => {
      try {
        const detail = await action();
        checks.push({ id, label, passed: true, ...(detail === undefined ? {} : { detail }) });
      } catch (error) {
        checks.push({ id, label, passed: false, error: error instanceof Error ? error.message : String(error) });
      }
    };
    const gitDefaults = this.loaded.manifest.defaults.git;
    const targetRepository = this.loaded.manifest.programme.target_repository;
    const promptPath = this.programme.resolvePromptPath(stage.id);
    const commands = [...this.loaded.manifest.defaults.verification.commands, ...stage.verification.commands];

    await check('target_path', 'TARGET_REPO_PATH exists', async () => {
      await this.git.assertPathExists();
      return this.git.targetRepoPath;
    });
    await check('git_working_tree', 'Target is a Git working tree', async () => {
      await this.git.assertRepository();
      return 'Git working tree confirmed';
    });
    await check('target_remote', `Remote resolves to ${targetRepository.full_name}`, async () => {
      await this.git.assertRemoteMatches(targetRepository.full_name);
      return `${this.git.remote} -> ${targetRepository.full_name}`;
    });
    await check('clean_working_tree', 'Target working tree is clean', async () => {
      await this.git.assertClean();
      return 'No tracked or untracked changes';
    });
    await check('base_branch', `Base branch ${gitDefaults.base_branch} exists`, async () => {
      return this.git.resolveBaseBranch(gitDefaults.base_branch);
    });
    await check('integration_branch', `Integration branch ${gitDefaults.integration_branch} is resolvable or safely creatable`, async () => {
      return this.git.inspectIntegrationBranch(gitDefaults.base_branch, gitDefaults.integration_branch);
    });
    await check('stage_prompt', 'Stage prompt exists and is readable', async () => {
      await access(promptPath, constants.R_OK);
      await readFile(promptPath, 'utf8');
      return promptPath;
    });
    for (const [index, command] of commands.entries()) {
      await check(`verification_executable_${index}`, `Verification executable ${command.command} resolves`, async () => {
        const resolved = await resolveExecutable(command.command, {
          cwd: this.git.targetRepoPath,
          env: { ...process.env, ...(command.env ?? {}) },
        });
        if (!resolved) throw new Error(`Executable cannot be resolved: ${command.command}`);
        return resolved;
      });
    }
    await check('codex_binary', 'Configured Codex binary is resolvable when required', async () => {
      if (this.agentProvider.name !== 'codex-exec') return 'Not required for the configured mock provider';
      const resolved = await resolveExecutable(this.agentProvider.binary, { cwd: this.git.targetRepoPath });
      if (!resolved) throw new Error(`Codex binary cannot be resolved: ${this.agentProvider.binary}`);
      return resolved;
    });
    if ((await this.store.read()).runs[runId]?.agentCheck) {
      await check('agent_health', 'Explicit non-writing provider health check', async () => {
        const result = await this.agentProvider.healthCheck({
          cwd: this.git.targetRepoPath,
          runId,
          logDir: this.logDir,
          model: this.loaded.manifest.defaults.agent.model,
          timeoutMs: this.loaded.manifest.defaults.agent.timeout_ms,
        });
        if (result.exitCode !== 0) throw new Error(`Provider health check exited with code ${result.exitCode}`);
        return { provider: result.provider, model: this.loaded.manifest.defaults.agent.model ?? null };
      });
    }
    return {
      passed: checks.every((candidate) => candidate.passed),
      checkedAt: nowIso(),
      agentCheckRequested: Boolean((await this.store.read()).runs[runId]?.agentCheck),
      checks,
    };
  }

  #requeueExpiredClaims(state) {
    const now = Date.now();
    for (const run of Object.values(state.runs)) {
      if (run.status !== 'claimed' || !run.claimLeaseExpiresAt) continue;
      if (Date.parse(run.claimLeaseExpiresAt) > now) continue;
      run.status = 'queued';
      delete run.claimedBy;
      delete run.claimedAt;
      delete run.claimLeaseExpiresAt;
      if (!state.queue.includes(run.id)) state.queue.push(run.id);
    }
  }
}

function transitionStage(state, stageId, nextStatus, patch = {}) {
  const runtime = state.stages[stageId];
  if (!runtime) throw new Error(`Unknown stage runtime: ${stageId}`);
  assertStageTransition(runtime.status, nextStatus);
  Object.assign(runtime, patch, { status: nextStatus, updatedAt: nowIso() });
}

function transitionStageForVerificationRecovery(state, stageId, runId) {
  const runtime = state.stages[stageId];
  if (!runtime) throw new Error(`Unknown stage runtime: ${stageId}`);
  const run = requiredRun(state, runId);
  assertVerificationRecoveryTransition(stageId, runtime, runId, run);
  Object.assign(runtime, { status: 'verifying', updatedAt: nowIso() });
}

function assertVerificationRecoveryState(state, stageId, runId, expected = undefined) {
  const runtime = state.stages[stageId];
  if (!runtime) throw new Error(`Unknown stage runtime: ${stageId}`);
  const run = requiredRun(state, runId);
  assertVerificationRecoveryTransition(stageId, runtime, runId, run);
  if (expected && (run.branch !== expected.branch
    || run.worktreePath !== expected.worktreePath
    || run.baseCommit !== expected.baseCommit)) {
    throw new Error(`Run ${runId} recovery context changed before recovery could start`);
  }
  if (run.resultCommit) {
    throw new Error(`Run ${runId} already has a stage commit and cannot resume from pre-commit verification`);
  }
  if (!run.agent || run.agent.exitCode !== 0) {
    throw new Error(`Run ${runId} has no successful builder evidence to preserve`);
  }
}

function requiredRun(state, runId) {
  const run = state.runs[runId];
  if (!run) throw new Error(`Unknown run: ${runId}`);
  return run;
}

function initialLifecycleGates(stage) {
  return {
    implementation: gate('in_progress', 'Builder implementation is in progress.'),
    preCommitVerification: gate('pending', 'Runs after the builder leaves its intended changes uncommitted.'),
    orchestratorCommit: gate('pending', 'Runs only after pre-commit verification passes.'),
    humanApproval: stage.requires_human_approval
      ? gate('pending', 'Runs only after the orchestrator commit.')
      : gate('not_required', 'This stage does not require human approval.'),
    postApprovalIntegration: gate('pending', 'Integration movement and push run only after all earlier gates.'),
  };
}

function gate(status, detail) {
  return { status, detail, updatedAt: nowIso() };
}

function appendVerificationRecord(run, verification, attemptId) {
  if (!run.verificationRecords) {
    run.verificationRecords = [];
    if (run.verification) {
      run.verificationRecords.push({
        attemptId: 'initial',
        recordedAt: run.finishedAt ?? nowIso(),
        ...run.verification,
      });
    }
  }
  run.verification = verification;
  run.verificationRecords.push({ attemptId, recordedAt: nowIso(), ...verification });
}

function currentRecoveryAttempt(run, attemptId) {
  const attempt = run.recoveryAttempts?.find((candidate) => candidate.id === attemptId);
  if (!attempt) throw new Error(`Missing recovery attempt ${attemptId}`);
  return attempt;
}
