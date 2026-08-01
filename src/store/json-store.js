import { appendFile, mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Mutex } from '../utils/mutex.js';
import { nowIso } from '../utils/time.js';

function initialState() {
  return {
    schemaVersion: 1,
    revision: 0,
    paused: false,
    stages: {},
    runs: {},
    queue: [],
    updatedAt: nowIso(),
  };
}

export class JsonStateStore {
  #mutex = new Mutex();

  constructor(statePath, eventLogPath, options = {}) {
    this.statePath = statePath;
    this.eventLogPath = eventLogPath;
    this.lockPath = options.lockPath ?? `${statePath}.lock`;
    this.lockTimeoutMs = options.lockTimeoutMs ?? 30_000;
    this.lockStaleMs = options.lockStaleMs ?? 120_000;
  }

  async read() {
    try {
      return normaliseState(JSON.parse(await readFile(this.statePath, 'utf8')));
    } catch (error) {
      if (error.code === 'ENOENT') return initialState();
      throw error;
    }
  }

  async update(eventType, updater, eventDetails = undefined) {
    return this.#mutex.runExclusive(async () => {
      const release = await this.#acquireFileLock();
      try {
        const state = await this.read();
        const result = await updater(state);
        state.revision = (state.revision ?? 0) + 1;
        state.updatedAt = nowIso();
        await mkdir(path.dirname(this.statePath), { recursive: true });
        const temp = `${this.statePath}.${process.pid}.${Date.now()}.tmp`;
        await writeFile(temp, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
        await rename(temp, this.statePath);
        await mkdir(path.dirname(this.eventLogPath), { recursive: true });
        await appendFile(this.eventLogPath, `${JSON.stringify({
          at: nowIso(),
          type: eventType,
          revision: state.revision,
          ...(eventDetails ? { details: eventDetails } : {}),
        })}\n`, 'utf8');
        return result;
      } finally {
        await release();
      }
    });
  }

  async #acquireFileLock() {
    const deadline = Date.now() + this.lockTimeoutMs;
    await mkdir(path.dirname(this.lockPath), { recursive: true });

    while (true) {
      try {
        await mkdir(this.lockPath);
        await writeFile(path.join(this.lockPath, 'owner.json'), JSON.stringify({
          pid: process.pid,
          acquiredAt: nowIso(),
        }));
        return async () => {
          await rm(this.lockPath, { recursive: true, force: true });
        };
      } catch (error) {
        if (error.code !== 'EEXIST') throw error;
        await this.#removeStaleLock();
        if (Date.now() >= deadline) {
          throw new Error(`Timed out acquiring state lock: ${this.lockPath}`);
        }
        await sleep(30 + Math.floor(Math.random() * 70));
      }
    }
  }

  async #removeStaleLock() {
    try {
      const lockStat = await stat(this.lockPath);
      if (Date.now() - lockStat.mtimeMs > this.lockStaleMs) {
        await rm(this.lockPath, { recursive: true, force: true });
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}

function normaliseState(state) {
  return {
    ...initialState(),
    ...state,
    revision: Number.isInteger(state.revision) ? state.revision : 0,
    stages: state.stages ?? {},
    runs: state.runs ?? {},
    queue: Array.isArray(state.queue) ? state.queue : [],
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
