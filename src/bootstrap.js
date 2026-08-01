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
import { resolveExecutable } from './utils/process.js';

const IMPLEMENTED_PROVIDERS = new Set(['mock', 'codex-exec']);

export async function bootstrap(config = loadConfig()) {
  const loaded = await loadManifest(config.manifestPath);
  applyRuntimeOverrides(loaded, config);
  const providerName = config.agentProvider ?? loaded.manifest.defaults.agent.provider;
  if (!IMPLEMENTED_PROVIDERS.has(providerName)) {
    throw new Error(`Unsupported AGENT_PROVIDER: ${providerName}. Implemented providers: ${[...IMPLEMENTED_PROVIDERS].join(', ')}`);
  }
  const agentDefaults = loaded.manifest.defaults.agent;
  if (agentDefaults.sandbox !== 'workspace-write') {
    throw new Error(`Builder sandbox must be workspace-write, received: ${agentDefaults.sandbox}`);
  }
  let codexBinary;
  if (providerName === 'codex-exec') {
    if (!agentDefaults.model) throw new Error('CODEX_MODEL is required when AGENT_PROVIDER=codex-exec');
    codexBinary = await resolveExecutable(config.codexBin);
    if (!codexBinary) throw new Error(`Codex binary cannot be resolved: ${config.codexBin}`);
  }
  for (const stage of loaded.stages.values()) stage.verification.verifier_agent.sandbox = 'read-only';
  loaded.manifest.defaults.verification.verifier_agent.sandbox = 'read-only';
  const store = new JsonStateStore(config.statePath, config.eventLogPath);
  const programme = new ProgrammeService(loaded, store);
  await programme.initialise();
  const targetRepoPath = config.targetRepoPath ?? loaded.manifest.programme.target_repository.local_path;
  if (!targetRepoPath) throw new Error('TARGET_REPO_PATH or programme.target_repository.local_path is required');
  const agentProvider = providerName === 'codex-exec' ? new CodexExecProvider(codexBinary) : new MockAgentProvider();
  const logDir = path.resolve(path.dirname(config.statePath), 'runs');
  const git = new GitService(
    path.resolve(targetRepoPath),
    config.worktreeRoot,
    loaded.manifest.programme.target_repository.remote,
    loaded.manifest.defaults.git.integration_branch,
  );
  const verification = new VerificationService(loaded, agentProvider, logDir);
  const execution = new ExecutionService(loaded, store, programme, git, agentProvider, verification, logDir);
  return { config, loaded, store, programme, git, agentProvider, verification, execution };
}

function applyRuntimeOverrides(loaded, config) {
  const agent = loaded.manifest.defaults.agent;
  if (config.agentProvider) agent.provider = config.agentProvider;
  if (config.codexModel) agent.model = config.codexModel;
  if (config.codexSandbox) agent.sandbox = config.codexSandbox;
  if (config.codexTimeoutMs) agent.timeout_ms = config.codexTimeoutMs;
}
