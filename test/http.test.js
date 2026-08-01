import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { buildServer } from '../src/http/server.js';

test('health is public and programme endpoint is protected', async () => {
  const server = buildServer({
    apiToken: 'secret',
    programme: { snapshot: async () => ({ ok: true }) },
    store: { read: async () => ({}) },
    execution: {},
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const { port } = server.address();
  const health = await fetch(`http://127.0.0.1:${port}/health`);
  assert.equal(health.status, 200);
  const protectedResponse = await fetch(`http://127.0.0.1:${port}/api/programme`);
  assert.equal(protectedResponse.status, 401);
  server.close();
  await once(server, 'close');
});
