# Architecture

The Cockpit Programme Orchestrator is a local-first control plane for a dependency-ordered programme executed against a separate `AttractAcq/Cockpit` checkout.

## Components and authority flow

1. **Manifest loader** validates phase/stage identity, dependencies, cycles, authority paths, prompts, and safety defaults.
2. **Programme service** derives readiness only from approved, completed dependencies.
3. **Durable state store** atomically persists programme, queue, preflight, run metadata, approval, and append-only events.
4. **Git service** validates the target, resolves refs without mutation during preflight, creates isolated real-run worktrees, commits verified changes, and permits pushes only for the configured non-base integration branch.
5. **Agent provider** runs the builder under `workspace-write`; `codex-exec` streams logs while running.
6. **Verification service** runs deterministic commands, then gives a `read-only` verifier the exact standalone stage prompt, immutable policy, stage identity, base commit, and current result/diff context.
7. **Execution service** owns preflight, worktree lifecycle, prompt composition, verification, commits, approval, integration movement, and pushing.
8. **HTTP API, CLI, and worker** expose queueing, dry-run options, cancellation, approval, status, and leased work.

## Dry-run and real-run boundaries

A dry run is a non-mutating preflight. It reads the target path, Git metadata, remote URL, status, base/integration refs, stage prompt, executable search path, and provider configuration. It never fetches, creates refs or worktrees, invokes the builder, commits, pushes, advances dependencies, or marks the stage completed. `--agent-check` is the only dry-run option that invokes a model, and it runs with `read-only` sandboxing.

A real run validates identity and cleanliness, fetches, resolves or creates the local integration branch, creates an isolated stage worktree, and gives the builder the immutable policy followed by the exact prompt. The builder leaves changes uncommitted. Deterministic checks and the verifier run before the orchestrator commits.

## Cumulative branch and approval model

```text
origin/main (read-only baseline)
    ↓ local integration baseline
programme/cockpit-complete-build
    ↓ isolated unpushed stage branch/worktree
orchestrator/<stage>/<run-id>
    ↓ verify → orchestrator commit → human approval
programme/cockpit-complete-build (fast-forward locally, then push exact ref)
```

`auto_push` is false. No stage branch is pushed. A stage awaiting approval cannot move or push integration. Approval fast-forwards only `programme/cockpit-complete-build`, and `push_integration_branch=true` pushes that exact fully qualified ref. The Git service rejects `main` and any branch other than the configured integration branch.

## Model, sandbox, and logs

Implemented providers are `mock` and `codex-exec`; unknown values fail startup. `codex-exec` also requires an explicit model and resolvable binary. One model value is passed to both builder and verifier. Run metadata records provider, model, builder sandbox (`workspace-write`), verifier sandbox (`read-only`), and timeout.

For run `<id>`, Codex JSONL is streamed to `data/runs/<id>.codex.jsonl`, stderr to `data/runs/<id>.codex.stderr.log`, and the final response to `data/runs/<id>.last-message.txt`. Verifier and explicit health-check run IDs use suffixes. Logging does not dump the process environment.

## State and interruption recovery

The atomic JSON store is intended for one trusted host and serialises API/worker writers with a filesystem lock. Claimed-but-not-started jobs use expiring leases and re-queue automatically. Started runs preserve their worktree and partial logs after interruption. A restarted operator can inspect state, cancel a stale `running`, `verifying`, or `awaiting_approval` run, inspect/archive its worktree, perform a fresh dry-run, and explicitly rerun the stage. Failed approval pushes leave approval pending and can be retried safely.
