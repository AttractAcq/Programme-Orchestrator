import { createWriteStream } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { finished } from 'node:stream/promises';
import { runCommand } from '../utils/process.js';

export class CodexExecProvider {
  name = 'codex-exec';
  constructor(binary = 'codex') { this.binary = binary; }

  async execute(request) {
    await mkdir(request.logDir, { recursive: true });
    const eventLogPath = path.join(request.logDir, `${request.runId}.codex.jsonl`);
    const stderrLogPath = path.join(request.logDir, `${request.runId}.codex.stderr.log`);
    const lastMessagePath = path.join(request.logDir, `${request.runId}.last-message.txt`);
    const args = [
      'exec', '--json', '--ephemeral', '--color', 'never', '--sandbox', request.sandbox,
      '--output-last-message', lastMessagePath,
    ];
    if (request.model) args.push('--model', request.model);
    args.push('-');
    const eventStream = createWriteStream(eventLogPath, { flags: 'w' });
    const stderrStream = createWriteStream(stderrLogPath, { flags: 'w' });
    console.error(`[codex] ${request.runId}: started`);
    let result;
    let processError;
    try {
      result = await runCommand(this.binary, args, {
        cwd: request.cwd,
        input: request.prompt,
        timeoutMs: request.timeoutMs,
        signal: request.signal,
        env: { NO_COLOR: '1' },
        captureStdout: false,
        captureStderr: false,
        onStdout: (chunk) => eventStream.write(chunk),
        onStderr: (chunk) => stderrStream.write(chunk),
      });
    } catch (error) {
      processError = error;
    } finally {
      eventStream.end();
      stderrStream.end();
      await Promise.allSettled([finished(eventStream), finished(stderrStream)]);
    }
    if (processError) {
      console.error(`[codex] ${request.runId}: failed to start`);
      throw processError;
    }
    let lastMessage;
    try { lastMessage = (await readFile(lastMessagePath, 'utf8')).trim(); } catch { lastMessage = undefined; }
    console.error(`[codex] ${request.runId}: finished with exit code ${result.exitCode}`);
    return {
      provider: this.name,
      exitCode: result.exitCode,
      startedAt: result.startedAt,
      finishedAt: result.finishedAt,
      durationMs: result.durationMs,
      ...(lastMessage ? { lastMessage } : {}),
      eventLogPath,
      stderrLogPath,
      lastMessagePath,
    };
  }

  async healthCheck(request) {
    return this.execute({
      ...request,
      runId: `${request.runId}-agent-check`,
      sandbox: 'read-only',
      prompt: 'Provider health check only. Do not inspect or modify files. Reply with exactly PROVIDER_HEALTHY.',
    });
  }
}
