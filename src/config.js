import path from 'node:path';

export function loadConfig(overrides = {}) {
  const env = { ...process.env, ...overrides };
  return {
    host: env.HOST || '127.0.0.1',
    port: positiveInteger(env.PORT, 4317),
    manifestPath: path.resolve(env.MANIFEST_PATH || './config/BUILD_SEQUENCE.json'),
    statePath: path.resolve(env.STATE_PATH || './data/state.json'),
    eventLogPath: path.resolve(env.EVENT_LOG_PATH || './data/events.jsonl'),
    worktreeRoot: path.resolve(env.WORKTREE_ROOT || './.orchestrator/worktrees'),
    apiToken: env.ORCHESTRATOR_API_TOKEN || undefined,
    agentProvider: env.AGENT_PROVIDER || undefined,
    codexBin: env.CODEX_BIN || 'codex',
    codexModel: env.CODEX_MODEL || undefined,
    codexSandbox: env.CODEX_SANDBOX || 'workspace-write',
    codexTimeoutMs: positiveInteger(env.CODEX_TIMEOUT_MS, 7_200_000),
    workerPollMs: positiveInteger(env.WORKER_POLL_MS, 2_000),
    targetRepoPath: env.TARGET_REPO_PATH ? path.resolve(env.TARGET_REPO_PATH) : undefined,
  };
}

function positiveInteger(value, fallback) {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error(`Expected positive integer, received ${value}`);
  return parsed;
}
