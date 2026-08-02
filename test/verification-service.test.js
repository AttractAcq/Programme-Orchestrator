import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ORCHESTRATOR_EXECUTION_POLICY } from '../src/services/execution-policy.js';
import { VerificationService } from '../src/services/verification-service.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stageAPromptPath = path.join(root, 'config/programme/phase-1/prompts/stage-a.md');

async function verifyStageA(summary) {
  const stage = { id: 'A', name: 'Repository Reconciliation and Frozen Baseline', verification: { commands: [], verifier_agent: { enabled: true } } };
  const loaded = {
    stages: new Map([['A', stage]]),
    manifest: { defaults: {
      agent: { model: 'test-model', timeout_ms: 1000 },
      verification: { commands: [], verifier_agent: { enabled: true, sandbox: 'read-only' } },
    } },
  };
  const provider = { execute: async () => ({ exitCode: 0, lastMessage: summary }) };
  const service = new VerificationService(loaded, provider, '/tmp/stage-a-contract-tests');
  return service.verify({
    stageId: 'A',
    runId: 'stage-a-contract-test',
    cwd: root,
    stagePrompt: await readFile(stageAPromptPath, 'utf8'),
    executionPolicy: ORCHESTRATOR_EXECUTION_POLICY,
    baseCommit: '7d4c1b96cdd7f3a59e28dc9826b44b1aad3b4e5e',
    diffContext: 'frozen Stage A fixture',
  });
}

test('a failed frozen Stage A gate produces a genuine blocker', async () => {
  const result = await verifyStageA([
    'GENUINE_BLOCKER: GATE_8: database evidence binding differs from current SQL bytes',
    'VERIFICATION_FAILED',
  ].join('\n'));
  assert.equal(result.passed, false);
  assert.deepEqual(result.classifications.genuineBlockers, [
    'GENUINE_BLOCKER: GATE_8: database evidence binding differs from current SQL bytes',
  ]);
});

test('a lifecycle item cannot produce a Stage A genuine blocker', async () => {
  const result = await verifyStageA([
    'LIFECYCLE_PENDING: snapshot commit is owned by the Programme Orchestrator',
    'VERIFICATION_FAILED',
  ].join('\n'));
  assert.equal(result.passed, true);
  assert.equal(result.normalizedStageAFrozenContractVerdict, true);
  assert.deepEqual(result.classifications.genuineBlockers, []);
});

test('a deferred external-state item cannot produce a Stage A genuine blocker', async () => {
  const result = await verifyStageA([
    'DEFERRED_EXTERNAL_STATE: provider account configuration remains operator-managed',
    'VERIFICATION_FAILED',
  ].join('\n'));
  assert.equal(result.passed, true);
  assert.equal(result.normalizedStageAFrozenContractVerdict, true);
  assert.equal(result.classifications.deferredExternalState.length, 1);
});

test('a non-blocking improvement cannot produce a Stage A genuine blocker', async () => {
  const result = await verifyStageA([
    'NON_BLOCKING_IMPROVEMENT: add more exhaustive ACL behavior coverage',
    'VERIFICATION_FAILED',
  ].join('\n'));
  assert.equal(result.passed, true);
  assert.equal(result.normalizedStageAFrozenContractVerdict, true);
  assert.equal(result.classifications.nonBlockingImprovements.length, 1);
});

test('a newly imagined requirement outside Gates 1–12 cannot block Stage A', async () => {
  const result = await verifyStageA([
    'GENUINE_BLOCKER: GATE_13: require a second independent forensic transcript authority',
    'VERIFICATION_FAILED',
  ].join('\n'));
  assert.equal(result.passed, true);
  assert.equal(result.normalizedStageAFrozenContractVerdict, true);
  assert.deepEqual(result.classifications.genuineBlockers, []);
  assert.equal(result.classifications.outOfContractRequirements.length, 1);
});

test('Stage A passes when all frozen gates pass and only non-blocking classes remain', async () => {
  const result = await verifyStageA([
    'LIFECYCLE_PENDING: result commit SHA will be created after verification',
    'DEFERRED_EXTERNAL_STATE: Vault values remain external',
    'NON_BLOCKING_IMPROVEMENT: consider optional transcript presentation refinements',
    'VERIFICATION_PASSED',
  ].join('\n'));
  assert.equal(result.passed, true);
  assert.deepEqual(result.classifications.genuineBlockers, []);
});

test('unscoped blocker syntax cannot expand the frozen Stage A contract', async () => {
  const result = await verifyStageA([
    'GENUINE_BLOCKER: require every database object to receive exhaustive behavioral testing',
    'VERIFICATION_FAILED',
  ].join('\n'));
  assert.equal(result.passed, true);
  assert.equal(result.classifications.outOfContractRequirements.length, 1);
});

test('the Stage A verifier prompt embeds the finite contract before the original authority', async () => {
  let request;
  const stage = { id: 'A', name: 'Stage A', verification: { commands: [], verifier_agent: { enabled: true } } };
  const prompt = await readFile(stageAPromptPath, 'utf8');
  const loaded = {
    stages: new Map([['A', stage]]),
    manifest: { defaults: {
      agent: { model: 'test-model', timeout_ms: 1000 },
      verification: { commands: [], verifier_agent: { enabled: true } },
    } },
  };
  const service = new VerificationService(loaded, { execute: async (value) => {
    request = value;
    return { exitCode: 0, lastMessage: 'VERIFICATION_PASSED' };
  } }, '/tmp/stage-a-contract-tests');
  await service.verify({
    stageId: 'A', runId: 'prompt-test', cwd: root, stagePrompt: prompt,
    executionPolicy: ORCHESTRATOR_EXECUTION_POLICY, baseCommit: 'base', diffContext: 'diff',
  });
  assert.match(request.prompt, /finite acceptance contract and take precedence/);
  assert.match(request.prompt, /GENUINE_BLOCKER: GATE_n:/);
  for (let gate = 1; gate <= 12; gate += 1) assert.ok(request.prompt.includes(`### Gate ${gate} —`));
  assert.ok(request.prompt.indexOf('--- BEGIN FROZEN STAGE A VERIFICATION ACCEPTANCE CONTRACT ---')
    < request.prompt.indexOf('--- BEGIN EXACT STANDALONE STAGE PROMPT ---'));
});
