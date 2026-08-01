import { createHash } from 'node:crypto';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

export async function loadManifest(manifestPath) {
  const absolute = path.resolve(manifestPath);
  const raw = await readFile(absolute, 'utf8');
  if (!absolute.endsWith('.json')) {
    throw new Error('The dependency-free backend currently accepts JSON manifests. Use BUILD_SEQUENCE.json.');
  }
  let manifest;
  try {
    manifest = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid manifest JSON: ${error.message}`);
  }
  validateManifest(manifest);
  manifest = applyDefaults(manifest);
  const hash = createHash('sha256').update(raw).digest('hex');
  const rootDir = path.dirname(absolute);
  const stages = new Map();
  const phases = new Map();

  for (const phase of manifest.phases) {
    if (phases.has(phase.id)) throw new Error(`Duplicate phase id: ${phase.id}`);
    phases.set(phase.id, phase);
    for (const stage of phase.stages) {
      if (stages.has(stage.id)) throw new Error(`Duplicate stage id: ${stage.id}`);
      stages.set(stage.id, { ...stage, phaseId: phase.id, phaseName: phase.name });
    }
  }

  for (const phase of manifest.phases) {
    for (const dependency of phase.depends_on ?? []) {
      if (!phases.has(dependency)) throw new Error(`Unknown phase dependency ${dependency} in ${phase.id}`);
    }
    for (const authorityPath of [phase.build_plan_path, ...(phase.authority_paths ?? [])].filter(Boolean)) {
      const authority = path.resolve(rootDir, authorityPath);
      if (!isWithin(rootDir, authority)) throw new Error(`Authority path escapes manifest directory: ${authorityPath}`);
      await access(authority).catch(() => {
        throw new Error(`Authority file not found: ${authorityPath}`);
      });
    }
    const phaseStageDependencies = (phase.depends_on ?? []).flatMap((dependency) => phases.get(dependency).stages.map((stage) => stage.id));
    for (const stage of phase.stages) {
      for (const dependency of stage.depends_on ?? []) {
        if (!stages.has(dependency)) throw new Error(`Unknown stage dependency ${dependency} in ${stage.id}`);
      }
      const prompt = path.resolve(rootDir, stage.prompt_path);
      if (!isWithin(rootDir, prompt)) throw new Error(`Prompt path escapes manifest directory: ${stage.prompt_path}`);
      await access(prompt).catch(() => {
        throw new Error(`Prompt file not found: ${stage.prompt_path}`);
      });
      const effectiveDependsOn = [...new Set([...phaseStageDependencies, ...(stage.depends_on ?? [])])];
      stages.set(stage.id, { ...stages.get(stage.id), effectiveDependsOn });
    }
  }

  assertPhaseAcyclic(phases);
  assertStageAcyclic(stages);
  return { manifest, hash, manifestPath: absolute, rootDir, phases, stages };
}

function validateManifest(value) {
  if (!value || typeof value !== 'object') throw new Error('Manifest must be an object');
  if (value.schema_version !== 1) throw new Error('schema_version must be 1');
  if (!value.programme?.id || !value.programme?.name) throw new Error('programme.id and programme.name are required');
  if (!value.programme?.target_repository?.full_name) throw new Error('target_repository.full_name is required');
  if (!Array.isArray(value.phases) || value.phases.length === 0) throw new Error('At least one phase is required');
  for (const phase of value.phases) {
    if (!phase.id || !phase.name || !Array.isArray(phase.stages) || phase.stages.length === 0) {
      throw new Error('Every phase requires id, name and stages');
    }
    for (const stage of phase.stages) {
      if (!stage.id || !stage.name || !stage.prompt_path) throw new Error('Every stage requires id, name and prompt_path');
    }
  }
}

function applyDefaults(manifest) {
  const defaultVerification = manifest.defaults?.verification ?? {};
  const defaults = {
    git: {
      base_branch: 'main',
      branch_prefix: 'orchestrator',
      integration_branch: `programme/${manifest.programme.id}`,
      auto_commit: true,
      auto_push: false,
      push_integration_branch: false,
      cleanup_worktree_on_success: false,
      ...(manifest.defaults?.git ?? {}),
    },
    agent: {
      provider: 'mock',
      sandbox: 'workspace-write',
      timeout_ms: 7_200_000,
      ...(manifest.defaults?.agent ?? {}),
    },
    execution: {
      max_concurrent_runs: 1,
      claim_lease_ms: 300_000,
      ...(manifest.defaults?.execution ?? {}),
    },
    verification: {
      commands: defaultVerification.commands ?? [],
      verifier_agent: {
        enabled: false,
        sandbox: 'read-only',
        ...(defaultVerification.verifier_agent ?? {}),
      },
    },
  };
  return {
    ...manifest,
    defaults,
    phases: manifest.phases.map((phase) => ({
      ...phase,
      depends_on: phase.depends_on ?? [],
      stages: phase.stages.map((stage) => ({
        ...stage,
        depends_on: stage.depends_on ?? [],
        enabled: stage.enabled ?? true,
        allow_no_changes: stage.allow_no_changes ?? false,
        requires_human_approval: stage.requires_human_approval ?? true,
        verification: {
          commands: stage.verification?.commands ?? [],
          verifier_agent: {
            enabled: false,
            sandbox: 'read-only',
            ...(stage.verification?.verifier_agent ?? {}),
          },
        },
      })),
    })),
  };
}

function assertPhaseAcyclic(phases) {
  const visiting = new Set();
  const visited = new Set();
  function visit(id) {
    if (visiting.has(id)) throw new Error(`Phase dependency cycle detected at ${id}`);
    if (visited.has(id)) return;
    visiting.add(id);
    const phase = phases.get(id);
    if (!phase) throw new Error(`Unknown phase ${id}`);
    for (const dependency of phase.depends_on ?? []) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of phases.keys()) visit(id);
}

function assertStageAcyclic(stages) {
  const visiting = new Set();
  const visited = new Set();
  function visit(id) {
    if (visiting.has(id)) throw new Error(`Dependency cycle detected at stage ${id}`);
    if (visited.has(id)) return;
    visiting.add(id);
    const stage = stages.get(id);
    if (!stage) throw new Error(`Unknown stage ${id}`);
    for (const dependency of stage.effectiveDependsOn ?? stage.depends_on ?? []) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of stages.keys()) visit(id);
}

function isWithin(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
}
