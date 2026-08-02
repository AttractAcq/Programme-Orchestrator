# Orchestrator Authority Resolution

This standalone prompt was extracted from the approved `Cockpit_Build_Plan_Prompts_Rendered.md` collection. Inside the target `AttractAcq/Cockpit` repository, resolve programme authority references to the current canonical paths:

- `docs/programme/Cockpit_Build_Plan.md`
- `docs/programme/High_level_Cockpit_Audit_30_01_2026.md`
- `docs/programme/Cockpit_Build_Plan_Prompts_Rendered.md`
- `docs/programme/phase_2_ai_build_plan.md`

Where the imported prompt body uses a root-level filename, use the matching `docs/programme/` path. Do not change the approved programme requirements.

---

You are operating inside Attract Acquisition’s `AttractAcq/Cockpit` repository and are responsible for implementing **Programme Stage A — Repository Reconciliation and Frozen Baseline** from the canonical Cockpit build programme.

This is an implementation task, not a speculative architecture exercise. First understand the actual repository, current deployed and local state, the Attract Acquisition business model, and how this stage fits into the complete Cockpit operating chain. Then implement the stage fully, integrate it with all preceding stages and existing systems, verify the result, and leave complete documentation and evidence.

## Cockpit architecture governing this work

Attract Acquisition Cockpit is the operating system through which Attract Acquisition understands, markets, distributes and continuously improves service businesses.

The application has three operating phases:

- **Application Phase 1 — Client Intelligence:** client facts and files, AA research and versioned AA playbooks become approved Business Context and approved Client Strategic Systems.
- **Application Phase 2 — Execution Intelligence:** approved Phase 1 authority plus current objectives, campaigns, capacity and channel requirements become approved monthly Execution Files and normalised machine-executable requirements.
- **Application Phase 3 — Continuous Content Operations:** Manual Ideas, Proof Vault items, seven-technique Research Ideation and Performance Insights become Content Opportunities; Opportunities are matched against required Calendar Slots; selected work becomes canonical Content Items and Content Briefs; format-specific studios produce assets; approved assets are distributed; analytics produce controlled learning and future Opportunities.

The canonical operating spine is:

```text
Authority
→ Sources
→ Content Opportunities
→ Content Requirements and Calendar Slots
→ Content Items
→ Content Briefs
→ Production
→ Assets
→ Distribution
→ Performance
→ Learning
→ Automation
```

Preserve the existing strengths of the repository, including Phase 1 and Phase 2 approval boundaries, authority versioning and snapshots, Ideation provenance and deterministic scoring, proposed-Calendar conflict handling, the current Production Brief and asset lifecycle, Reel Studio continuity and shot generation, organic distribution state machines, analytics snapshots, controlled Context updates, and existing idempotency, leases, retries and service-role-only RPC patterns.

Do not create a parallel lifecycle, a second source of truth, or a shortcut that bypasses Content Opportunities, Content Items or approved authority.

## Dependency position

There is no earlier Programme Stage. Establish the verified baseline required for all later work.

## Mandatory operating rules

1. **Begin with a context scan.** Confirm that the working directory is the `AttractAcq/Cockpit` repository. Read the root repository instructions, `Cockpit_Build_Plan.md`, `High_level_Cockpit_Audit_30_01_2026.md`, relevant architecture documents, migrations, shared types, API layer, Edge Functions, tests and UI surfaces related to this stage.
2. **Reconcile the actual repository state before editing.** Inspect the active branch, latest commit, tracked modifications, untracked files and current migration/function state. Preserve legitimate work already present. Never reset, delete, overwrite, clean, amend or force-checkout work merely because it was unexpected.
3. **Trace real callers and state transitions.** Do not assume a file, table, RPC, Edge Function or UI is operational merely because it exists. Identify actual reads, writes, callers, ownership boundaries and deployment dependencies.
4. **Implement the stage, not only analyse it.** Complete the database, backend, shared domain types, API/client layer, frontend, migration/backfill, compatibility adapters, tests and documentation required by the stage.
5. **Use additive migration discipline.** Expand, mirror, backfill, cut over and only then contract. Do not remove legacy paths before the replacement is proven and historical records remain readable.
6. **Preserve authority and provenance.** Every new output must retain the client, source, Context and Execution versions, model/provider/prompt identity where applicable, operator changes, approval state, distribution record and performance lineage.
7. **Preserve client isolation and least privilege.** Enforce ownership foreign keys, RLS, service-role-only mutation functions where appropriate, explicit grants, safe `search_path`, anti-spoofing validation and cross-client rejection.
8. **Make external and long-running work recoverable.** Use persistent statuses, idempotency, ownership or leases where necessary, retry caps, failure stages, last errors, cost metadata, provenance and explicit recovery actions.
9. **Keep production provider-neutral.** Domain contracts should request capabilities rather than encode one vendor as the architecture.
10. **Do not fabricate proof or silently mutate strategy.** Unsupported claims must fail closed. Context or Execution authority updates must remain controlled, versioned and reviewable.
11. **Do not leave partial integration.** A table without callers, an Edge Function without UI, a UI without backend, or a mocked path without an operational transition does not complete the stage.
12. **Avoid unforced errors.** Check naming, status enums, nullable fields, timestamps, indexes, uniqueness, transactions, pagination, concurrency, stale leases, retries, duplicate submissions, empty states, error states, accessibility, responsive behaviour and backwards compatibility.
13. **Do not commit, push, deploy or mutate a real client unless the current task and repository authority explicitly permit it.** Use disposable fixtures and safe test clients for destructive or provider-backed verification.

## Authoritative Stage A requirements

## Objective

Create one verified starting state that includes all current local Ideation and Reel Studio work before architecture migration begins.

## Why this stage is first

The GitHub audit is based on pushed `main`, while current Ideation work may exist only in the local Desktop repository.

No reliable build plan can be executed against an uncertain baseline.

## Scope

### Repository state

- Inspect the local working tree.
- Identify all tracked modifications and untracked files.
- Separate:
  - Ideation work
  - Reel Studio work
  - Documentation
  - Migrations
  - Unrelated experiments
  - Local-only settings
- Confirm the active Supabase project.
- Confirm deployed versus local Edge Functions.
- Confirm frontend deployment commit.
- Create a named audit snapshot branch or commit.
- Push the snapshot to GitHub.

### Baseline verification

Run:

- Typecheck
- Build
- Lint
- Full deterministic tests
- Migration dry run
- Supabase project guard
- Secret scan
- Git diff check

### Current-state inventory

Produce a machine-readable inventory of:

- Frontend routes and client tabs
- Database tables and views
- RPCs
- Edge Functions
- Cron jobs
- External-provider calls
- Production states
- Placeholder tabs
- Deprecated paths

## Required outputs

- One pushed baseline branch or commit
- Updated repository-state document
- Updated migration ledger
- Current test count and pass/fail record
- Current deployed-function list
- Current database-entity inventory
- Current local-only changes reconciled

## Acceptance criteria

- The working tree is clean after the baseline snapshot.
- GitHub contains the exact code state being planned against.
- No secrets or local settings are committed.
- Every migration is classified as:
  - applied
  - pending
  - held
  - obsolete
- Every Edge Function is classified as:
  - deployed and used
  - deployed but disconnected
  - local only
  - deprecated
- The build and deterministic test suite pass.
- The baseline commit SHA is recorded in this document or a linked implementation log.

## Exit gate

No Stage B schema or architecture change starts until the repository and deployment baseline are reproducible.

---

## Frozen Stage A verification acceptance contract

This is the finite implementation-verification contract for Programme Stage A.
It governs the independent verifier and takes precedence, for pre-commit
verification classification only, over broader wording elsewhere in this
prompt whose completion is owned by the orchestrator lifecycle. The verifier
must inspect every gate, but it must not introduce new acceptance requirements
outside Gates 1–12.

### Gate 1 — Repository identity

- The worktree is the correct Cockpit repository and Stage A branch.
- The frozen base commit is
  `7d4c1b96cdd7f3a59e28dc9826b44b1aad3b4e5e`.
- No unexpected branch switch, merge, or production checkout occurred.

### Gate 2 — Intended snapshot integrity

- Every tracked modification and intended untracked file is enumerated.
- Intended-tree hygiene and `git diff --check` pass, with no unresolved conflict
  markers.
- No secrets, credentials, linked Supabase metadata, or private environment
  files are included.
- The deterministic snapshot fingerprint covers the entire intended snapshot
  except its explicit recursion exclusion.

### Gate 3 — Production behavior boundary

- The frozen-base diff under `src`, `supabase/functions`, and
  `supabase/migrations` is empty unless an explicitly approved Stage A
  correction requires otherwise.
- Every production/runtime change has matching validation evidence.

### Gate 4 — Current-state inventory

- The machine-readable Stage A inventory is current.
- Route, tab, table, function, migration, provider, lifecycle, placeholder, and
  deprecated-path classifications reconcile.
- Inventory identity is content-based and survives an identical-content
  snapshot commit.

### Gate 5 — Live-state evidence

A timestamped, read-only, provenance-bound capture confirms:

- production project ref `xivewedajschthjlblfb`;
- linked migration list and linked database push dry run;
- deployed Edge Function list and linked database lint;
- schema-only production dump;
- GitHub Pages configuration, successful workflow, and deployed SHA;
- live Pages HTTP response.

Every required live artifact is present, hash-valid, and bound to command,
project, time, tool version, and exit status.

### Gate 6 — Route B reconstruction

The repository contains an immutable captured production schema authority,
deterministic executable application-schema projection, bootstrap
configuration/data, explicit post-cutover migration rule, and guarded
disposable reconstruction runner. Reconstruction starts from an empty
application schema and completes successfully.

### Gate 7 — Executed database evidence

The disposable PostgreSQL run executes and passes:

- catalogue checks at the documented scope;
- RLS enabled/count checks and representative restricted grants;
- storage, required seeds, and held/deprecated absence;
- symmetric two-client isolation;
- representative constraints and foreign keys;
- representative global/client-scoped uniqueness;
- actual database idempotency create/replay/conflict behavior;
- cleanup and zero remaining containers.

Behavioral database evidence is representative unless explicitly documented
otherwise. Exhaustive behavior for every database object is not required.

### Gate 8 — Database execution source binding

The disposable database transcript is deterministically bound to the exact
current bytes of the database runner, Supabase configuration, executable
schema, captured schema authority, bootstrap data, baseline manifest, all
executed verification SQL, every applicable post-cutover migration, and the
baseline-generation and comparison utilities used by the run. The checker
independently recomputes and matches this binding.

### Gate 9 — Build, CI, and deterministic tests

The exact supported CI runtime passes dependency installation, typecheck, lint
with zero errors, canonical `npm test`, and build. The canonical deterministic
suite has zero failures, zero skips, stable totals, and final-source content
binding. Provider responses may remain mocked where accurately classified.

### Gate 10 — Read-only and checkout portability

- Tests pass with the repository non-writable.
- Evidence validation passes in a byte-identical checkout with new filesystem
  modification times.
- Evidence freshness uses path-and-byte identity rather than modification
  times or checkout-local metadata.

### Gate 11 — Evidence consistency

- Every transcript hash matches.
- Every required command, runtime/tool version, UTC range, and exit status is
  recorded.
- Every evidence schema version is supported.
- Current report claims do not exceed their evidence; representative evidence
  is not described as exhaustive.
- External and deferred state is clearly classified.

### Gate 12 — Cleanup and safety

- No disposable Docker containers remain.
- No production mutation, deployment, linked migration application, Edge
  Function invocation, or Stage B work occurred.
- The Stage A implementation worktree remains uncommitted until the
  orchestrator snapshots it.

### Frozen classification boundaries

`GENUINE_BLOCKER` is permitted only when a Gate 1–12 requirement fails,
evidence supporting a gate is missing/stale/contradictory/false, a material
security/data-loss/production-safety defect is found, or snapshotting the exact
current tree would knowingly create an invalid baseline. Every blocker must be
mapped to the relevant gate.

The following are `NON_BLOCKING_IMPROVEMENT`, not blockers: stronger forensic
attestation outside Gates 1–12; additional representative tests beyond the
named database classes; transcript-format improvements; more exhaustive ACL,
policy, constraint, or RPC behavior testing; dependency audit advisories; lint
warnings when lint exits zero; optional privacy sanitization; stylistic or
documentation improvements; future migration behavior while the post-cutover
set is zero; and standalone legacy tests outside the canonical suite unless a
frozen gate explicitly requires them.

The following are `LIFECYCLE_PENDING`: snapshot commit, clean post-snapshot
worktree, result commit SHA, human approval, integration-branch advancement,
push, and authorization to begin Stage B.

The following are `DEFERRED_EXTERNAL_STATE` where already documented: Cron
scheduling; Vault values and provider secrets; Auth users/dashboard state;
external provider/account configuration; the insights-worker installer; and
intentionally unscheduled workers.

### Frozen verification output rule

The final result is based only on Gates 1–12. A blocker line must use
`GENUINE_BLOCKER: GATE_n: description`, where `n` is 1–12. Other findings use
`LIFECYCLE_PENDING:`, `DEFERRED_EXTERNAL_STATE:`, or
`NON_BLOCKING_IMPROVEMENT:`. When all gates pass and only lifecycle, deferred,
non-blocking, or out-of-contract suggestions remain, the verifier must return
`VERIFICATION_PASSED` and must not continue searching for new acceptance
categories.

---

## Full-circle implementation instruction

Complete every part of Programme Stage A required to satisfy its objective, scope, required outputs, acceptance criteria and exit gate.

Work through the repository end to end:

1. Map the current implementation relevant to this stage, including UI, shared types, API functions, database tables/views/RPCs, Edge Functions, queues or cron jobs, tests, documentation and deployment state.
2. Identify the exact gap between the current implementation and the Stage A target without replacing working systems unnecessarily.
3. Define or confirm the canonical ownership and state model before writing code.
4. Implement all schema changes through ordered, reversible migrations with correct constraints, indexes, RLS, grants and compatibility behaviour.
5. Implement backend and Edge Function logic with strict validation, client ownership, idempotency, provenance, failure handling and deterministic state transitions.
6. Implement shared TypeScript domain types and API contracts so frontend and backend use the same canonical model.
7. Implement or update every required operator UI, including clear status, source and provenance visibility, approval boundaries, empty/error/retry/conflict states and safe actions.
8. Connect the stage to the canonical Cockpit spine and all completed earlier stages. Do not create an isolated feature or leave adapters incomplete.
9. Preserve historical data and current operations through compatibility adapters, projections, dual writes, backfills or controlled cutovers as required.
10. Remove or disable obsolete behaviour only where the Stage A requirements explicitly permit it and the replacement path is proven.
11. Add comprehensive deterministic, database, integration and UI coverage for successful, invalid, duplicate, stale, cross-client, retry, partial and failure scenarios.
12. Update repository documentation and produce a Stage A implementation report containing changed files, migrations, functions, state transitions, tests, deployment requirements, live-verification evidence and any explicitly deferred item.

Do not stop after producing recommendations. Do not leave TODO placeholders for work that belongs to this stage. Do not weaken validation or security to make tests pass. Do not silently alter the locked architecture.

## Required completion and verification

Before treating this stage as complete:

- Run repository typechecking, build and lint.
- Run the full deterministic test suite, not only new tests.
- Add and run contract tests for every new request, response, status transition and failure code.
- Add and run database tests for constraints, foreign keys, uniqueness, transactions, RLS, grants, cross-client isolation and idempotency.
- Add and run integration tests that exercise the complete stage workflow through real API and persistence boundaries.
- Add UI tests or deterministic assertions for loading, empty, success, conflict, validation, partial, retry, failure, approval and disabled states.
- Verify migration ordering and run a migration dry run against the linked project where available.
- Verify every new or modified Edge Function bundles correctly and uses the intended JWT and secret policy.
- Run secret scans, project-reference guards and `git diff --check`.
- Confirm existing Phase 1, Phase 2, Ideation, production, distribution, analytics and Reel Studio paths have not regressed.
- Inspect the final diff for accidental files, generated artefacts, duplicate schemas, stale names, deprecated references and local-only configuration.
- Update the canonical architecture documentation, data dictionary, migration ledger and a stage implementation report.
- Record what is confirmed from code, live-verified, mocked, intentionally deferred or blocked.
- Do not claim completion merely because code compiles or mocked tests pass. Completion requires every stage acceptance criterion and exit gate to be satisfied.

## Final response required from the operator

At completion, return a structured report containing:

- Stage implemented
- Baseline commit and final working-tree state
- Architecture and data-model decisions
- Migrations added or changed
- Backend, RPC and Edge Function changes
- Frontend and operator-workflow changes
- Compatibility, backfill and cutover behaviour
- Security, RLS and client-isolation verification
- Tests added and complete test results
- Build, lint and typecheck results
- Deployment actions performed or still requiring explicit authority
- Live verification completed
- Deferred or blocked items, with precise reasons
- Confirmation against every Stage A acceptance criterion
- Confirmation that the Stage A exit gate is satisfied

The stage is complete only when the repository implements the intended behaviour as one integrated part of Cockpit and all verification is clean.
