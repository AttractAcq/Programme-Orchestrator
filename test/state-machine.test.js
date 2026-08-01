import test from 'node:test';
import assert from 'node:assert/strict';
import { assertStageTransition } from '../src/domain/state-machine.js';

test('normal stage path and failed verification recovery are allowed', () => {
  for (const [from, to] of [['ready','queued'],['queued','running'],['running','verifying'],['verifying','awaiting_approval'],['awaiting_approval','completed'],['failed','verifying']]) {
    assert.doesNotThrow(() => assertStageTransition(from, to));
  }
});

test('invalid transition is rejected', () => {
  assert.throws(() => assertStageTransition('ready', 'completed'), /Invalid stage transition/);
});
