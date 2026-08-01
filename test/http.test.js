import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { Readable } from 'node:stream';
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

test('resume API exposes failed-run verification recovery', async () => {
  let received;
  const server = buildServer({
    programme: {}, store: {},
    execution: {
      async resumeRun(...args) {
        received = args;
        return { id: args[0], status: 'awaiting_approval' };
      },
    },
  });
  const request = Readable.from([Buffer.from(JSON.stringify({ from: 'verification', requestedBy: 'api-operator' }))]);
  Object.assign(request, { method: 'POST', url: '/api/runs/failed-run/resume', headers: {} });
  const completed = new Promise((resolve) => {
    const response = {
      writeHead(status, headers) { this.status = status; this.headers = headers; },
      end(body) { resolve({ status: this.status, body: JSON.parse(body) }); },
    };
    server.emit('request', request, response);
  });
  const response = await completed;
  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'awaiting_approval');
  assert.deepEqual(received, ['failed-run', 'verification', 'api-operator']);
});
