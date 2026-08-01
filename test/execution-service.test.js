import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { loadManifest } from '../src/manifest/loader.js';
import { ExecutionService } from '../src/services/execution-service.js';
import { buildBuilderPrompt, ORCHESTRATOR_EXECUTION_POLICY } from '../src/services/execution-policy.js';
import { GitService } from '../src/services/git-service.js';
import { ProgrammeService } from '../src/services/programme-service.js';
import { VerificationService } from '../src/services/verification-service.js';
import { JsonStateStore } from '../src/store/json-store.js';
import { runCommand } from '../src/utils/process.js';

test('successful dry-run performs preflight without changing stages, refs, worktrees, commits, or invoking builder', async () => {
  const fixture = await executionFixture();
  const beforeHead = await revParse(fixture.target, 'HEAD');
  const beforeRefs = await refs(fixture.target);
  const run = await fixture.execution.enqueue('A', 'test', true);
  const result = await fixture.execution.execute(run.id);

  assert.equal(result.status, 'completed');
  assert.equal(result.preflight.passed, true);
  assert.deepEqual(result.metadata, {
    provider: 'mock', model: 'test-model', builderSandbox: 'workspace-write',
    verifierSandbox: 'read-only', timeoutMs: 10_000,
  });
  assert.ok(result.preflight.checks.length >= 9);
  assert.equal(fixture.provider.builderCalls, 0);
  assert.equal(fixture.provider.healthCalls, 0);
  assert.equal(fixture.git.fetchCalls, 0);
  assert.equal(fixture.git.pushCalls, 0);
  assert.equal(await revParse(fixture.target, 'HEAD'), beforeHead);
  assert.deepEqual(await refs(fixture.target), beforeRefs);
  assert.equal((await command('git', ['worktree', 'list', '--porcelain'], fixture.target)).stdout.match(/^worktree /gm)?.length, 1);
  assert.equal((await command('git', ['show-ref', '--verify', '--quiet', 'refs/heads/programme/test'], fixture.target)).exitCode, 1);

  const state = await fixture.store.read();
  assert.equal(state.stages.A.status, 'ready');
  assert.equal(state.stages.B.status, 'blocked');
  assert.equal(state.stages.A.completedRunId, undefined);
});

test('failed dry-run remains ready, keeps dependencies blocked, and preserves a clear structured error', async () => {
  const fixture = await executionFixture();
  await writeFile(path.join(fixture.target, 'dirty.txt'), 'untracked\n');
  const beforeHead = await revParse(fixture.target, 'HEAD');
  const run = await fixture.execution.enqueue('A', 'test', true);
  const result = await fixture.execution.execute(run.id);

  assert.equal(result.status, 'failed');
  assert.equal(result.preflight.passed, false);
  assert.equal(result.preflight.checks.find((check) => check.id === 'clean_working_tree').passed, false);
  assert.match(result.error, /clean_working_tree/);
  assert.equal(fixture.provider.builderCalls, 0);
  assert.equal(await revParse(fixture.target, 'HEAD'), beforeHead);
  assert.equal((await fixture.store.read()).stages.A.status, 'ready');
  assert.equal((await fixture.store.read()).stages.B.status, 'blocked');
});

test('agent health check is opt-in and does not invoke the builder', async () => {
  const fixture = await executionFixture();
  const run = await fixture.execution.enqueue('A', 'test', true, { agentCheck: true });
  const result = await fixture.execution.execute(run.id);
  assert.equal(result.preflight.checks.find((check) => check.id === 'agent_health').passed, true);
  assert.equal(fixture.provider.healthCalls, 1);
  assert.equal(fixture.provider.builderCalls, 0);
});

test('builder authority starts with immutable policy that takes precedence over stage Git instructions', () => {
  const stagePrompt = 'Implement the stage. Commit and push to main.';
  const prompt = buildBuilderPrompt(stagePrompt);
  assert.ok(prompt.startsWith(ORCHESTRATOR_EXECUTION_POLICY));
  assert.match(prompt, /TAKES PRECEDENCE/);
  assert.match(prompt, /- Do not commit\./);
  assert.match(prompt, /- Do not push\./);
  assert.ok(prompt.includes(`--- BEGIN EXACT STAGE AUTHORITY ---\n${stagePrompt}\n--- END EXACT STAGE AUTHORITY ---`));
});

test('real builder request receives configured model, workspace-write sandbox, timeout, and immutable authority', async () => {
  const fixture = await executionFixture();
  let request;
  const provider = {
    name: 'mock',
    async execute(value) {
      request = value;
      return { exitCode: 0, lastMessage: 'builder complete' };
    },
  };
  const git = {
    assertPathExists: async () => {}, assertRepository: async () => {}, assertRemoteMatches: async () => {},
    assertClean: async () => {}, fetch: async () => {},
    createWorktree: async () => ({ path: fixture.target, branch: 'orchestrator/A/run', baseCommit: 'base123' }),
    diffContext: async () => 'worktree diff', commitAll: async () => 'result123',
  };
  const verification = { verify: async () => ({ passed: true }) };
  const execution = new ExecutionService(
    fixture.loaded, fixture.store, fixture.programme, git, provider, verification, path.join(fixture.root, 'runs-real'),
  );
  const queued = await execution.enqueue('A', 'test');
  const result = await execution.execute(queued.id);
  assert.equal(result.status, 'awaiting_approval');
  assert.equal(request.model, 'test-model');
  assert.equal(request.sandbox, 'workspace-write');
  assert.equal(request.timeoutMs, 10_000);
  assert.ok(request.prompt.startsWith(ORCHESTRATOR_EXECUTION_POLICY));
});

test('verifier receives exact authority, policy, stage identity, base, diff, same model, and read-only sandbox', async () => {
  const exact = '# Stage A\n\nObjective one.\nExit gate: all checks pass.';
  const stage = {
    id: 'A', name: 'Authority Stage', verification: { commands: [], verifier_agent: { enabled: true } },
  };
  let request;
  const provider = {
    async execute(value) {
      request = value;
      return { exitCode: 0, lastMessage: 'Evidence report\nVERIFICATION_PASSED' };
    },
  };
  const loaded = {
    stages: new Map([['A', stage]]),
    manifest: { defaults: {
      agent: { model: 'shared-model', timeout_ms: 1234 },
      verification: { commands: [], verifier_agent: { enabled: true, sandbox: 'read-only' } },
    } },
  };
  const service = new VerificationService(loaded, provider, '/tmp/test-logs');
  const result = await service.verify({
    stageId: 'A', runId: 'run', cwd: process.cwd(), stagePrompt: exact,
    executionPolicy: ORCHESTRATOR_EXECUTION_POLICY, baseCommit: 'abc123', diffContext: 'diff --git a/a b/a',
  });
  assert.equal(result.passed, true);
  assert.equal(request.model, 'shared-model');
  assert.equal(request.sandbox, 'read-only');
  assert.ok(request.prompt.includes(`--- BEGIN EXACT STANDALONE STAGE PROMPT ---\n${exact}\n--- END EXACT STANDALONE STAGE PROMPT ---`));
  assert.ok(request.prompt.includes(ORCHESTRATOR_EXECUTION_POLICY));
  assert.match(request.prompt, /Stage ID: A/);
  assert.match(request.prompt, /Stage name: Authority Stage/);
  assert.match(request.prompt, /Base commit: abc123/);
  assert.match(request.prompt, /diff --git a\/a b\/a/);
  assert.match(request.prompt, /code-confirmed, test-confirmed, live-verified, mocked, deferred, and blocked/);
});

test('approval alone advances and pushes only the configured integration branch', async () => {
  const fixture = await approvalFixture();
  const remoteMainBefore = await bareRevParse(fixture.remote, 'refs/heads/main');
  assert.equal((await bareCommand(fixture.remote, ['show-ref', '--verify', '--quiet', 'refs/heads/programme/cockpit-complete-build'])).exitCode, 1,
    'an unapproved stage must not be pushed');

  await fixture.execution.approve('pending-run', 'reviewer', 'approved evidence');

  assert.equal(await revParse(fixture.target, 'programme/cockpit-complete-build'), fixture.resultCommit,
    'approval advances the local integration branch');
  assert.equal(await bareRevParse(fixture.remote, 'refs/heads/programme/cockpit-complete-build'), fixture.resultCommit,
    'approval pushes the configured integration branch');
  assert.equal(await bareRevParse(fixture.remote, 'refs/heads/main'), remoteMainBefore,
    'approval never moves main');
  await assert.rejects(fixture.git.pushIntegrationBranch('main', 'main'), /Refusing to push/);
  assert.equal(await bareRevParse(fixture.remote, 'refs/heads/main'), remoteMainBefore);
});

async function executionFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'cpo-execution-'));
  const target = path.join(root, 'target');
  await mkdir(target);
  await must('git', ['init', '-b', 'main'], target);
  await configureIdentity(target);
  await writeFile(path.join(target, 'README.md'), '# Target\n');
  await must('git', ['add', 'README.md'], target);
  await must('git', ['commit', '-m', 'initial'], target);
  await must('git', ['remote', 'add', 'origin', 'https://github.com/AttractAcq/Cockpit.git'], target);
  const manifestPath = await writeManifest(root, {
    integrationBranch: 'programme/test', pushIntegration: false,
    verificationCommands: [{ command: 'git', args: ['status', '--short'] }],
  });
  const loaded = await loadManifest(manifestPath);
  const store = new JsonStateStore(path.join(root, 'state.json'), path.join(root, 'events.jsonl'));
  const programme = new ProgrammeService(loaded, store);
  await programme.initialise();
  const provider = {
    name: 'mock', builderCalls: 0, healthCalls: 0,
    async execute() { this.builderCalls += 1; throw new Error('builder must not run during dry-run'); },
    async healthCheck() { this.healthCalls += 1; return { provider: 'mock', exitCode: 0 }; },
  };
  const git = new GitService(target, path.join(root, 'worktrees'), 'origin', 'programme/test');
  git.fetchCalls = 0;
  git.pushCalls = 0;
  const originalFetch = git.fetch.bind(git);
  git.fetch = async (...args) => { git.fetchCalls += 1; return originalFetch(...args); };
  git.pushIntegrationBranch = async () => { git.pushCalls += 1; throw new Error('dry-run must not push'); };
  const verification = { verify: async () => ({ passed: true }) };
  const execution = new ExecutionService(loaded, store, programme, git, provider, verification, path.join(root, 'runs'));
  return { root, target, loaded, store, programme, provider, git, execution };
}

async function approvalFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'cpo-approval-'));
  const remote = path.join(root, 'remote.git');
  const seed = path.join(root, 'seed');
  const target = path.join(root, 'target');
  await must('git', ['init', '--bare', remote], root);
  await mkdir(seed);
  await must('git', ['init', '-b', 'main'], seed);
  await configureIdentity(seed);
  await writeFile(path.join(seed, 'README.md'), '# Target\n');
  await must('git', ['add', 'README.md'], seed);
  await must('git', ['commit', '-m', 'initial'], seed);
  await must('git', ['remote', 'add', 'origin', remote], seed);
  await must('git', ['push', '-u', 'origin', 'main'], seed);
  await must('git', ['symbolic-ref', 'HEAD', 'refs/heads/main'], remote);
  await must('git', ['clone', remote, target], root);
  await configureIdentity(target);

  const integration = 'programme/cockpit-complete-build';
  const manifestPath = await writeManifest(root, { integrationBranch: integration, pushIntegration: true });
  const loaded = await loadManifest(manifestPath);
  const store = new JsonStateStore(path.join(root, 'state.json'), path.join(root, 'events.jsonl'));
  const programme = new ProgrammeService(loaded, store);
  await programme.initialise();
  const git = new GitService(target, path.join(root, 'worktrees'), 'origin', integration);
  const worktree = await git.createWorktree('A', 'pending-run', 'main', integration, 'orchestrator');
  await writeFile(path.join(worktree.path, 'A.txt'), 'approved change\n');
  const resultCommit = await git.commitAll(worktree.path, 'stage A');
  await store.update('test.awaiting-approval', (state) => {
    state.stages.A.status = 'awaiting_approval';
    state.runs['pending-run'] = {
      id: 'pending-run', stageId: 'A', status: 'awaiting_approval', resultCommit,
      worktreePath: worktree.path,
    };
  });
  const provider = { name: 'mock' };
  const execution = new ExecutionService(loaded, store, programme, git, provider, {}, path.join(root, 'runs'));
  return { root, remote, target, git, execution, resultCommit };
}

async function writeManifest(root, options = {}) {
  const prompts = path.join(root, 'prompts');
  await mkdir(prompts, { recursive: true });
  await writeFile(path.join(prompts, 'a.md'), '# A\n');
  await writeFile(path.join(prompts, 'b.md'), '# B\n');
  const manifestPath = path.join(root, 'manifest.json');
  await writeFile(manifestPath, JSON.stringify({
    schema_version: 1,
    programme: { id: 'test', name: 'Test', target_repository: { full_name: 'AttractAcq/Cockpit', remote: 'origin' } },
    defaults: {
      git: {
        base_branch: 'main', integration_branch: options.integrationBranch ?? 'programme/test',
        auto_commit: true, auto_push: false, push_integration_branch: options.pushIntegration ?? false,
        cleanup_worktree_on_success: false,
      },
      agent: { provider: 'mock', model: 'test-model', sandbox: 'workspace-write', timeout_ms: 10_000 },
      verification: { commands: options.verificationCommands ?? [], verifier_agent: { enabled: false, sandbox: 'read-only' } },
    },
    phases: [{ id: 'p', name: 'P', stages: [
      { id: 'A', name: 'Stage A', prompt_path: 'prompts/a.md' },
      { id: 'B', name: 'Stage B', prompt_path: 'prompts/b.md', depends_on: ['A'] },
    ] }],
  }));
  return manifestPath;
}

async function configureIdentity(cwd) {
  await must('git', ['config', 'user.email', 'test@example.com'], cwd);
  await must('git', ['config', 'user.name', 'Test User'], cwd);
}

async function refs(cwd) {
  return (await must('git', ['show-ref'], cwd)).stdout.trim().split('\n').sort();
}

async function revParse(cwd, ref) {
  return (await must('git', ['rev-parse', ref], cwd)).stdout.trim();
}

async function bareRevParse(gitDir, ref) {
  return (await bareMust(gitDir, ['rev-parse', ref])).stdout.trim();
}

function command(program, args, cwd) {
  return runCommand(program, args, { cwd });
}

function bareCommand(gitDir, args) {
  return runCommand('git', ['--git-dir', gitDir, ...args]);
}

async function bareMust(gitDir, args) {
  const result = await bareCommand(gitDir, args);
  assert.equal(result.exitCode, 0, result.stderr || result.stdout);
  return result;
}

async function must(program, args, cwd) {
  const result = await command(program, args, cwd);
  assert.equal(result.exitCode, 0, result.stderr || result.stdout);
  return result;
}
