import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { loadManifest } from '../src/manifest/loader.js';
import { ProgrammeService } from '../src/services/programme-service.js';
import { JsonStateStore } from '../src/store/json-store.js';

test('only dependency-free stages become ready', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'cpo-programme-'));
  await mkdir(path.join(dir, 'prompts'));
  await writeFile(path.join(dir, 'prompts/a.md'), 'A');
  await writeFile(path.join(dir, 'prompts/b.md'), 'B');
  const manifestPath = path.join(dir, 'build.json');
  await writeFile(manifestPath, JSON.stringify({
    schema_version: 1,
    programme: { id: 'test', name: 'Test', target_repository: { full_name: 'AttractAcq/Cockpit' } },
    phases: [{ id: 'p1', name: 'P1', stages: [
      { id: 'A', name: 'A', prompt_path: 'prompts/a.md' },
      { id: 'B', name: 'B', prompt_path: 'prompts/b.md', depends_on: ['A'] },
    ] }],
  }));
  const loaded = await loadManifest(manifestPath);
  const store = new JsonStateStore(path.join(dir, 'state.json'), path.join(dir, 'events.jsonl'));
  const service = new ProgrammeService(loaded, store);
  await service.initialise();
  const snapshot = await service.snapshot();
  assert.equal(snapshot.stages.find((stage) => stage.stageId === 'A').status, 'ready');
  assert.equal(snapshot.stages.find((stage) => stage.stageId === 'B').status, 'blocked');
});
