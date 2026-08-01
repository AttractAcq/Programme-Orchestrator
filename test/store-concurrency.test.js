import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { JsonStateStore } from '../src/store/json-store.js';

test('two store instances serialize updates through the filesystem lock', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'cpo-store-lock-'));
  const statePath = path.join(root, 'state.json');
  const eventsPath = path.join(root, 'events.jsonl');
  const first = new JsonStateStore(statePath, eventsPath);
  const second = new JsonStateStore(statePath, eventsPath);
  const writes = [];
  for (let index = 0; index < 20; index += 1) {
    const store = index % 2 === 0 ? first : second;
    writes.push(store.update('counter.increment', async (state) => {
      const current = state.counter ?? 0;
      await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 5)));
      state.counter = current + 1;
    }));
  }
  await Promise.all(writes);
  const state = await first.read();
  assert.equal(state.counter, 20);
  assert.equal(state.revision, 20);
  const events = (await readFile(eventsPath, 'utf8')).trim().split('\n');
  assert.equal(events.length, 20);
});
