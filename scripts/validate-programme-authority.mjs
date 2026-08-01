import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadManifest } from '../src/manifest/loader.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'config', 'BUILD_SEQUENCE.json');
const loaded = await loadManifest(manifestPath);
const expected = new Map([
  ['phase-1', 16],
  ['phase-1b', 6],
  ['phase-2a', 7],
  ['phase-2b', 14],
]);

if (loaded.stages.size !== 43) throw new Error(`Expected 43 stages, found ${loaded.stages.size}`);
for (const [phaseId, count] of expected) {
  const phase = loaded.phases.get(phaseId);
  if (!phase) throw new Error(`Missing phase ${phaseId}`);
  if (phase.stages.length !== count) throw new Error(`${phaseId}: expected ${count} stages, found ${phase.stages.length}`);
}

for (const stage of loaded.stages.values()) {
  const promptPath = path.resolve(loaded.rootDir, stage.prompt_path);
  const prompt = await readFile(promptPath, 'utf8');
  if (prompt.length < 500) throw new Error(`${stage.id}: prompt is too short`);
  if (/^# Placeholder|Replace this file with the canonical/im.test(prompt)) throw new Error(`${stage.id}: prompt contains placeholder text`);
  if (!/exit gate/i.test(prompt)) throw new Error(`${stage.id}: prompt has no exit gate`);
  if (!/final response required/i.test(prompt)) throw new Error(`${stage.id}: prompt has no final-response contract`);
}

const phase1Plan = await readFile(path.join(root, 'config/programme/phase-1/build-plan.md'), 'utf8');
for (const id of 'ABCDEFGHIJKLMNOP') {
  const matches = phase1Plan.match(new RegExp(`Programme Stage ${id}\\s+—`, 'g')) ?? [];
  if (matches.length !== 1) throw new Error(`Phase 1 plan must contain Stage ${id} exactly once; found ${matches.length}`);
}

const hashesPath = path.join(root, 'config/programme/SOURCE_HASHES.json');
const hashes = JSON.parse(await readFile(hashesPath, 'utf8'));
for (const [relative, record] of Object.entries(hashes.files)) {
  const file = path.join(root, 'config/programme', relative);
  const content = await readFile(file);
  const actual = createHash('sha256').update(content).digest('hex');
  if (actual !== record.sha256) throw new Error(`Authority hash mismatch: ${relative}`);
}

console.log(JSON.stringify({
  valid: true,
  phases: loaded.phases.size,
  stages: loaded.stages.size,
  authorityFiles: Object.keys(hashes.files).length,
  manifestHash: loaded.hash,
}, null, 2));
