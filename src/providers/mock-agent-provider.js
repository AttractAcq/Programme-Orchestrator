import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { nowIso } from '../utils/time.js';

export class MockAgentProvider {
  name = 'mock';
  async execute(request) {
    await mkdir(request.logDir, { recursive: true });
    const eventLogPath = path.join(request.logDir, `${request.runId}.mock.jsonl`);
    const stderrLogPath = path.join(request.logDir, `${request.runId}.mock.stderr.log`);
    const startedAt = nowIso();
    const started = Date.now();
    await writeFile(eventLogPath, `${JSON.stringify({ type: 'mock.completed', promptLength: request.prompt.length })}\n`);
    await writeFile(stderrLogPath, '');
    return {
      provider: this.name,
      exitCode: 0,
      startedAt,
      finishedAt: nowIso(),
      durationMs: Date.now() - started,
      lastMessage: 'Mock agent completed successfully.',
      eventLogPath,
      stderrLogPath,
    };
  }
}
