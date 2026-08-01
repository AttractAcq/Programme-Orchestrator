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

export function assertVerificationRecoveryTransition(stageId, stage, runId, run) {
  if (stage.status !== 'ready') {
    throw new Error(`Stage ${stageId} is not ready for verification recovery; current status: ${stage.status}`);
  }
  if (run.id !== runId || run.stageId !== stageId) {
    throw new Error(`Run ${runId} does not match recovery stage ${stageId}`);
  }
  if (run.status !== 'failed') throw new Error(`Run ${runId} is not failed`);
  if (stage.activeRunId !== runId) {
    throw new Error(`Stage ${stageId} active run does not match failed run ${runId}`);
  }
  if (!run.branch || stage.branch !== run.branch) {
    throw new Error(`Stage ${stageId} branch does not match failed run ${runId}`);
  }
  if (!run.worktreePath || stage.worktreePath !== run.worktreePath) {
    throw new Error(`Stage ${stageId} worktree does not match failed run ${runId}`);
  }
}
