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
    const commands = [...this.loaded.manifest.defaults.verification.commands, ...stage.verification.commands];
    const deterministic = [];
    for (const command of commands) {
      const result = await runCommand(command.command, command.args ?? [], {
        cwd, timeoutMs: command.timeout_ms, env: command.env, signal,
      });
      deterministic.push(result);
      if (result.exitCode !== 0) return { passed: false, deterministic };
    }

    const verifier = stage.verification.verifier_agent.enabled
      ? stage.verification.verifier_agent
      : this.loaded.manifest.defaults.verification.verifier_agent;
    if (!verifier.enabled) return { passed: true, deterministic };

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
    const verdict = summary.trim().split(/\r?\n/).at(-1);
    return {
      passed: agent.exitCode === 0 && verdict === 'VERIFICATION_PASSED',
      deterministic,
      verifierAgent: agent,
      verifierSummary: summary,
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
    '',
    'You are a read-only verifier. Do not modify, create, delete, stage, commit, or otherwise change any file or Git ref.',
    'Evaluate every objective, required output, acceptance criterion, and exit gate in the exact stage prompt below.',
    'For every claim, distinguish code-confirmed, test-confirmed, live-verified, mocked, deferred, and blocked evidence.',
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
