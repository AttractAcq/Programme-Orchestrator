import path from 'node:path';
import { loadConfig } from './config.js';
import { loadManifest } from './manifest/loader.js';
import { CodexExecProvider } from './providers/codex-exec-provider.js';
import { MockAgentProvider } from './providers/mock-agent-provider.js';
import { ExecutionService } from './services/execution-service.js';
import { GitService } from './services/git-service.js';
import { ProgrammeService } from './services/programme-service.js';
import { VerificationService } from './services/verification-service.js';
import { JsonStateStore } from './store/json-store.js';

export async function bootstrap(config = loadConfig()) {
  const loaded = await loadManifest(config.manifestPath);
  applyRuntimeOverrides(loaded, config);
  const store = new JsonStateStore(config.statePath, config.eventLogPath);
  const programme = new ProgrammeService(loaded, store);
  await programme.initialise();
  const targetRepoPath = config.targetRepoPath ?? loaded.manifest.programme.target_repository.local_path;
  if (!targetRepoPath) throw new Error('TARGET_REPO_PATH or programme.target_repository.local_path is required');
  const providerName = config.agentProvider ?? loaded.manifest.defaults.agent.provider;
  const agentProvider = providerName === 'codex-exec' ? new CodexExecProvider(config.codexBin) : new MockAgentProvider();
  const logDir = path.resolve(path.dirname(config.statePath), 'runs');
  const git = new GitService(path.resolve(targetRepoPath), config.worktreeRoot, loaded.manifest.programme.target_repository.remote);
  const verification = new VerificationService(loaded, agentProvider, logDir);
  const execution = new ExecutionService(loaded, store, programme, git, agentProvider, verification, logDir);
  return { config, loaded, store, programme, execution };
}

function applyRuntimeOverrides(loaded, config) {
  const agent = loaded.manifest.defaults.agent;
  if (config.agentProvider) agent.provider = config.agentProvider;
  if (config.codexModel) agent.model = config.codexModel;
  if (config.codexSandbox) agent.sandbox = config.codexSandbox;
  if (config.codexTimeoutMs) agent.timeout_ms = config.codexTimeoutMs;
}
