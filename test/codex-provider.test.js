import test from 'node:test';
import assert from 'node:assert/strict';
import { chmod, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { CodexExecProvider } from '../src/providers/codex-exec-provider.js';

test('Codex provider streams JSONL and stderr while preserving the final message', async () => {
  const fixture = await fakeCodexFixture();
  const provider = new CodexExecProvider(fixture.binary);
  const pending = provider.execute({
    prompt: 'success', cwd: fixture.root, runId: 'stream', logDir: fixture.logs,
    model: 'same-model', sandbox: 'workspace-write', timeoutMs: 3_000,
  });
  const eventPath = path.join(fixture.logs, 'stream.codex.jsonl');
  const stderrPath = path.join(fixture.logs, 'stream.codex.stderr.log');
  await waitFor(eventPath, /first/);
  assert.match(await readFile(stderrPath, 'utf8'), /starting/);
  const result = await pending;
  assert.equal(result.exitCode, 0);
  assert.match(await readFile(eventPath, 'utf8'), /first[\s\S]*second/);
  assert.equal(await readFile(result.lastMessagePath, 'utf8'), 'FINAL_RESPONSE\n');
  assert.equal(result.lastMessage, 'FINAL_RESPONSE');
});

test('Codex provider retains partial logs after a non-zero exit', async () => {
  const fixture = await fakeCodexFixture();
  const provider = new CodexExecProvider(fixture.binary);
  const result = await provider.execute({
    prompt: 'fail', cwd: fixture.root, runId: 'failure', logDir: fixture.logs,
    model: 'same-model', sandbox: 'read-only', timeoutMs: 2_000,
  });
  assert.equal(result.exitCode, 2);
  assert.match(await readFile(result.eventLogPath, 'utf8'), /first/);
  assert.match(await readFile(result.stderrLogPath, 'utf8'), /starting/);
});

test('Codex provider retains partial logs after cancellation', async () => {
  const fixture = await fakeCodexFixture();
  const provider = new CodexExecProvider(fixture.binary);
  const controller = new AbortController();
  const pending = provider.execute({
    prompt: 'slow', cwd: fixture.root, runId: 'cancelled', logDir: fixture.logs,
    model: 'same-model', sandbox: 'read-only', timeoutMs: 5_000, signal: controller.signal,
  });
  const eventPath = path.join(fixture.logs, 'cancelled.codex.jsonl');
  await waitFor(eventPath, /first/);
  controller.abort();
  const result = await pending;
  assert.equal(result.exitCode, 130);
  assert.match(await readFile(result.eventLogPath, 'utf8'), /first/);
});

test('Codex provider retains partial logs after timeout', async () => {
  const fixture = await fakeCodexFixture();
  const provider = new CodexExecProvider(fixture.binary);
  const result = await provider.execute({
    prompt: 'slow', cwd: fixture.root, runId: 'timeout', logDir: fixture.logs,
    model: 'same-model', sandbox: 'read-only', timeoutMs: 1_500,
  });
  assert.equal(result.exitCode, 130);
  assert.match(await readFile(result.eventLogPath, 'utf8'), /first/);
  assert.match(await readFile(result.stderrLogPath, 'utf8'), /starting/);
});

async function fakeCodexFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'cpo-fake-codex-'));
  const logs = path.join(root, 'logs');
  const binary = path.join(root, 'fake-codex');
  await writeFile(binary, `#!/usr/bin/env node
const { writeFileSync } = require('node:fs');
const args = process.argv.slice(2);
const outputIndex = args.indexOf('--output-last-message');
const lastMessage = args[outputIndex + 1];
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  process.stdout.write(JSON.stringify({ event: 'first' }) + '\\n');
  process.stderr.write('starting\\n');
  if (input.includes('fail')) {
    setTimeout(() => process.exit(2), 50);
    return;
  }
  setTimeout(() => {
    process.stdout.write(JSON.stringify({ event: 'second' }) + '\\n');
    writeFileSync(lastMessage, 'FINAL_RESPONSE\\n');
  }, input.includes('slow') ? 2_000 : 600);
});
`);
  await chmod(binary, 0o755);
  return { root, logs, binary };
}

async function waitFor(file, pattern) {
  for (let attempt = 0; attempt < 150; attempt += 1) {
    try {
      if (pattern.test(await readFile(file, 'utf8'))) return;
    } catch {
      // The stream creates the file asynchronously.
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  assert.fail(`Timed out waiting for ${file}`);
}
