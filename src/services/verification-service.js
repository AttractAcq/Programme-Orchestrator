import { runCommand } from '../utils/process.js';

export class VerificationService {
  constructor(loaded, agentProvider, logDir) {
    this.loaded = loaded;
    this.agentProvider = agentProvider;
    this.logDir = logDir;
  }

  async verify({ stageId, runId, cwd, signal, stagePrompt, executionPolicy, baseCommit, resultCommit, diffContext }) {
    const stage = this.loaded.stages.get(stageId);
    if (!stage) throw new Error(`Unknown stage: ${stageId}`);
    const deterministic = await this.runDeterministic({ stageId, cwd, signal });
    if (!deterministic.passed) return { passed: false, deterministic: deterministic.results };

    const independent = await this.runIndependent({
      stageId, runId, cwd, signal, stagePrompt, executionPolicy, baseCommit, resultCommit, diffContext,
    });
    return { ...independent, deterministic: deterministic.results };
  }

  async runDeterministic({ stageId, cwd, signal }) {
    const stage = this.loaded.stages.get(stageId);
    if (!stage) throw new Error(`Unknown stage: ${stageId}`);
    const commands = [...this.loaded.manifest.defaults.verification.commands, ...stage.verification.commands];
    const results = [];
    for (const command of commands) {
      const result = await runCommand(command.command, command.args ?? [], {
        cwd, timeoutMs: command.timeout_ms, env: command.env, signal,
      });
      results.push(result);
      if (result.exitCode !== 0) return { passed: false, results };
    }
    return { passed: true, results };
  }

  async runIndependent({ stageId, runId, cwd, signal, stagePrompt, executionPolicy, baseCommit, resultCommit, diffContext }) {
    const stage = this.loaded.stages.get(stageId);
    if (!stage) throw new Error(`Unknown stage: ${stageId}`);
    const verifier = stage.verification.verifier_agent.enabled
      ? stage.verification.verifier_agent
      : this.loaded.manifest.defaults.verification.verifier_agent;
    if (!verifier.enabled) return { passed: true };

    const prompt = buildVerifierPrompt({
      stage,
      stagePrompt,
      executionPolicy,
      baseCommit,
      resultCommit,
      diffContext,
      additionalPrompt: verifier.prompt,
    });
    const agentDefaults = this.loaded.manifest.defaults.agent;
    const agent = await this.agentProvider.execute({
      prompt, cwd, runId: `${runId}-verifier`, logDir: this.logDir,
      model: agentDefaults.model,
      sandbox: 'read-only', timeoutMs: agentDefaults.timeout_ms, signal,
    });
    const summary = agent.lastMessage ?? '';
    const lines = summary.trim().split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const verdict = lines.at(-1);
    const findings = lines.slice(0, -1);
    const genuineBlockers = findings.filter((line) => line.startsWith('GENUINE_BLOCKER:'));
    const lifecyclePending = findings.filter((line) => line.startsWith('LIFECYCLE_PENDING:'));
    const lifecycleOnlyFailure = verdict === 'VERIFICATION_FAILED'
      && lifecyclePending.length > 0
      && genuineBlockers.length === 0
      && findings.every((line) => line.startsWith('LIFECYCLE_PENDING:'));
    return {
      passed: agent.exitCode === 0
        && genuineBlockers.length === 0
        && (verdict === 'VERIFICATION_PASSED' || lifecycleOnlyFailure),
      verifierAgent: agent,
      verifierSummary: summary,
      classifications: { genuineBlockers, lifecyclePending },
      ...(lifecycleOnlyFailure ? { normalizedLifecycleOnlyVerdict: true } : {}),
    };
  }
}

export function buildVerifierPrompt({ stage, stagePrompt, executionPolicy, baseCommit, resultCommit, diffContext, additionalPrompt }) {
  return [
    'INDEPENDENT PROGRAMME STAGE VERIFICATION',
    '',
    `Stage ID: ${stage.id}`,
    `Stage name: ${stage.name}`,
    `Base commit: ${baseCommit ?? 'unavailable'}`,
    `Result commit: ${resultCommit ?? 'not committed; evaluate the current worktree context below'}`,
    'Verification phase: PRE-COMMIT',
    '',
    'You are a read-only verifier. Do not modify, create, delete, stage, commit, or otherwise change any file or Git ref.',
    'Evaluate every objective, required output, acceptance criterion, and exit gate in the exact stage prompt below.',
    'For every claim, distinguish code-confirmed, test-confirmed, live-verified, mocked, deferred, and blocked evidence.',
    '',
    'PRE-COMMIT SEMANTICS AND GATE OWNERSHIP:',
    '- Implementation gates are in scope: correctness, completeness, safety, relevance, and required implementation evidence.',
    '- Pre-commit verification gates are in scope: deterministic checks, independent inspection, and truthful evidence classification.',
    '- Orchestrator commit gates are later lifecycle actions. HEAD is expected to equal or descend from the base commit, intended changes are expected to be uncommitted, and the worktree is expected to be dirty.',
    '- Human approval gates are later lifecycle actions and cannot be satisfied during this verification.',
    '- Post-approval integration/push gates are later lifecycle actions. No stage branch or integration branch is expected to have been pushed and no final snapshot SHA is expected to exist yet.',
    '- Do not fail solely because the worktree is dirty, HEAD is still the base commit, a stage commit is absent, refs are not pushed, approval is pending, or a final snapshot SHA is absent.',
    '- Classify those observations as LIFECYCLE_PENDING; the orchestrator will commit only after this verdict passes, then await approval, advance the integration branch, and push only that approved integration branch.',
    '- Do fail for an incorrect or incomplete implementation, failed checks, unsafe or unrelated changes, missing required evidence, unsupported/mocked/stale verification claims, or any genuine acceptance criterion that the later commit/approval/push lifecycle cannot satisfy.',
    '- Current required live verification and a required reproducible migration chain remain genuine blockers when the stage authority requires them.',
    '- A VERIFICATION_FAILED verdict must identify at least one genuine blocker. If every finding is only LIFECYCLE_PENDING, the verdict must be VERIFICATION_PASSED.',
    '- Report each finding on one line prefixed exactly GENUINE_BLOCKER: or LIFECYCLE_PENDING:. A lifecycle-only failed verdict is normalized to pass; unclassified or mixed failed reports remain failed closed.',
    'Do not rely on finding authority documents yourself; the complete standalone authority is embedded below.',
    additionalPrompt ? `Additional verifier guidance (subordinate to the authority and policy):\n${additionalPrompt}` : undefined,
    '',
    '--- BEGIN IMMUTABLE ORCHESTRATOR EXECUTION POLICY ---',
    executionPolicy,
    '--- END IMMUTABLE ORCHESTRATOR EXECUTION POLICY ---',
    '',
    '--- BEGIN EXACT STANDALONE STAGE PROMPT ---',
    stagePrompt,
    '--- END EXACT STANDALONE STAGE PROMPT ---',
    '',
    '--- BEGIN RESULT OR WORKTREE CONTEXT ---',
    diffContext ?? '(no diff context available)',
    '--- END RESULT OR WORKTREE CONTEXT ---',
    '',
    'Give a concise evidence-based report. The final line must contain exactly one of the following verdicts:',
    'VERIFICATION_PASSED',
    'VERIFICATION_FAILED',
  ].filter((line) => line !== undefined).join('\n');
}
