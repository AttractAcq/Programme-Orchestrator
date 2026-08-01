const allowed = {
  pending: new Set(['ready', 'blocked', 'cancelled']),
  ready: new Set(['queued', 'blocked', 'cancelled']),
  queued: new Set(['ready', 'running', 'cancelled', 'failed']),
  running: new Set(['verifying', 'failed', 'cancelled']),
  verifying: new Set(['awaiting_approval', 'completed', 'failed', 'cancelled']),
  awaiting_approval: new Set(['completed', 'failed', 'cancelled']),
  completed: new Set(),
  blocked: new Set(['ready', 'cancelled']),
  failed: new Set(['ready', 'queued', 'verifying', 'cancelled']),
  cancelled: new Set(['ready', 'queued']),
};

export function assertStageTransition(from, to) {
  if (from === to) return;
  if (!allowed[from]?.has(to)) throw new Error(`Invalid stage transition: ${from} -> ${to}`);
}
