# Build Phase 2-A — 2A-E: Association Intelligence

You are operating inside Attract Acquisition's `AttractAcq/Cockpit` repository and are responsible for implementing **2A-E — Association Intelligence**. This is a full implementation task, not a speculative report.

## Programme authority and position

- Governing plan: `config/programme/phase-2a/market-intelligence-build-plan.md` in the Programme Orchestrator authority repository.
- Dependency position: Stage 2A-D is complete.
- The complete stage requirements are reproduced below so this prompt is executable without access to the orchestrator repository.

## Market Intelligence governing context

Cockpit must understand the buyer, quantify the market, observe competitors, map trust-shaping associations and determine platform and format tests before deciding what content to create. Outputs must be structured, versioned, evidence-backed and confidence-labelled. Phase 2-A creates and maintains intelligence; Phase 2-B later retrieves and acts on it.


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

# 11. Stage 2A-E — Association Intelligence

## Objective

Map the positive and negative associations that shape buyer trust, quality, identity, status and rejection.

## Scope

Association Intelligence must model what each approved Avatar associates with:

- Trust
- Reliability
- Quality
- Safety
- Professionalism
- Value
- Status
- Local identity
- Modernity
- Competence
- Risk
- Exploitation
- Cheapness
- Poor workmanship

## Required work

### 11.1 Association categories

Support:

- People
- Brands
- Professions
- Institutions
- Communities
- Sports
- Media
- Places
- Visual styles
- Language styles
- Materials
- Behaviours
- Causes
- Rituals
- Status symbols
- Trust symbols
- Anti-signals

### 11.2 Association record

```yaml
avatar_id:
association_type:
subject:
sentiment:
strength:
meaning:
commercial_relevance:
evidence:
confidence:
brand_application:
content_application:
visual_application:
language_application:
partnership_application:
risk:
approval_status:
version:
```

### 11.3 Positive associations

Identify what should be borrowed or demonstrated through:

- Behaviour
- Proof
- Visuals
- Language
- Partnerships
- Sponsorships
- Locations
- Wardrobe
- Equipment
- People
- Institutions

### 11.4 Negative associations

Identify:

- Category stereotypes
- Trust destroyers
- Visual anti-signals
- Language anti-signals
- Sales behaviours
- Proof failures
- Reputation risks
- Cultural risks

### 11.5 Brand application

Association Intelligence must influence:

- Positioning
- Brand voice
- Photography
- Colour and visual decisions
- Locations
- Props
- Wardrobe
- Partnerships
- Community activity
- Sponsorship
- Proof selection
- Content treatment

### 11.6 Association UI

Support:

- Avatar-specific associations
- Positive and negative lists
- Strength
- Evidence
- Confidence
- Commercial relevance
- Brand applications
- Content applications
- Risks
- Approval
- Version history

## Deliverables

- Association schemas
- Association research workflow
- Positive and negative mapping
- Brand-application engine
- Content-application engine
- Visual and language implications
- Review UI
- Tests

## Acceptance criteria

1. Associations are linked to Avatars.
2. Positive and negative associations are distinct.
3. Evidence and confidence are visible.
4. Associations generate practical brand applications.
5. Associations generate practical content applications.
6. Risks are visible.
7. Unsupported cultural assumptions cannot be approved as verified.
8. Approved association sets are versioned.
9. Association inputs are available to Ideation and briefs.
10. Sensitive or discriminatory profiling is controlled and reviewable.

## Exit gate

For a test client, Cockpit can approve an evidence-backed Association Strategy that materially affects Brand, content and creative decisions.

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
