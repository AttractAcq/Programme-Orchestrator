import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { runCommand } from '../utils/process.js';

export class GitService {
  constructor(targetRepoPath, worktreeRoot, remote = 'origin') {
    this.targetRepoPath = targetRepoPath;
    this.worktreeRoot = worktreeRoot;
    this.remote = remote;
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

  async ensureIntegrationBranch(baseBranch, integrationBranch) {
    const localRef = `refs/heads/${integrationBranch}`;
    const exists = await runCommand('git', ['show-ref', '--verify', '--quiet', localRef], { cwd: this.targetRepoPath });
    if (exists.exitCode !== 0) {
      await mustRun('git', ['branch', integrationBranch, `${this.remote}/${baseBranch}`], { cwd: this.targetRepoPath });
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

  async pushBranch(worktreePath, branch) {
    await mustRun('git', ['push', '-u', this.remote, branch], { cwd: worktreePath });
  }

  async pushIntegrationBranch(integrationBranch) {
    await mustRun('git', ['push', this.remote, `${integrationBranch}:${integrationBranch}`], { cwd: this.targetRepoPath });
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
