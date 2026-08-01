import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadManifest } from '../src/manifest/loader.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('production manifest contains the complete 43-stage programme', async () => {
  const loaded = await loadManifest(path.join(root, 'config', 'BUILD_SEQUENCE.json'));
  assert.equal(loaded.phases.size, 4);
  assert.equal(loaded.stages.size, 43);
  assert.deepEqual([...loaded.phases.keys()], ['phase-1', 'phase-1b', 'phase-2a', 'phase-2b']);
  assert.equal(loaded.manifest.phases[0].stages[0].id, 'A');
  assert.equal(loaded.manifest.phases.at(-1).stages.at(-1).id, 'AI-N');
});

test('phase boundaries enforce the complete previous phase', async () => {
  const loaded = await loadManifest(path.join(root, 'config', 'BUILD_SEQUENCE.json'));
  const firstFacebook = loaded.stages.get('1B-A');
  const firstMarket = loaded.stages.get('2A-A');
  const firstAi = loaded.stages.get('AI-A');
  assert.equal(firstFacebook.effectiveDependsOn.length, 16);
  assert.ok(firstFacebook.effectiveDependsOn.includes('P'));
  assert.equal(firstMarket.effectiveDependsOn.length, 6);
  assert.ok(firstMarket.effectiveDependsOn.includes('1B-F'));
  assert.equal(firstAi.effectiveDependsOn.length, 7);
  assert.ok(firstAi.effectiveDependsOn.includes('2A-G'));
});

test('production Git policy pushes approved integration work but never stage branches', async () => {
  const loaded = await loadManifest(path.join(root, 'config', 'BUILD_SEQUENCE.json'));
  assert.equal(loaded.manifest.defaults.git.auto_push, false);
  assert.equal(loaded.manifest.defaults.git.push_integration_branch, true);
  assert.equal(loaded.manifest.defaults.git.base_branch, 'main');
  assert.equal(loaded.manifest.defaults.git.integration_branch, 'programme/cockpit-complete-build');
});
