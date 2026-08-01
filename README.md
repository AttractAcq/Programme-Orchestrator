# Cockpit Programme Orchestrator

A durable, dependency-aware backend for executing the complete Attract Acquisition Cockpit build programme through isolated AI coding-agent runs.

## Programme loaded

The repository now contains the complete execution authority:

```text
Phase 1 — Core Cockpit completion
A → B → C → D → E → F → G → H → I → J → K → L → M → N → O → P

Phase 1-B — Facebook distribution and platform support
1B-A → 1B-B → 1B-C → 1B-D → 1B-E → 1B-F

Phase 2-A — Market Intelligence and Audience Operating System
2A-A → 2A-B → 2A-C → 2A-D → 2A-E → 2A-F → 2A-G

Phase 2-B — AI Control Plane and Fulfilment Automation
AI-A → AI-B → AI-C → AI-D → AI-E → AI-F → AI-G
→ AI-H → AI-I → AI-J → AI-K → AI-L → AI-M → AI-N
```

There are **43 dependency-gated stages**. Every stage requires human approval by default.

## Authority

- Production manifest: `config/BUILD_SEQUENCE.json`
- Safe mock manifest: `config/build-sequence.example.json`
- Build plans and prompts: `config/programme/`
- Authority hashes: `config/programme/SOURCE_HASHES.json`

Approved source documents are retained, and every executable stage has a standalone prompt.

## Backend capabilities

- Phase and stage dependency validation
- Cycle detection
- Build-plan, authority-file and prompt validation
- Durable atomic JSON state with cross-process locking
- Append-only event log
- Queue worker with expiring claims
- Isolated Git branch and worktree per stage
- Cumulative programme integration branch
- Target repository and remote identity checks
- `codex exec` and mock providers
- Deterministic verification gates
- Independent verifier-agent gate
- Human approval and rejection
- Automatic stage commits
- Approval-gated integration-branch pushes
- Cancellation, interruption recovery and non-mutating dry-run preflight
- HTTP API and CLI
- Docker and GitHub Actions
- Zero third-party runtime dependencies

## Safety model

The orchestrator does not merge into the target repository's `main` branch.

```text
origin/main
    ↓ initial programme baseline
programme/cockpit-complete-build
    ↓ approved cumulative fast-forward
orchestrator/<stage>/<run-id>
```

A builder works in an isolated worktree under an immutable policy that forbids commits, pushes, merges, `main` changes, tags, deployments, and production-data mutation. The orchestrator runs deterministic verification, invokes an independent read-only verifier with the exact stage authority, and creates the stage commit itself. Approval advances and pushes only the cumulative integration branch. No code path pushes `main`.

## Requirements

- Node.js 22+
- Git
- Clean local checkout of `AttractAcq/Cockpit`
- `origin` pointing to `AttractAcq/Cockpit`
- Codex CLI installed and authenticated for real execution

## Install and validate

```bash
npm install
cp .env.example .env
npm run check
npm run validate
```

Set `TARGET_REPO_PATH` in `.env` to the absolute path of the Cockpit checkout.

## Safe Stage A preflight

```bash
node src/cli.js validate
node src/cli.js status
node src/cli.js run-stage A --dry-run
```

A normal dry run consumes no model usage. It checks the target path, Git working-tree identity, exact `AttractAcq/Cockpit` remote, cleanliness, base and integration refs, prompt readability, deterministic command executables, and the configured provider binary. It returns each check as passed or failed, leaves Stage A `ready`, leaves Stage B `blocked`, and does not fetch, create branches/worktrees, invoke a builder, commit, or push.

To include a minimal read-only provider call, explicitly opt in (this consumes model usage when using `codex-exec`):

```bash
node --env-file=.env src/cli.js run-stage A --dry-run --agent-check
```

## Run with Codex

The production manifest uses `codex-exec`. The `.env.example` keeps `AGENT_PROVIDER=mock` so setup and dry runs cannot accidentally modify Cockpit.

For a real supervised stage:

```env
AGENT_PROVIDER=codex-exec
CODEX_MODEL=<explicit-model-id>
```

Then:

```bash
node --env-file=.env src/cli.js run-stage A --by alex
```

`codex-exec` startup fails if the provider name is unsupported, `CODEX_MODEL` is empty, or `CODEX_BIN` cannot be resolved. The same model and timeout are passed to the builder and verifier. The builder sandbox is `workspace-write`; the verifier sandbox is always `read-only`.

The provider streams JSONL to `data/runs/<run-id>.codex.jsonl`, stderr to `data/runs/<run-id>.codex.stderr.log`, and the final response to `data/runs/<run-id>.last-message.txt`. Partial logs survive non-zero exit, timeout, and cancellation. Run metadata records provider, model, both sandboxes, and timeout without recording the full environment.

## Approval flow

After a successful build and verification, the run pauses in `awaiting_approval`.

```bash
node src/cli.js approve <run-id> --by alex --note "Stage exit gate verified"
```

Approval fast-forwards the local `programme/cockpit-complete-build` branch and, because the production manifest enables `push_integration_branch`, pushes that exact ref to `origin`. Unapproved work is never pushed. `defaults.git.auto_push` remains `false`, stage branches are never pushed, and `main` is never updated or pushed.

## Recovery after interruption

Inspect durable state and the preserved partial logs first:

```bash
node --env-file=.env src/cli.js status
ls -la data/runs
git -C /absolute/path/to/Cockpit worktree list
```

Queued claims expire and are re-queued automatically. A run interrupted in `running`, `verifying`, or `awaiting_approval` retains its worktree and logs. Mark that stale run cancelled, inspect or archive its worktree, then explicitly rerun its stage:

```bash
node --env-file=.env src/cli.js cancel <run-id>
node --env-file=.env src/cli.js run-stage A --dry-run
node --env-file=.env src/cli.js run-stage A --by alex
```

If an approval push fails, the run remains `awaiting_approval`; fix remote authentication/connectivity and repeat the same `approve` command. The integration update is fast-forward-only and retry-safe.

## API and worker

Start separately:

```bash
node src/cli.js serve
node src/cli.js worker
```

Endpoints:

- `GET /health`
- `GET /api/programme`
- `GET /api/state`
- `POST /api/programme/run-next`
- `POST /api/stages/:stageId/run`
- `POST /api/runs/:runId/cancel`
- `POST /api/runs/:runId/approve`
- `POST /api/runs/:runId/reject`
- `POST /api/programme/pause`
- `POST /api/programme/resume`

Set `ORCHESTRATOR_API_TOKEN` to require a Bearer token except on `/health`.

## Initial operating recommendation

Run Stage A in supervised mode first. Review the builder output, deterministic checks, verifier report and resulting diff before approving. Keep human approval enabled for every stage until the execution pattern is proven.

## Storage boundary

The JSON backend is intended for one trusted execution host with multiple local processes. A hosted or multi-machine deployment should replace it with PostgreSQL while preserving the service interfaces.
