import path from 'node:path';
import { nowIso } from '../utils/time.js';

export class ProgrammeService {
  constructor(loaded, store) {
    this.loaded = loaded;
    this.store = store;
  }

  async initialise() {
    await this.store.update('programme.initialise', (state) => {
      state.manifestHash = this.loaded.hash;
      for (const id of this.loaded.stages.keys()) {
        state.stages[id] ??= { stageId: id, status: 'pending', updatedAt: nowIso() };
      }
      this.recomputeReadiness(state);
    });
  }

  async snapshot() {
    const state = await this.store.read();
    return {
      programmeId: this.loaded.manifest.programme.id,
      programmeName: this.loaded.manifest.programme.name,
      paused: state.paused,
      pauseReason: state.pauseReason,
      stages: [...this.loaded.stages.values()].map((stage) => ({
        ...(state.stages[stage.id] ?? { stageId: stage.id, status: 'pending', updatedAt: state.updatedAt }),
        name: stage.name,
        phaseId: stage.phaseId,
        dependencies: stage.effectiveDependsOn ?? stage.depends_on,
      })),
      queue: state.queue,
      updatedAt: state.updatedAt,
    };
  }

  async pause(reason) {
    await this.store.update('programme.pause', (state) => {
      state.paused = true;
      if (reason) state.pauseReason = reason;
    });
  }

  async resume() {
    await this.store.update('programme.resume', (state) => {
      state.paused = false;
      delete state.pauseReason;
      this.recomputeReadiness(state);
    });
  }

  async nextReadyStageId() {
    const state = await this.store.read();
    if (state.paused) return undefined;
    for (const phase of this.loaded.manifest.phases) {
      for (const stage of phase.stages) {
        if (state.stages[stage.id]?.status === 'ready') return stage.id;
      }
    }
    return undefined;
  }

  resolvePromptPath(stageId) {
    const stage = this.loaded.stages.get(stageId);
    if (!stage) throw new Error(`Unknown stage: ${stageId}`);
    return path.resolve(this.loaded.rootDir, stage.prompt_path);
  }

  recomputeReadiness(state) {
    for (const [id, stage] of this.loaded.stages) {
      const runtime = state.stages[id] ?? { stageId: id, status: 'pending', updatedAt: nowIso() };
      if (['completed', 'running', 'queued', 'verifying', 'awaiting_approval'].includes(runtime.status)) continue;
      const dependenciesComplete = (stage.effectiveDependsOn ?? stage.depends_on).every((dependency) => state.stages[dependency]?.status === 'completed');
      state.stages[id] = {
        ...runtime,
        status: dependenciesComplete && stage.enabled ? 'ready' : 'blocked',
        updatedAt: nowIso(),
      };
    }
  }
}
