import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { GitService, parseGitHubFullName } from '../src/services/git-service.js';
import { runCommand } from '../src/utils/process.js';

test('parses common GitHub remote URLs', () => {
  assert.equal(parseGitHubFullName('git@github.com:AttractAcq/Cockpit.git'), 'AttractAcq/Cockpit');
  assert.equal(parseGitHubFullName('https://github.com/AttractAcq/Cockpit.git'), 'AttractAcq/Cockpit');
  assert.equal(parseGitHubFullName('ssh://git@github.com/AttractAcq/Cockpit.git'), 'AttractAcq/Cockpit');
  assert.equal(parseGitHubFullName('/tmp/local.git'), undefined);
});

test('integration branch advances cumulatively after approved stage commits', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'cpo-git-'));
  const remote = path.join(root, 'remote.git');
  const seed = path.join(root, 'seed');
  const target = path.join(root, 'target');
  const worktrees = path.join(root, 'worktrees');
  await must('git', ['init', '--bare', remote], root);
  await mkdir(seed);
  await must('git', ['init', '-b', 'main'], seed);
  await must('git', ['config', 'user.email', 'test@example.com'], seed);
  await must('git', ['config', 'user.name', 'Test User'], seed);
  await writeFile(path.join(seed, 'README.md'), '# Target\n');
  await must('git', ['add', 'README.md'], seed);
  await must('git', ['commit', '-m', 'initial'], seed);
  await must('git', ['remote', 'add', 'origin', remote], seed);
  await must('git', ['push', '-u', 'origin', 'main'], seed);
  await must('git', ['symbolic-ref', 'HEAD', 'refs/heads/main'], remote);
  await must('git', ['clone', remote, target], root);
  await must('git', ['config', 'user.email', 'test@example.com'], target);
  await must('git', ['config', 'user.name', 'Test User'], target);

  const git = new GitService(target, worktrees, 'origin');
  const first = await git.createWorktree('A', 'run-1', 'main', 'programme/test', 'orchestrator');
  await writeFile(path.join(first.path, 'A.txt'), 'A\n');
  const firstCommit = await git.commitAll(first.path, 'stage A');
  await git.advanceIntegrationBranch('programme/test', firstCommit);

  const second = await git.createWorktree('B', 'run-2', 'main', 'programme/test', 'orchestrator');
  assert.equal((await read(second.path, 'A.txt')).trim(), 'A');
  await writeFile(path.join(second.path, 'B.txt'), 'B\n');
  const secondCommit = await git.commitAll(second.path, 'stage B');
  await git.advanceIntegrationBranch('programme/test', secondCommit);

  const tip = (await must('git', ['rev-parse', 'programme/test'], target)).stdout.trim();
  assert.equal(tip, secondCommit);
  assert.notEqual(firstCommit, secondCommit);
});

async function read(root, file) {
  return (await import('node:fs/promises')).readFile(path.join(root, file), 'utf8');
}

async function must(command, args, cwd) {
  const result = await runCommand(command, args, { cwd });
  assert.equal(result.exitCode, 0, result.stderr || result.stdout);
  return result;
}
