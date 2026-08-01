# Build Phase 1-B — 1B-F: End-to-End Hardening and Rollout

You are operating inside Attract Acquisition's `AttractAcq/Cockpit` repository and are responsible for implementing **1B-F — End-to-End Hardening and Rollout**. This is a full implementation task, not a speculative report.

## Programme authority and position

- Governing plan: `config/programme/phase-1b/facebook-build-plan.md` in the Programme Orchestrator authority repository.
- Dependency position: Stage 1B-E is complete.
- The complete stage requirements are reproduced below so this prompt is executable without access to the orchestrator repository.

## Facebook-specific governing context

Facebook must be implemented as a first-class destination, not an Instagram alias. Use only supported Facebook Page capabilities, preserve platform-specific renditions and metrics, fail closed on missing permissions, and never report provider acceptance as verified publication. Build Phase 2-A will later use this capability to test platform fit.


## Mandatory operating rules

1. Confirm the working directory is the `AttractAcq/Cockpit` repository and read all active repository instructions.
2. Reconcile the real branch, worktree, migrations, deployed functions, routes, callers and tests before editing.
3. Preserve legitimate existing work and never reset, clean, overwrite, amend, force-checkout or force-push it.
4. Implement the complete stage across database, RLS, backend, Edge Functions, shared types, API, UI, migration/backfill, tests and documentation where required.
5. Use additive migration discipline: expand, mirror or backfill, cut over, verify and only then contract.
6. Preserve approved Client Context, Execution authority, provenance, versions, approvals and client isolation.
7. Persist long-running work, idempotency, retries, leases, failures, cost and recovery state.
8. Keep provider integrations behind capability-oriented adapters and verify actual external state.
9. Do not fabricate research, Proof, performance, publication or automation success.
10. Do not create a parallel lifecycle or bypass canonical Content Opportunities, Content Items, Briefs, Assets, Distribution or Performance records.
11. Do not start a later programme stage or opportunistically refactor unrelated systems.
12. Do not claim completion until every acceptance criterion and exit gate is satisfied.


## Authoritative stage requirements

# 11. Stage 1B-F — End-to-End Hardening and Rollout

## Objective

Prove the complete Facebook workflow, retire temporary compatibility paths and establish the Phase 2-A platform foundation.

## Scope

- Exercise destination onboarding through performance refresh.
- Validate mobile, empty, loading, error, retry and permission states.
- Run security, RLS, secret and project-reference checks.
- Verify migration ordering and safe backfill.
- Verify Meta webhook or polling reconciliation as implemented.
- Verify no unsupported surface is exposed as operational.
- Produce operator runbooks for connection, reconnect, publishing failure and token loss.
- Perform authorised live verification against a safe Facebook Page.
- Remove proven-dead temporary paths only after replacement verification.
- Update architecture, data dictionary and implementation records.

## Required golden paths

1. Connect a Facebook Page and verify capabilities.
2. Create a Facebook rendition from a canonical Content Item.
3. Approve and schedule it.
4. Publish and reconcile the provider receipt.
5. Refresh Facebook metrics.
6. Compare a Facebook and Instagram experiment.
7. Recover from permission loss and a retryable publishing failure.

## Required outputs

- End-to-end verification evidence
- Live verification record
- Security and migration report
- Operations runbook
- Final Phase 1-B implementation report
- Phase 2-A readiness statement

## Tests

- Full deterministic suite
- Database and RLS suite
- Provider contract suite
- UI workflow suite
- Failure and recovery suite
- Existing Instagram and core Cockpit regression suite

## Acceptance criteria

- Every golden path passes.
- Production state is observable and recoverable.
- Facebook and Instagram are independent first-class destinations.
- No secret, token or client data leaks.
- No unsupported API behaviour is claimed.
- The complete repository typecheck, lint, test and build gates pass.
- Phase 2-A can evaluate and experiment across Facebook and Instagram.

## Exit gate

Build Phase 1-B is complete and the repository is ready for Build Phase 2-A.

## Full-circle implementation instruction

Trace the current implementation end to end, identify the exact gap, define canonical ownership and state transitions, implement all required layers, preserve compatibility and history, connect the result to prior stages, add complete deterministic coverage, and leave an implementation report. Do not stop at recommendations or placeholders.

## Required completion and verification

Before treating this stage as complete:

- Run `npm run typecheck`.
- Run `npm run lint`.
- Run the complete deterministic test suite.
- Run `npm run build`.
- Run database, RLS, ownership, migration and idempotency tests required by the stage.
- Run integration and UI tests for success, validation, empty, conflict, retry, failure, approval and disabled states.
- Run migration ordering and linked dry-run checks where Supabase access is available.
- Bundle and validate every changed Edge Function.
- Run project-reference, secret and `git diff --check` guards.
- Confirm prior completed programme stages have not regressed.
- Inspect the final diff for accidental files, generated output, stale names, duplicate schemas and local-only settings.
- Update architecture documentation, data dictionary, migration ledger and a stage implementation report.
- Record what is code-confirmed, live-verified, mocked, deferred or blocked.


## Final response required from the operator

Return a structured report containing:

- Stage implemented
- Starting and final commit state
- Architecture and ownership decisions
- Migrations, tables, RLS, RPC and Edge Function changes
- Shared domain, API and frontend changes
- Compatibility, backfill and cutover behaviour
- Security and client-isolation verification
- Tests added and complete results
- Typecheck, lint and build results
- External provider actions and live verification
- Deferred or blocked items with exact reasons
- Confirmation against every acceptance criterion
- Confirmation that the stage exit gate is satisfied

Do not commit directly to `main`. Leave the work ready for the Programme Orchestrator verification and approval gate.
