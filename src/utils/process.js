import { spawn } from 'node:child_process';

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
  child.stdout.on('data', (chunk) => { stdout += chunk; options.onStdout?.(chunk); });
  child.stderr.on('data', (chunk) => { stderr += chunk; options.onStderr?.(chunk); });

  if (options.input !== undefined) child.stdin.end(options.input);
  else child.stdin.end();

  let timeout;
  if (timeoutMs > 0) {
    timeout = setTimeout(() => child.kill('SIGTERM'), timeoutMs);
    timeout.unref?.();
  }

  const abortHandler = () => child.kill('SIGTERM');
  options.signal?.addEventListener('abort', abortHandler, { once: true });

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
