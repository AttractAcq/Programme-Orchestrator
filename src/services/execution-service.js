import { mkdir, readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { assertStageTransition } from '../domain/state-machine.js';
import { nowIso } from '../utils/time.js';

const ACTIVE_RUN_STATUSES = new Set(['claimed', 'running', 'verifying', 'awaiting_approval']);

export class ExecutionService {
  #controllers = new Map();

  constructor(loaded, store, programme, git, agentProvider, verification, logDir) {
    Object.assign(this, { loaded, store, programme, git, agentProvider, verification, logDir });
  }

  async enqueue(stageId, requestedBy, dryRun = false) {
    const stage = this.loaded.stages.get(stageId);
    if (!stage) throw new Error(`Unknown stage: ${stageId}`);
    const run = {
      id: randomUUID(),
      stageId,
      status: 'queued',
      requestedBy,
      dryRun,
      createdAt: nowIso(),
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
    }, { stageId, runId: run.id, requestedBy, dryRun });
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
        });
        delete run.claimLeaseExpiresAt;
        transitionStage(state, stage.id, 'running', {
          branch: worktree.branch,
          worktreePath: worktree.path,
        });
      }, { runId, stageId: stage.id, branch: worktree.branch });

      const prompt = await readFile(this.programme.resolvePromptPath(stage.id), 'utf8');
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
        transitionStage(state, stage.id, 'verifying');
      }, { runId, stageId: stage.id });

      const verification = await this.verification.verify(stage.id, runId, worktree.path, controller.signal);
      await this.store.update('stage.verification-result', (state) => {
        requiredRun(state, runId).verification = verification;
      }, { runId, stageId: stage.id, passed: verification.passed });
      if (!verification.passed) throw new Error('Stage verification failed');

      let resultCommit;
      if (gitDefaults.auto_commit) {
        resultCommit = await this.git.commitAll(worktree.path, `build(${stage.id}): complete programme stage`);
      }
      if (!resultCommit && !stage.allow_no_changes) {
        throw new Error(`Stage ${stage.id} produced no commit; set allow_no_changes only for an intentional no-op stage`);
      }
      if (gitDefaults.auto_push && resultCommit) await this.git.pushBranch(worktree.path, worktree.branch);

      if (!stage.requires_human_approval && resultCommit) {
        await this.git.advanceIntegrationBranch(gitDefaults.integration_branch, resultCommit);
        if (gitDefaults.push_integration_branch) await this.git.pushIntegrationBranch(gitDefaults.integration_branch);
      }

      const finalStatus = stage.requires_human_approval ? 'awaiting_approval' : 'completed';
      const finalRun = await this.store.update('stage.executed', (state) => {
        const run = requiredRun(state, runId);
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
        delete run.claimLeaseExpiresAt;
        transitionStage(state, run.stageId, status, { lastError: message });
        return structuredClone(run);
      }, { runId, stageId: existing.stageId, error: message });
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
      if (gitDefaults.push_integration_branch) await this.git.pushIntegrationBranch(gitDefaults.integration_branch);
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
    this.#controllers.get(runId)?.abort();
    await this.store.update('stage.cancel.requested', (state) => {
      const run = requiredRun(state, runId);
      if (['queued', 'claimed'].includes(run.status)) {
        state.queue = state.queue.filter((id) => id !== runId);
        Object.assign(run, { status: 'cancelled', finishedAt: nowIso() });
        delete run.claimLeaseExpiresAt;
        transitionStage(state, run.stageId, 'cancelled');
      }
    }, { runId });
  }

  async completeDryRun(runId, stage) {
    return this.store.update('stage.dry-run', (state) => {
      const run = requiredRun(state, runId);
      state.queue = state.queue.filter((id) => id !== runId);
      Object.assign(run, {
        status: 'completed',
        finishedAt: nowIso(),
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
      });
      transitionStage(state, stage.id, 'ready');
      return structuredClone(run);
    }, { runId, stageId: stage.id });
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

function requiredRun(state, runId) {
  const run = state.runs[runId];
  if (!run) throw new Error(`Unknown run: ${runId}`);
  return run;
}
