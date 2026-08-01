import test from 'node:test';
import assert from 'node:assert/strict';
import { assertStageTransition, assertVerificationRecoveryTransition } from '../src/domain/state-machine.js';

test('normal stage path and failed-stage verification recovery are allowed', () => {
  for (const [from, to] of [['ready','queued'],['queued','running'],['running','verifying'],['verifying','awaiting_approval'],['awaiting_approval','completed'],['failed','verifying']]) {
    assert.doesNotThrow(() => assertStageTransition(from, to));
  }
});

test('ordinary ready stage cannot skip directly to verification', () => {
  assert.throws(() => assertStageTransition('ready', 'verifying'), /Invalid stage transition/);
  assert.throws(() => assertStageTransition('ready', 'completed'), /Invalid stage transition/);
});

test('exact ready-stage failed-run shape permits only the recovery-specific transition', () => {
  const runId = '372ae278-31ff-42aa-8855-2c4321e32a18';
  const branch = `orchestrator/A/${runId}`;
  const worktreePath = `/Users/alex/Downloads/Programme-Orchestrator/.orchestrator/worktrees/A-${runId}`;
  const stage = {
    stageId: 'A',
    status: 'ready',
    activeRunId: runId,
    branch,
    worktreePath,
    lastError: 'Stage verification failed',
  };
  const run = { id: runId, stageId: 'A', status: 'failed', branch, worktreePath };

  assert.doesNotThrow(() => assertVerificationRecoveryTransition('A', stage, runId, run));
  assert.throws(() => assertStageTransition(stage.status, 'verifying'), /Invalid stage transition: ready -> verifying/);
});
