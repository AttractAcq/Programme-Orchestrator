import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
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
    const result = await runCommand(this.binary, args, {
      cwd: request.cwd,
      input: request.prompt,
      timeoutMs: request.timeoutMs,
      signal: request.signal,
      env: { NO_COLOR: '1' },
    });
    await writeFile(eventLogPath, result.stdout, 'utf8');
    await writeFile(stderrLogPath, result.stderr, 'utf8');
    let lastMessage;
    try { lastMessage = (await readFile(lastMessagePath, 'utf8')).trim(); } catch { lastMessage = undefined; }
    return {
      provider: this.name,
      exitCode: result.exitCode,
      startedAt: result.startedAt,
      finishedAt: result.finishedAt,
      durationMs: result.durationMs,
      ...(lastMessage ? { lastMessage } : {}),
      eventLogPath,
      stderrLogPath,
    };
  }
}
