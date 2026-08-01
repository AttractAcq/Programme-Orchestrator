import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

export async function runCommand(command, args = [], options = {}) {
  const startedAt = new Date().toISOString();
  const started = Date.now();
  const timeoutMs = options.timeoutMs ?? 0;
  const child = spawn(command, args, {
    cwd: options.cwd,
    env: { ...process.env, ...(options.env ?? {}) },
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  let stdout = '';
  let stderr = '';
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (chunk) => {
    if (options.captureStdout !== false) stdout += chunk;
    options.onStdout?.(chunk);
  });
  child.stderr.on('data', (chunk) => {
    if (options.captureStderr !== false) stderr += chunk;
    options.onStderr?.(chunk);
  });

  if (options.input !== undefined) child.stdin.end(options.input);
  else child.stdin.end();

  let timeout;
  if (timeoutMs > 0) {
    timeout = setTimeout(() => child.kill('SIGTERM'), timeoutMs);
    timeout.unref?.();
  }

  const abortHandler = () => child.kill('SIGTERM');
  if (options.signal?.aborted) abortHandler();
  else options.signal?.addEventListener('abort', abortHandler, { once: true });

  const exitCode = await new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', (code, signal) => resolve(code ?? (signal ? 130 : 1)));
  });

  if (timeout) clearTimeout(timeout);
  options.signal?.removeEventListener('abort', abortHandler);
  return {
    command,
    args,
    cwd: options.cwd ?? process.cwd(),
    exitCode,
    stdout,
    stderr,
    startedAt,
    finishedAt: new Date().toISOString(),
    durationMs: Date.now() - started,
  };
}

export async function resolveExecutable(command, options = {}) {
  if (!command || typeof command !== 'string') return undefined;
  const cwd = options.cwd ?? process.cwd();
  const env = options.env ?? process.env;
  const candidates = command.includes('/') || path.isAbsolute(command)
    ? [path.resolve(cwd, command)]
    : (env.PATH ?? '').split(path.delimiter).filter(Boolean).map((entry) => path.join(entry, command));
  for (const candidate of candidates) {
    try {
      await access(candidate, constants.X_OK);
      return candidate;
    } catch {
      // Continue searching PATH without invoking a shell.
    }
  }
  return undefined;
}
