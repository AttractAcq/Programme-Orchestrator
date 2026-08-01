import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { bootstrap } from '../src/bootstrap.js';

test('bootstrap rejects an unimplemented agent provider instead of silently selecting mock', async () => {
  const config = await configFixture({ agentProvider: 'unknown-provider' });
  await assert.rejects(bootstrap(config), /Unsupported AGENT_PROVIDER/);
});

test('codex-exec startup requires a model and resolvable Codex binary', async () => {
  const withoutModel = await configFixture({ agentProvider: 'codex-exec', codexModel: undefined, codexBin: '/missing/codex' });
  await assert.rejects(bootstrap(withoutModel), /CODEX_MODEL is required/);
  const withoutBinary = await configFixture({ agentProvider: 'codex-exec', codexModel: 'test-model', codexBin: '/missing/codex' });
  await assert.rejects(bootstrap(withoutBinary), /Codex binary cannot be resolved/);
});

async function configFixture(overrides) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'cpo-bootstrap-'));
  await mkdir(path.join(root, 'prompts'));
  await mkdir(path.join(root, 'target'));
  await writeFile(path.join(root, 'prompts/a.md'), '# A\n');
  const manifestPath = path.join(root, 'manifest.json');
  await writeFile(manifestPath, JSON.stringify({
    schema_version: 1,
    programme: { id: 'test', name: 'Test', target_repository: { full_name: 'AttractAcq/Cockpit' } },
    defaults: { agent: { provider: 'mock', sandbox: 'workspace-write', timeout_ms: 1_000 } },
    phases: [{ id: 'p', name: 'P', stages: [{ id: 'A', name: 'A', prompt_path: 'prompts/a.md' }] }],
  }));
  return {
    manifestPath,
    statePath: path.join(root, 'state.json'),
    eventLogPath: path.join(root, 'events.jsonl'),
    worktreeRoot: path.join(root, 'worktrees'),
    targetRepoPath: path.join(root, 'target'),
    codexSandbox: 'workspace-write',
    codexTimeoutMs: 1_000,
    codexBin: 'codex',
    ...overrides,
  };
}
