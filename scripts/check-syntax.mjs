import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { runCommand } from '../src/utils/process.js';

const roots = ['src', 'scripts', 'test'];
const files = [];
for (const root of roots) await walk(root);
for (const file of files) {
  const result = await runCommand(process.execPath, ['--check', file]);
  if (result.exitCode !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(1);
  }
}
console.log(`Syntax OK: ${files.length} files`);

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.(js|mjs)$/.test(entry.name)) files.push(full);
  }
}
