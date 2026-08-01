# Backend Implementation Report

## Result

The Programme Orchestrator backend is hardened for the first supervised Cockpit programme run. No Cockpit stage was executed as part of this work.

## Corrected behaviour

- Dry-run now performs structured, non-mutating repository, ref, prompt, executable, and provider preflight. Success and failure both return the stage to `ready` without changing dependency state.
- Provider health is opt-in through `--agent-check`; normal preflight consumes no model usage.
- Every builder receives a precedence-marked immutable policy forbidding commits, pushes, merges, `main`, tags, deployments, and production-data mutation.
- The verifier receives the exact prompt and policy, stage ID/name, base commit, worktree context, evidence classification requirements, and an exact terminal verdict contract.
- Verification is explicitly pre-commit: a dirty worktree, unchanged base `HEAD`, missing stage commit/push, pending approval, and absent final snapshot are lifecycle-pending rather than implementation failures.
- Implementation, pre-commit verification, orchestrator commit, human approval, and post-approval integration/push are persisted as separate ordered gates.
- Builder and verifier share the explicitly configured model. Builder sandbox is `workspace-write`; verifier sandbox is forced to `read-only`.
- Unknown providers, missing Codex models, and unresolved Codex binaries fail startup.
- Codex JSONL and stderr stream to disk during execution; final messages and partial failure/cancellation logs remain available.
- Stage branches are never pushed. Human approval alone advances and pushes the configured integration branch; protected `main` is rejected.
- Failed post-builder runs whose stages have returned to `ready` can resume from verification in the exact preserved worktree/branch without invoking the builder. A recovery-only guarded transition checks the failed run, `activeRunId`, branch, worktree, Git safety, and intended diff before recording an attempt; ordinary ready stages cannot bypass the builder.

## Approval and integration configuration

The production manifest keeps `defaults.git.auto_push=false` and sets `defaults.git.push_integration_branch=true`. The only production push target is `refs/heads/programme/cockpit-complete-build`. Approval uses a fast-forward-only local ref update followed by an explicit same-name refspec; it never merges or updates `main`.

## Verification coverage

Deterministic tests cover successful and failed preflight, unchanged readiness/dependencies, absence of builder calls, integration refs, worktrees, commits, and pushes during dry-run, opt-in health checks, exact builder/verifier authority, lifecycle-only pre-commit findings, genuine blockers, same-model/read-only verifier configuration, provider startup rejection, live JSONL/stderr streaming, retained partial logs, exact-worktree recovery without builder invocation, commit-after-verification ordering, recovery failure preservation, approval-gated local integration movement, bare-remote integration push, unpushed stage branches, and unchanged remote `main`.

Required operator verification is:

```bash
npm run check
node --env-file=.env src/cli.js validate
git diff --check
```

## Operating and recovery boundary

The JSON state backend remains designed for one trusted execution host. Claimed jobs automatically re-queue after lease expiry. Interrupted active runs require operator inspection. A failed run with completed-builder evidence may have a `ready` stage that retains the failed run/worktree. It can use `node --env-file=.env src/cli.js resume-run <runId> --from verification --by <actor>` only through the restricted recovery transition, when the stage/run links, stored worktree, branch, ancestry, and dirty diff pass safety validation and no process/run is active there. Lifecycle-owned commit, approval, integration, push, and final-snapshot work remains pending; live verification, reproducibility, implementation, safety, and evidence findings remain genuine blockers. Approval push failures remain pending so authentication or connectivity can be repaired and approval retried.
