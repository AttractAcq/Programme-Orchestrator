import { mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { runCommand } from '../utils/process.js';

export class GitService {
  constructor(targetRepoPath, worktreeRoot, remote = 'origin', allowedPushBranch) {
    this.targetRepoPath = targetRepoPath;
    this.worktreeRoot = worktreeRoot;
    this.remote = remote;
    this.allowedPushBranch = allowedPushBranch;
  }

  async assertPathExists() {
    const target = await stat(this.targetRepoPath).catch((error) => {
      if (error.code === 'ENOENT') throw new Error(`TARGET_REPO_PATH does not exist: ${this.targetRepoPath}`);
      throw error;
    });
    if (!target.isDirectory()) throw new Error(`TARGET_REPO_PATH is not a directory: ${this.targetRepoPath}`);
  }

  async assertRepository() {
    await mustRun('git', ['rev-parse', '--is-inside-work-tree'], { cwd: this.targetRepoPath });
  }

  async assertRemoteMatches(expectedFullName) {
    const result = await mustRun('git', ['remote', 'get-url', this.remote], { cwd: this.targetRepoPath });
    const actual = parseGitHubFullName(result.stdout.trim());
    if (!actual) throw new Error(`Unable to identify GitHub repository from ${this.remote} URL`);
    if (actual.toLowerCase() !== expectedFullName.toLowerCase()) {
      throw new Error(`Target repository mismatch: expected ${expectedFullName}, found ${actual}`);
    }
  }

  async assertClean() {
    const result = await mustRun('git', ['status', '--porcelain'], { cwd: this.targetRepoPath });
    if (result.stdout.trim()) throw new Error('Target repository working tree is not clean');
  }

  async fetch() {
    await mustRun('git', ['fetch', this.remote, '--prune'], { cwd: this.targetRepoPath });
  }

  async resolveBaseBranch(baseBranch) {
    for (const ref of [`refs/heads/${baseBranch}`, `refs/remotes/${this.remote}/${baseBranch}`]) {
      const result = await runCommand('git', ['rev-parse', '--verify', `${ref}^{commit}`], { cwd: this.targetRepoPath });
      if (result.exitCode === 0) return { ref, commit: result.stdout.trim() };
    }
    throw new Error(`Configured base branch cannot be resolved: ${baseBranch}`);
  }

  async inspectIntegrationBranch(baseBranch, integrationBranch) {
    const validName = await runCommand('git', ['check-ref-format', '--branch', integrationBranch], { cwd: this.targetRepoPath });
    if (validName.exitCode !== 0) throw new Error(`Invalid integration branch name: ${integrationBranch}`);
    for (const ref of [`refs/heads/${integrationBranch}`, `refs/remotes/${this.remote}/${integrationBranch}`]) {
      const result = await runCommand('git', ['rev-parse', '--verify', `${ref}^{commit}`], { cwd: this.targetRepoPath });
      if (result.exitCode === 0) {
        return { ref, commit: result.stdout.trim(), wouldCreate: !ref.startsWith('refs/heads/') };
      }
    }
    const base = await this.resolveBaseBranch(baseBranch);
    return { ref: base.ref, commit: base.commit, wouldCreate: true };
  }

  async ensureIntegrationBranch(baseBranch, integrationBranch) {
    const localRef = `refs/heads/${integrationBranch}`;
    const exists = await runCommand('git', ['show-ref', '--verify', '--quiet', localRef], { cwd: this.targetRepoPath });
    if (exists.exitCode !== 0) {
      const resolution = await this.inspectIntegrationBranch(baseBranch, integrationBranch);
      await mustRun('git', ['branch', integrationBranch, resolution.ref], { cwd: this.targetRepoPath });
    }
    return (await mustRun('git', ['rev-parse', integrationBranch], { cwd: this.targetRepoPath })).stdout.trim();
  }

  async createWorktree(stageId, runId, baseBranch, integrationBranch, prefix) {
    await mkdir(this.worktreeRoot, { recursive: true });
    const safeStage = stageId.replace(/[^a-zA-Z0-9._-]/g, '-');
    const branch = `${prefix}/${safeStage}/${runId}`;
    const worktreePath = path.join(this.worktreeRoot, `${safeStage}-${runId}`);
    const baseCommit = await this.ensureIntegrationBranch(baseBranch, integrationBranch);
    await rm(worktreePath, { recursive: true, force: true });
    await mustRun('git', ['worktree', 'add', '-b', branch, worktreePath, integrationBranch], { cwd: this.targetRepoPath });
    return { path: worktreePath, branch, baseCommit, integrationBranch };
  }

  async commitAll(worktreePath, message) {
    const status = await mustRun('git', ['status', '--porcelain'], { cwd: worktreePath });
    if (!status.stdout.trim()) return undefined;
    await mustRun('git', ['add', '-A'], { cwd: worktreePath });
    await mustRun('git', ['commit', '-m', message], { cwd: worktreePath });
    return (await mustRun('git', ['rev-parse', 'HEAD'], { cwd: worktreePath })).stdout.trim();
  }

  async advanceIntegrationBranch(integrationBranch, commit) {
    const current = (await mustRun('git', ['rev-parse', integrationBranch], { cwd: this.targetRepoPath })).stdout.trim();
    const ancestor = await runCommand('git', ['merge-base', '--is-ancestor', current, commit], { cwd: this.targetRepoPath });
    if (ancestor.exitCode !== 0) {
      throw new Error(`Refusing to move ${integrationBranch}: ${commit} is not a fast-forward from ${current}`);
    }
    await mustRun('git', ['update-ref', `refs/heads/${integrationBranch}`, commit, current], { cwd: this.targetRepoPath });
  }

  async pushIntegrationBranch(integrationBranch, baseBranch = 'main') {
    if (!this.allowedPushBranch || integrationBranch !== this.allowedPushBranch) {
      throw new Error(`Refusing to push unapproved branch: ${integrationBranch}`);
    }
    if (integrationBranch === baseBranch || integrationBranch === 'main') {
      throw new Error(`Refusing to push protected base branch: ${integrationBranch}`);
    }
    await mustRun('git', ['push', this.remote,
      `refs/heads/${integrationBranch}:refs/heads/${integrationBranch}`], { cwd: this.targetRepoPath });
  }

  async diffContext(worktreePath, baseCommit) {
    const [status, diff] = await Promise.all([
      mustRun('git', ['status', '--short'], { cwd: worktreePath }),
      mustRun('git', ['diff', '--no-ext-diff', '--no-color', baseCommit], { cwd: worktreePath }),
    ]);
    return [`git status --short:\n${status.stdout || '(clean)'}\n`, `git diff ${baseCommit}:\n${diff.stdout || '(no tracked diff)'}\n`].join('\n');
  }

  async removeWorktree(worktreePath) {
    await mustRun('git', ['worktree', 'remove', '--force', worktreePath], { cwd: this.targetRepoPath });
  }
}

export function parseGitHubFullName(remoteUrl) {
  const value = remoteUrl.trim().replace(/\.git$/, '');
  const ssh = value.match(/^git@github\.com:([^/]+\/[^/]+)$/i);
  if (ssh) return ssh[1];
  const sshUrl = value.match(/^ssh:\/\/git@github\.com\/([^/]+\/[^/]+)$/i);
  if (sshUrl) return sshUrl[1];
  const https = value.match(/^https?:\/\/github\.com\/([^/]+\/[^/]+)$/i);
  if (https) return https[1];
  return undefined;
}

async function mustRun(command, args, options) {
  const result = await runCommand(command, args, options);
  if (result.exitCode !== 0) throw new Error(`${command} ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
  return result;
}
