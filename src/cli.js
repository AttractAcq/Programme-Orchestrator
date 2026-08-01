#!/usr/bin/env node
import { bootstrap } from './bootstrap.js';
import { loadConfig } from './config.js';
import { buildServer } from './http/server.js';
import { loadManifest } from './manifest/loader.js';
import { Worker } from './services/worker.js';

const [command = 'help', ...args] = process.argv.slice(2);

try {
  if (command === 'validate') {
    const config = loadConfig();
    const loaded = await loadManifest(config.manifestPath);
    console.log(JSON.stringify({
      valid: true,
      programme: loaded.manifest.programme.name,
      stages: loaded.stages.size,
      hash: loaded.hash,
    }, null, 2));
  } else if (command === 'status') {
    const { programme } = await bootstrap();
    console.log(JSON.stringify(await programme.snapshot(), null, 2));
  } else if (command === 'run-next') {
    const { programme, execution } = await bootstrap();
    const stageId = await programme.nextReadyStageId();
    if (!stageId) throw new Error('No ready stage');
    const run = await execution.enqueue(stageId, valueAfter(args, '--by') ?? 'cli', args.includes('--dry-run'), {
      agentCheck: args.includes('--agent-check'),
    });
    console.log(JSON.stringify(await execution.execute(run.id), null, 2));
  } else if (command === 'run-stage') {
    const stageId = args[0];
    if (!stageId) throw new Error('run-stage requires a stage id');
    const { execution } = await bootstrap();
    const run = await execution.enqueue(stageId, valueAfter(args, '--by') ?? 'cli', args.includes('--dry-run'), {
      agentCheck: args.includes('--agent-check'),
    });
    console.log(JSON.stringify(await execution.execute(run.id), null, 2));
  } else if (command === 'approve' || command === 'reject') {
    const runId = args[0];
    if (!runId) throw new Error(`${command} requires a run id`);
    const { execution } = await bootstrap();
    const actor = valueAfter(args, '--by') ?? 'cli';
    const note = valueAfter(args, '--note');
    console.log(JSON.stringify(await execution[command](runId, actor, note), null, 2));
  } else if (command === 'resume-run') {
    const runId = args[0];
    if (!runId) throw new Error('resume-run requires a run id');
    const from = valueAfter(args, '--from');
    const actor = valueAfter(args, '--by');
    if (!from) throw new Error('resume-run requires --from verification');
    if (!actor) throw new Error('resume-run requires --by <actor>');
    const { execution } = await bootstrap();
    console.log(JSON.stringify(await execution.resumeRun(runId, from, actor), null, 2));
  } else if (command === 'cancel') {
    const runId = args[0];
    if (!runId) throw new Error('cancel requires a run id');
    const { execution } = await bootstrap();
    console.log(JSON.stringify(await execution.cancel(runId), null, 2));
  } else if (command === 'serve') {
    const { config, programme, execution, store } = await bootstrap();
    const server = buildServer({ programme, execution, store, apiToken: config.apiToken });
    server.listen(config.port, config.host, () => console.log(`Cockpit Programme Orchestrator listening on http://${config.host}:${config.port}`));
  } else if (command === 'worker') {
    const { config, execution } = await bootstrap();
    const worker = new Worker(execution, config.workerPollMs);
    const stop = () => worker.stop();
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
    await worker.run();
  } else {
    console.log(`Cockpit Programme Orchestrator\n\nCommands:\n  validate\n  status\n  run-next [--dry-run] [--agent-check] [--by actor]\n  run-stage <id> [--dry-run] [--agent-check] [--by actor]\n  resume-run <runId> --from verification --by <actor>\n  approve <runId> [--by actor] [--note text]\n  reject <runId> [--by actor] [--note text]\n  cancel <runId>\n  serve\n  worker`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
}

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}
