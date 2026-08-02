import { runCommand } from '../utils/process.js';

export const STAGE_A_FROZEN_CONTRACT_HEADING = '## Frozen Stage A verification acceptance contract';
export const STAGE_A_FROZEN_CONTRACT_END = '## Full-circle implementation instruction';
export const STAGE_A_GATE_IDS = Object.freeze(Array.from({ length: 12 }, (_, index) => `GATE_${index + 1}`));

function extractStageAFrozenContract(stagePrompt) {
  const start = stagePrompt.indexOf(STAGE_A_FROZEN_CONTRACT_HEADING);
  const end = stagePrompt.indexOf(STAGE_A_FROZEN_CONTRACT_END, start);
  if (start < 0 || end < 0) throw new Error('Stage A prompt is missing its frozen verification acceptance contract');
  const contract = stagePrompt.slice(start, end).trim();
  for (let gate = 1; gate <= 12; gate += 1) {
    if (!contract.includes(`### Gate ${gate} —`)) throw new Error(`Stage A frozen verification contract is missing Gate ${gate}`);
  }
  for (const classification of ['GENUINE_BLOCKER', 'LIFECYCLE_PENDING', 'DEFERRED_EXTERNAL_STATE', 'NON_BLOCKING_IMPROVEMENT']) {
    if (!contract.includes(classification)) throw new Error(`Stage A frozen verification contract is missing ${classification}`);
  }
  return contract;
}

function classifyDefaultFindings(findings, verdict) {
  const genuineBlockers = findings.filter((line) => line.startsWith('GENUINE_BLOCKER:'));
  const lifecyclePending = findings.filter((line) => line.startsWith('LIFECYCLE_PENDING:'));
  const lifecycleOnlyFailure = verdict === 'VERIFICATION_FAILED'
    && lifecyclePending.length > 0
    && genuineBlockers.length === 0
    && findings.every((line) => line.startsWith('LIFECYCLE_PENDING:'));
  return {
    genuineBlockers,
    lifecyclePending,
    passedVerdict: verdict === 'VERIFICATION_PASSED' || lifecycleOnlyFailure,
    ...(lifecycleOnlyFailure ? { normalizedLifecycleOnlyVerdict: true } : {}),
  };
}

export function classifyStageAFrozenFindings(findings, verdict) {
  const blockerPattern = /^GENUINE_BLOCKER: (GATE_(?:[1-9]|1[0-2])): .+/;
  const genuineBlockers = findings.filter((line) => blockerPattern.test(line));
  const lifecyclePending = findings.filter((line) => line.startsWith('LIFECYCLE_PENDING:'));
  const deferredExternalState = findings.filter((line) => line.startsWith('DEFERRED_EXTERNAL_STATE:'));
  const nonBlockingImprovements = findings.filter((line) => line.startsWith('NON_BLOCKING_IMPROVEMENT:'));
  const outOfContractRequirements = findings.filter((line) => line.startsWith('GENUINE_BLOCKER:') && !blockerPattern.test(line));
  const classified = new Set([
    ...genuineBlockers,
    ...lifecyclePending,
    ...deferredExternalState,
    ...nonBlockingImprovements,
    ...outOfContractRequirements,
  ]);
  const unclassifiedFindings = findings.filter((line) => !classified.has(line));
  const nonBlockingOnlyFailure = verdict === 'VERIFICATION_FAILED'
    && findings.length > 0
    && genuineBlockers.length === 0
    && unclassifiedFindings.length === 0;
  return {
    genuineBlockers,
    lifecyclePending,
    deferredExternalState,
    nonBlockingImprovements,
    outOfContractRequirements,
    unclassifiedFindings,
    passedVerdict: verdict === 'VERIFICATION_PASSED' || nonBlockingOnlyFailure,
    ...(nonBlockingOnlyFailure ? { normalizedStageAFrozenContractVerdict: true } : {}),
  };
}

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
    const classification = stageId === 'A'
      ? classifyStageAFrozenFindings(findings, verdict)
      : classifyDefaultFindings(findings, verdict);
    return {
      passed: agent.exitCode === 0
        && classification.genuineBlockers.length === 0
        && classification.passedVerdict,
      verifierAgent: agent,
      verifierSummary: summary,
      classifications: {
        genuineBlockers: classification.genuineBlockers,
        lifecyclePending: classification.lifecyclePending,
        ...(stageId === 'A' ? {
          deferredExternalState: classification.deferredExternalState,
          nonBlockingImprovements: classification.nonBlockingImprovements,
          outOfContractRequirements: classification.outOfContractRequirements,
          unclassifiedFindings: classification.unclassifiedFindings,
        } : {}),
      },
      ...(classification.normalizedLifecycleOnlyVerdict ? { normalizedLifecycleOnlyVerdict: true } : {}),
      ...(classification.normalizedStageAFrozenContractVerdict ? { normalizedStageAFrozenContractVerdict: true } : {}),
    };
  }
}

export function buildVerifierPrompt({ stage, stagePrompt, executionPolicy, baseCommit, resultCommit, diffContext, additionalPrompt }) {
  const stageAContract = stage.id === 'A' ? extractStageAFrozenContract(stagePrompt) : null;
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
    stageAContract
      ? 'Evaluate Stage A implementation verification only against the frozen Gates 1–12 embedded below. They are the finite acceptance contract and take precedence over broader or lifecycle-owned wording in the original Stage A prompt.'
      : 'Evaluate every objective, required output, acceptance criterion, and exit gate in the exact stage prompt below.',
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
    stageAContract
      ? '- For Stage A, do not invent, infer, or introduce an acceptance category outside frozen Gates 1–12. Stronger forensic attestation, additional representative coverage, and optional hardening outside those gates cannot block Stage A.'
      : '- Do fail for an incorrect or incomplete implementation, failed checks, unsafe or unrelated changes, missing required evidence, unsupported/mocked/stale verification claims, or any genuine acceptance criterion that the later commit/approval/push lifecycle cannot satisfy.',
    stageAContract
      ? '- A Stage A GENUINE_BLOCKER is valid only when it cites one frozen gate using exactly GENUINE_BLOCKER: GATE_n: description, where n is 1–12. An unscoped blocker or any other gate number is outside the frozen contract and cannot block Stage A.'
      : '- Current required live verification and a required reproducible migration chain remain genuine blockers when the stage authority requires them.',
    stageAContract
      ? '- Report every remaining Stage A finding on one line prefixed exactly GENUINE_BLOCKER: GATE_n:, LIFECYCLE_PENDING:, DEFERRED_EXTERNAL_STATE:, or NON_BLOCKING_IMPROVEMENT:. Do not emit unclassified findings.'
      : '- A VERIFICATION_FAILED verdict must identify at least one genuine blocker. If every finding is only LIFECYCLE_PENDING, the verdict must be VERIFICATION_PASSED.',
    stageAContract
      ? '- If all twelve gates pass and only lifecycle, deferred, non-blocking, or out-of-contract suggestions remain, the final verdict must be VERIFICATION_PASSED. The service also prevents those findings from being promoted into Stage A blockers.'
      : '- Report each finding on one line prefixed exactly GENUINE_BLOCKER: or LIFECYCLE_PENDING:. A lifecycle-only failed verdict is normalized to pass; unclassified or mixed failed reports remain failed closed.',
    'Do not rely on finding authority documents yourself; the complete standalone authority is embedded below.',
    additionalPrompt ? `Additional verifier guidance (subordinate to the authority and policy):\n${additionalPrompt}` : undefined,
    stageAContract ? '' : undefined,
    stageAContract ? '--- BEGIN FROZEN STAGE A VERIFICATION ACCEPTANCE CONTRACT ---' : undefined,
    stageAContract,
    stageAContract ? '--- END FROZEN STAGE A VERIFICATION ACCEPTANCE CONTRACT ---' : undefined,
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
