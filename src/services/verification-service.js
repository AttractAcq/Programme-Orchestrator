import { runCommand } from '../utils/process.js';

export class VerificationService {
  constructor(loaded, agentProvider, logDir) {
    this.loaded = loaded;
    this.agentProvider = agentProvider;
    this.logDir = logDir;
  }

  async verify(stageId, runId, cwd, signal) {
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

    const prompt = verifier.prompt ?? [
      `Independently verify Programme Stage ${stageId}.`,
      'Read the stage authority and inspect the repository changes.',
      'Do not modify files. Identify missing requirements, regressions, unsafe assumptions, and incomplete integrations.',
      'End with exactly VERIFICATION_PASSED or VERIFICATION_FAILED.',
    ].join('\n');
    const agent = await this.agentProvider.execute({
      prompt, cwd, runId: `${runId}-verifier`, logDir: this.logDir,
      sandbox: verifier.sandbox, timeoutMs: this.loaded.manifest.defaults.agent.timeout_ms, signal,
    });
    const summary = agent.lastMessage ?? '';
    return {
      passed: agent.exitCode === 0 && summary.includes('VERIFICATION_PASSED'),
      deterministic,
      verifierAgent: agent,
      verifierSummary: summary,
    };
  }
}
