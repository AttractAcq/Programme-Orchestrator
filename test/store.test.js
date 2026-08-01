import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { JsonStateStore } from '../src/store/json-store.js';

test('state updates are persisted with events', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'cpo-store-'));
  const store = new JsonStateStore(path.join(dir, 'state.json'), path.join(dir, 'events.jsonl'));
  await store.update('test.update', (state) => { state.paused = true; });
  assert.equal((await store.read()).paused, true);
  assert.match(await readFile(path.join(dir, 'events.jsonl'), 'utf8'), /test\.update/);
});
