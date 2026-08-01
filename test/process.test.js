import test from 'node:test';
import assert from 'node:assert/strict';
import { runCommand } from '../src/utils/process.js';

test('runCommand captures output and exit code', async () => {
  const result = await runCommand(process.execPath, ['-e', 'console.log("ok")']);
  assert.equal(result.exitCode, 0);
  assert.equal(result.stdout.trim(), 'ok');
});
