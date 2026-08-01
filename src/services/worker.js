import { randomUUID } from 'node:crypto';

export class Worker {
  #stopped = false;

  constructor(execution, pollMs, workerId = `worker-${process.pid}-${randomUUID()}`) {
    this.execution = execution;
    this.pollMs = pollMs;
    this.workerId = workerId;
  }

  stop() {
    this.#stopped = true;
  }

  async run() {
    while (!this.#stopped) {
      const run = await this.execution.processNext(this.workerId);
      if (!run) await new Promise((resolve) => setTimeout(resolve, this.pollMs));
    }
  }
}
