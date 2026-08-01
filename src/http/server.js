import http from 'node:http';
import { URL } from 'node:url';

const MAX_BODY_BYTES = 1_048_576;

export function buildServer(deps) {
  return http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      if (url.pathname !== '/health' && deps.apiToken && request.headers.authorization !== `Bearer ${deps.apiToken}`) {
        return send(response, 401, { error: 'unauthorised' });
      }
      if (request.method === 'GET' && url.pathname === '/health') {
        return send(response, 200, { ok: true, service: 'cockpit-programme-orchestrator' });
      }
      if (request.method === 'GET' && url.pathname === '/api/programme') {
        return send(response, 200, await deps.programme.snapshot());
      }
      if (request.method === 'GET' && url.pathname === '/api/state') {
        return send(response, 200, await deps.store.read());
      }
      if (request.method === 'GET' && url.pathname === '/api/runs') {
        const state = await deps.store.read();
        return send(response, 200, Object.values(state.runs));
      }
      let match = url.pathname.match(/^\/api\/runs\/([^/]+)$/);
      if (request.method === 'GET' && match) {
        const state = await deps.store.read();
        const run = state.runs[decodeURIComponent(match[1])];
        return run ? send(response, 200, run) : send(response, 404, { error: 'run-not-found' });
      }

      const body = await readJsonBody(request);
      if (request.method === 'POST' && url.pathname === '/api/programme/pause') {
        await deps.programme.pause(body.reason);
        return send(response, 200, await deps.programme.snapshot());
      }
      if (request.method === 'POST' && url.pathname === '/api/programme/resume') {
        await deps.programme.resume();
        return send(response, 200, await deps.programme.snapshot());
      }
      if (request.method === 'POST' && url.pathname === '/api/programme/run-next') {
        const stageId = await deps.programme.nextReadyStageId();
        if (!stageId) return send(response, 409, { error: 'no-ready-stage' });
        return send(response, 202, await deps.execution.enqueue(stageId, body.requestedBy ?? 'api', body.dryRun ?? false));
      }

      match = url.pathname.match(/^\/api\/stages\/([^/]+)\/run$/);
      if (request.method === 'POST' && match) {
        return send(response, 202, await deps.execution.enqueue(
          decodeURIComponent(match[1]),
          body.requestedBy ?? 'api',
          body.dryRun ?? false,
        ));
      }
      match = url.pathname.match(/^\/api\/runs\/([^/]+)\/(cancel|approve|reject)$/);
      if (request.method === 'POST' && match) {
        const runId = decodeURIComponent(match[1]);
        const action = match[2];
        if (action === 'cancel') {
          await deps.execution.cancel(runId);
          return send(response, 200, { ok: true });
        }
        if (action === 'approve') {
          return send(response, 200, await deps.execution.approve(runId, body.decidedBy ?? 'api', body.note));
        }
        return send(response, 200, await deps.execution.reject(runId, body.decidedBy ?? 'api', body.note));
      }
      return send(response, 404, { error: 'not-found' });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const status = message.includes('not runnable')
        || message.includes('Maximum concurrent')
        || message.includes('paused')
        || message.includes('awaiting approval') ? 409 : 400;
      return send(response, status, { error: message });
    }
  });
}

function send(response, status, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  });
  response.end(body);
}

async function readJsonBody(request) {
  if (!['POST', 'PUT', 'PATCH'].includes(request.method ?? '')) return {};
  const chunks = [];
  let total = 0;
  for await (const chunk of request) {
    total += chunk.length;
    if (total > MAX_BODY_BYTES) throw new Error('Request body exceeds 1 MiB limit');
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  return JSON.parse(raw);
}
