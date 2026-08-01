# Cockpit Programme Orchestrator

A durable, dependency-aware backend for executing the Attract Acquisition Cockpit build programme through isolated AI coding-agent runs.

## Current scope

This repository contains the orchestrator backend. The approved Cockpit build plans and stage prompts will be added separately under `config/programme/`.

The backend provides:

- Machine-readable build-sequence validation
- Stage and phase dependency enforcement, including cycle detection
- Durable atomic state with cross-process filesystem locking
- Append-only revisioned event records
- Queue claiming with expiring worker leases
- Isolated Git branches and worktrees
- A cumulative programme integration branch, so each approved stage builds on all approved prior stages
- Target-repository and GitHub-remote identity checks
- `codex exec` and mock agent providers
- Deterministic verification gates
- Optional independent verifier-agent gate
- Human approval and rejection
- Automatic stage commits on isolated branches
- Optional stage and integration-branch push, disabled by default
- Pause, resume, cancellation and dry-run planning
- Local HTTP API, worker and CLI
- Docker and GitHub Actions
- Zero third-party runtime dependencies

## Safety model

The orchestrator does **not** merge into the target repository’s `main` branch.

```text
origin/main
    ↓ initial baseline only
programme/<programme-id>
    ↓ approved fast-forward after each stage
orchestrator/<stage>/<run-id>
```

A stage is implemented in its own worktree. Deterministic verification runs before approval. Approval advances only the cumulative programme integration branch. Pushing is opt-in.

## Requirements

- Node.js 22+
- Git
- A clean local checkout of `AttractAcq/Cockpit`
- A correctly configured `origin` remote pointing to `AttractAcq/Cockpit`
- Codex CLI authenticated locally for real agent execution

## Install and verify

```bash
npm install
cp .env.example .env
npm run check
npm run validate
```

Set `TARGET_REPO_PATH` in `.env` to the absolute path of the Cockpit checkout.

## Run in mock mode

The example manifest uses the mock provider and two placeholder stages.

```bash
node src/cli.js validate
node src/cli.js status
node src/cli.js run-stage A --dry-run
```

A dry run validates readiness and returns the execution plan without creating a worktree or modifying the target repository.

## Run with Codex

Set:

```env
AGENT_PROVIDER=codex-exec
```

Then run:

```bash
node src/cli.js run-stage A
```

The provider invokes Codex non-interactively, passes the stage prompt through stdin, records JSONL output and the final response in `data/runs/`, and performs changes inside an isolated Git worktree.

## API and worker

Start the API and worker in separate terminals:

```bash
node src/cli.js serve
node src/cli.js worker
```

Endpoints:

- `GET /health`
- `GET /api/programme`
- `GET /api/state`
- `GET /api/runs`
- `GET /api/runs/:runId`
- `POST /api/programme/run-next`
- `POST /api/stages/:stageId/run`
- `POST /api/runs/:runId/cancel`
- `POST /api/runs/:runId/approve`
- `POST /api/runs/:runId/reject`
- `POST /api/programme/pause`
- `POST /api/programme/resume`

Set `ORCHESTRATOR_API_TOKEN` to require a Bearer token except on `/health`.

## Create and push the GitHub repository

From this directory, with GitHub CLI installed and authenticated:

```bash
./scripts/create-github-repo.sh AttractAcq cockpit-programme-orchestrator --private
```

The script creates `AttractAcq/cockpit-programme-orchestrator`, adds `origin`, and pushes the current `main` branch.

## Programme authority files to add next

```text
config/programme/
├── phase-1/
│   ├── build-plan.md
│   └── prompts/stage-a.md ... stage-p.md
├── phase-1b/
│   ├── facebook-build-plan.md
│   └── prompts/
├── phase-2a/
│   ├── market-intelligence-build-plan.md
│   └── prompts/stage-2a-a.md ... stage-2a-g.md
└── phase-2b/
    ├── ai-automation-build-plan.md
    └── prompts/stage-ai-a.md ... stage-ai-n.md
```

After those files are added, replace the example manifest with a production `BUILD_SEQUENCE.json` containing every stage and dependency.

## Storage boundary

The JSON state backend supports one trusted execution host with multiple local processes. It uses atomic file replacement and a cross-process lock. A later hosted or multi-machine deployment should replace the store with PostgreSQL while preserving the service interfaces.
