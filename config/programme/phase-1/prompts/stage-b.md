# Orchestrator Authority Resolution

This standalone prompt was extracted from the approved `Cockpit_Build_Plan_Prompts_Rendered.md` collection. Inside the target `AttractAcq/Cockpit` repository, resolve programme authority references to the current canonical paths:

- `docs/programme/Cockpit_Build_Plan.md`
- `docs/programme/High_level_Cockpit_Audit_30_01_2026.md`
- `docs/programme/Cockpit_Build_Plan_Prompts_Rendered.md`
- `docs/programme/phase_2_ai_build_plan.md`

Where the imported prompt body uses a root-level filename, use the matching `docs/programme/` path. Do not change the approved programme requirements.

---

You are operating inside Attract Acquisition’s `AttractAcq/Cockpit` repository and are responsible for implementing **Programme Stage B — Canonical Architecture and Data Spine** from the canonical Cockpit build programme.

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

Programme Stages A are prerequisites. Confirm their canonical outputs and contracts are present and preserve them. Do not redesign or bypass completed earlier stages. Where a prerequisite is genuinely absent, implement only the minimum safe prerequisite required, document the discrepancy and do not falsely mark this stage complete.

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

## Authoritative Stage B requirements

## Objective

Define and implement the shared domain model that every later feature must use.

## Scope

### Terminology

Lock the following vocabulary:

- Content Source
- Manual Idea
- Proof Item
- Research Candidate
- Performance Insight
- Content Opportunity
- Content Requirement
- Calendar Slot
- Content Item
- Content Brief
- Production Job
- Asset
- Distribution Record
- Performance Record
- Learning Proposal

### Canonical entities

Create additive schema for:

- `content_sources`
- `manual_ideas`
- `proof_items`
- `content_opportunities`
- `content_opportunity_sources`
- `content_requirements`
- `calendar_slots`
- `content_items`
- `content_item_sources`
- `content_item_proof`
- `content_briefs`
- `production_jobs`
- `content_performance`
- `learning_proposals`

Exact table names may change, but entity ownership may not.

### Ownership boundaries

Define:

- Which entity owns the scheduled date
- Which entity owns the format
- Which entity owns the source relationship
- Which entity owns production status
- Which entity owns approval
- Which entity owns distribution
- Which entity owns analytics
- Which entity owns authority provenance

### Status machines

Define allowed transitions for:

#### Content Opportunity

```text
draft
→ needs_review
→ shortlisted
→ selected
→ scheduled
→ produced

draft / needs_review / shortlisted
→ rejected

draft / needs_review / shortlisted
→ expired
```

#### Content Item

```text
planned
→ brief_pending
→ brief_review
→ production_ready
→ in_production
→ asset_review
→ approved
→ scheduled
→ published
→ analysed
→ iterated
```

Include:

- cancelled
- blocked
- failed
- archived

with explicit transition rules.

### Authority snapshot contract

Every Opportunity and Content Item must be able to reference:

- Context file IDs and versions
- Execution file IDs and versions
- Playbook versions
- Brand authority
- Offer authority
- Generation date
- Configuration hash

### Compatibility strategy

Define how the new entities initially project into:

- `organic_master`
- `story_master`
- `ads_master`
- Existing Calendar tables
- Existing Production Brief tables

No destructive migration occurs in this stage.

## Required outputs

- Architecture decision record
- Entity relationship diagram
- State-machine specification
- Additive database migrations
- Shared TypeScript types
- Read APIs
- Staff-only write RPCs
- Provenance contract
- Compatibility-adapter specification

## Tests

- Cross-client ownership isolation
- Invalid state transitions
- Duplicate source links
- Duplicate Calendar allocations
- Authority snapshot immutability
- RLS and role access
- Idempotent creation
- Compatibility projection integrity

## Acceptance criteria

- All new entities exist with RLS.
- Service-role-only writes are enforced where required.
- Existing production behaviour is unchanged.
- One test Content Source can be linked to one test Opportunity and one test Content Item.
- The new entities can coexist with legacy master records.
- The ownership of every important field is unambiguous.

## Exit gate

No new Manual Idea, Proof or Research commitment workflow may bypass the canonical entities.

---

## Full-circle implementation instruction

Complete every part of Programme Stage B required to satisfy its objective, scope, required outputs, acceptance criteria and exit gate.

Work through the repository end to end:

1. Map the current implementation relevant to this stage, including UI, shared types, API functions, database tables/views/RPCs, Edge Functions, queues or cron jobs, tests, documentation and deployment state.
2. Identify the exact gap between the current implementation and the Stage B target without replacing working systems unnecessarily.
3. Define or confirm the canonical ownership and state model before writing code.
4. Implement all schema changes through ordered, reversible migrations with correct constraints, indexes, RLS, grants and compatibility behaviour.
5. Implement backend and Edge Function logic with strict validation, client ownership, idempotency, provenance, failure handling and deterministic state transitions.
6. Implement shared TypeScript domain types and API contracts so frontend and backend use the same canonical model.
7. Implement or update every required operator UI, including clear status, source and provenance visibility, approval boundaries, empty/error/retry/conflict states and safe actions.
8. Connect the stage to the canonical Cockpit spine and all completed earlier stages. Do not create an isolated feature or leave adapters incomplete.
9. Preserve historical data and current operations through compatibility adapters, projections, dual writes, backfills or controlled cutovers as required.
10. Remove or disable obsolete behaviour only where the Stage B requirements explicitly permit it and the replacement path is proven.
11. Add comprehensive deterministic, database, integration and UI coverage for successful, invalid, duplicate, stale, cross-client, retry, partial and failure scenarios.
12. Update repository documentation and produce a Stage B implementation report containing changed files, migrations, functions, state transitions, tests, deployment requirements, live-verification evidence and any explicitly deferred item.

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
- Confirmation against every Stage B acceptance criterion
- Confirmation that the Stage B exit gate is satisfied

The stage is complete only when the repository implements the intended behaviour as one integrated part of Cockpit and all verification is clean.
