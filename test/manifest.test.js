import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { loadManifest } from '../src/manifest/loader.js';

async function fixture(stages) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'cpo-manifest-'));
  await mkdir(path.join(dir, 'prompts'));
  for (const id of ['a','b']) await writeFile(path.join(dir, `prompts/${id}.md`), id);
  const file = path.join(dir, 'build.json');
  await writeFile(file, JSON.stringify({
    schema_version: 1,
    programme: { id: 'test', name: 'Test', target_repository: { full_name: 'AttractAcq/Cockpit' } },
    phases: [{ id: 'p1', name: 'P1', stages }],
  }));
  return file;
}

test('loads a valid graph', async () => {
  const loaded = await loadManifest(await fixture([
    { id: 'A', name: 'A', prompt_path: 'prompts/a.md' },
    { id: 'B', name: 'B', prompt_path: 'prompts/b.md', depends_on: ['A'] },
  ]));
  assert.equal(loaded.stages.size, 2);
  assert.deepEqual(loaded.stages.get('B').depends_on, ['A']);
});

test('rejects unknown dependency', async () => {
  await assert.rejects(loadManifest(await fixture([
    { id: 'A', name: 'A', prompt_path: 'prompts/a.md', depends_on: ['X'] },
  ])), /Unknown stage dependency/);
});

test('rejects cycles', async () => {
  await assert.rejects(loadManifest(await fixture([
    { id: 'A', name: 'A', prompt_path: 'prompts/a.md', depends_on: ['B'] },
    { id: 'B', name: 'B', prompt_path: 'prompts/b.md', depends_on: ['A'] },
  ])), /Dependency cycle/);
});
