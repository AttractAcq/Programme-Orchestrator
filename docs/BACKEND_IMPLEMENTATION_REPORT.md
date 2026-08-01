# Backend Implementation Report

## Result

The Programme Orchestrator backend is hardened for the first supervised Cockpit programme run. No Cockpit stage was executed as part of this work.

## Corrected behaviour

- Dry-run now performs structured, non-mutating repository, ref, prompt, executable, and provider preflight. Success and failure both return the stage to `ready` without changing dependency state.
- Provider health is opt-in through `--agent-check`; normal preflight consumes no model usage.
- Every builder receives a precedence-marked immutable policy forbidding commits, pushes, merges, `main`, tags, deployments, and production-data mutation.
- The verifier receives the exact prompt and policy, stage ID/name, base commit, worktree context, evidence classification requirements, and an exact terminal verdict contract.
- Builder and verifier share the explicitly configured model. Builder sandbox is `workspace-write`; verifier sandbox is forced to `read-only`.
- Unknown providers, missing Codex models, and unresolved Codex binaries fail startup.
- Codex JSONL and stderr stream to disk during execution; final messages and partial failure/cancellation logs remain available.
- Stage branches are never pushed. Human approval alone advances and pushes the configured integration branch; protected `main` is rejected.
- Stale started runs can be marked cancelled after restart while their worktree and logs remain available for inspection.

## Approval and integration configuration

The production manifest keeps `defaults.git.auto_push=false` and sets `defaults.git.push_integration_branch=true`. The only production push target is `refs/heads/programme/cockpit-complete-build`. Approval uses a fast-forward-only local ref update followed by an explicit same-name refspec; it never merges or updates `main`.

## Verification coverage

Deterministic tests cover successful and failed preflight, unchanged readiness/dependencies, absence of builder calls, integration refs, worktrees, commits, and pushes during dry-run, opt-in health checks, exact builder/verifier authority, same-model/read-only verifier configuration, provider startup rejection, live JSONL/stderr streaming, retained partial logs, approval-gated local integration movement, bare-remote integration push, and unchanged remote `main`.

Required operator verification is:

```bash
npm run check
node --env-file=.env src/cli.js validate
git diff --check
```

## Operating and recovery boundary

The JSON state backend remains designed for one trusted execution host. Claimed jobs automatically re-queue after lease expiry. Interrupted started runs require operator inspection and explicit cancellation/rerun; the orchestrator intentionally does not guess whether an orphaned worktree should be discarded. Approval push failures remain pending so authentication or connectivity can be repaired and approval retried.
