# Architecture

The Cockpit Programme Orchestrator is a local-first control plane for executing a dependency-ordered software build programme against a separate target repository.

## Components

1. **Manifest loader** — validates JSON, phase and stage uniqueness, prompt existence, explicit and inherited dependencies, and cycles.
2. **Programme service** — derives stage readiness from completed dependencies and programme pause state.
3. **Durable state store** — atomically persists programme, queue and run state to JSON, with a cross-process lock and append-only revisioned events.
4. **Git service** — verifies the target repository identity, maintains a cumulative programme integration branch, and creates isolated stage branches and worktrees from it.
5. **Agent provider** — runs a builder agent. The production adapter uses `codex exec`; a mock adapter supports safe setup and tests.
6. **Verification service** — runs deterministic commands and an optional independent verifier agent.
7. **Execution service** — coordinates queue claims, worktree creation, agent execution, verification, commit, optional push and approval.
8. **HTTP API and CLI** — expose status, queueing, cancellation, approval and pause/resume.
9. **Worker** — claims queued runs with a lease and processes them sequentially by default.

## Cumulative branch model

Every stage must build on approved prior work.

```text
origin/main
    ↓ create integration baseline
programme/<programme-id>
    ↓ branch stage
orchestrator/<stage>/<run-id>
    ↓ verify and approve
programme/<programme-id> fast-forwards
```

The orchestrator never automatically updates `main`.

## Safety defaults

- No merge to the target repository's `main` branch.
- Approved stage commits advance only the programme integration branch by verified fast-forward.
- No automatic push unless explicitly enabled.
- Every stage uses a dedicated branch and worktree.
- Human approval defaults to required.
- Deterministic verification runs before approval.
- Programme prompts live outside the target repository and are read-only authority inputs.
- Prompt paths cannot escape the manifest directory.
- The target working tree must be clean before execution.
- The configured GitHub repository identity must match the target checkout remote.
- One active or approval-pending run is allowed by default.

## State backend

The atomic JSON store is designed for a single trusted host. It serialises writers across API and worker processes through an atomic filesystem lock. Its interface can later be replaced with PostgreSQL without changing the programme or execution services.

A process interruption after an agent has started leaves the run visible for operator recovery. Claimed-but-not-started jobs use expiring leases and are re-queued automatically.
