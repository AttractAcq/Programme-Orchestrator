# Build Phase 2-B — AI-H: Portfolio Operations Dashboard

You are operating inside Attract Acquisition's `AttractAcq/Cockpit` repository and are responsible for implementing **AI-H — Portfolio Operations Dashboard**. This is a full implementation task, not a speculative report.

## Programme authority and position

- Governing plan: `config/programme/phase-2b/ai-automation-build-plan.md` in the Programme Orchestrator authority repository.
- Dependency position: Stage AI-G is complete.
- The complete stage requirements are reproduced below so this prompt is executable without access to the orchestrator repository.

## AI and automation governing context

The AI layer must operate through approved Cockpit authority and canonical commands. Conversational surfaces may plan and invoke durable workflows, but must not write arbitrary database state, bypass approval policy, cross client boundaries or invent success. Every command, workflow step, retrieval result, tool call, approval and cost must be auditable and recoverable.


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

## Stage AI-H — Portfolio Operations Dashboard

### Objective

Give the administrator operational control over fulfilment at scale.

### Work

- Add readiness views
- Add blockers
- Add queue health
- Add provider health
- Add failed workflows
- Add pending approvals
- Add unfilled Calendar requirements
- Add production capacity
- Add cost by client
- Add workflow intervention actions
- Add navigation to client detail

### Exit gate

The administrator can identify and resolve the most important portfolio-wide fulfilment issues from one page.

---

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
