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
- Opt-in stage and integration-branch pushes
- Pause, resume, cancellation and dry-run planning
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

A builder works in an isolated worktree. Deterministic verification and an independent read-only verifier run before the human approval gate. Approval advances only the cumulative integration branch. Remote pushes are disabled by default.

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

## Inspect the full sequence

```bash
node src/cli.js validate
node src/cli.js status
node src/cli.js run-stage A --dry-run
```

A dry run validates readiness and returns the stage execution plan without creating a target worktree.

## Run with Codex

The production manifest uses `codex-exec`. The `.env.example` keeps `AGENT_PROVIDER=mock` so setup and dry runs cannot accidentally modify Cockpit.

For a real supervised stage:

```env
AGENT_PROVIDER=codex-exec
```

Then:

```bash
node src/cli.js run-stage A
```

The provider passes the complete standalone prompt through stdin, records Codex JSONL and the final response under `data/runs/`, and works only in the isolated stage worktree.

## Approval flow

After a successful build and verification, the run pauses in `awaiting_approval`.

```bash
node src/cli.js approve <run-id> --by alex --note "Stage exit gate verified"
```

Approval fast-forwards the cumulative programme integration branch. Rejection leaves the stage available for a corrected run.

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
