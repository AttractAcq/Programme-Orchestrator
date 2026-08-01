# Architecture

The Cockpit Programme Orchestrator is a local-first control plane for a dependency-ordered programme executed against a separate `AttractAcq/Cockpit` checkout.

## Components and authority flow

1. **Manifest loader** validates phase/stage identity, dependencies, cycles, authority paths, prompts, and safety defaults.
2. **Programme service** derives readiness only from approved, completed dependencies.
3. **Durable state store** atomically persists programme, queue, preflight, run metadata, approval, and append-only events.
4. **Git service** validates the target, resolves refs without mutation during preflight, creates isolated real-run worktrees, commits verified changes, and permits pushes only for the configured non-base integration branch.
5. **Agent provider** runs the builder under `workspace-write`; `codex-exec` streams logs while running.
6. **Verification service** runs deterministic commands, then gives a `read-only` verifier the exact standalone stage prompt, immutable policy, stage identity, base commit, current uncommitted diff, and explicit pre-commit/lifecycle semantics.
7. **Execution service** owns preflight, worktree lifecycle, prompt composition, five ordered lifecycle gates, recovery, commits, approval, integration movement, and pushing.
8. **HTTP API, CLI, and worker** expose queueing, dry-run options, cancellation, approval, status, and leased work.

## Dry-run and real-run boundaries

A dry run is a non-mutating preflight. It reads the target path, Git metadata, remote URL, status, base/integration refs, stage prompt, executable search path, and provider configuration. It never fetches, creates refs or worktrees, invokes the builder, commits, pushes, advances dependencies, or marks the stage completed. `--agent-check` is the only dry-run option that invokes a model, and it runs with `read-only` sandboxing.

A real run validates identity and cleanliness, fetches, resolves or creates the local integration branch, creates an isolated stage worktree, and gives the builder the immutable policy followed by the exact prompt. The builder leaves changes uncommitted. Deterministic checks and the verifier run before the orchestrator commits.

The lifecycle gates are distinct and ordered:

1. `implementation`: the builder completes and leaves intended changes in its isolated worktree.
2. `preCommitVerification`: deterministic commands pass, then an independent verifier evaluates the implementation and evidence.
3. `orchestratorCommit`: only the orchestrator stages and commits the verified diff.
4. `humanApproval`: the committed result waits without moving integration.
5. `postApprovalIntegration`: approval fast-forwards and, when configured, pushes only the integration branch before completion.

The pre-commit verifier treats a dirty worktree, base-valued `HEAD`, absent stage commit, absent pushes, pending approval, and absent final snapshot SHA as expected lifecycle state. It classifies them as `LIFECYCLE_PENDING`. It fails closed on genuine implementation/evidence blockers, including required current live verification or migration reproducibility that the later commit/approval/push sequence cannot supply. A lifecycle-only failed verdict can be normalized to pass only when every reported finding is explicitly classified `LIFECYCLE_PENDING`; unclassified, mixed, or genuine-blocker failures remain failed.

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

## State and failed-run recovery

The atomic JSON store is intended for one trusted host and serialises API/worker writers with a filesystem lock. Claimed-but-not-started jobs use expiring leases and re-queue automatically. Started runs preserve their worktree and partial logs after interruption.

`resume-run <runId> --from verification --by <actor>` continues a failed, post-builder run in the exact stored worktree and stage branch. Before changing Git state it confirms no process/run owns that worktree or branch, validates the Git top level and common repository, requires the stored branch at `HEAD`, proves descent from the stored base, rejects an existing result commit, and requires the intended dirty diff. Recovery never invokes the builder. It appends rather than replaces recovery and verification records, then reruns deterministic and independent verification. Only a pass permits the orchestrator commit and `awaiting_approval` transition. Any safety, verification, or commit failure returns the run to `failed` and preserves the worktree and earlier evidence.

The equivalent API is `POST /api/runs/:runId/resume` with `{"from":"verification","requestedBy":"<actor>"}`. Failed approval pushes leave approval pending and can be retried safely.
