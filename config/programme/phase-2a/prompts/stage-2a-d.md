# Build Phase 2-A — 2A-D: Competitor OS

You are operating inside Attract Acquisition's `AttractAcq/Cockpit` repository and are responsible for implementing **2A-D — Competitor OS**. This is a full implementation task, not a speculative report.

## Programme authority and position

- Governing plan: `config/programme/phase-2a/market-intelligence-build-plan.md` in the Programme Orchestrator authority repository.
- Dependency position: Stage 2A-C is complete.
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

# 10. Stage 2A-D — Competitor OS

## Objective

Map the competitive and attention landscape and identify demand, conventions, gaps and opportunities.

## Scope

Competitor OS must cover:

- Direct competitors
- Indirect competitors
- Substitute solutions
- Attention competitors
- Category leaders
- Demand owners

## Required work

### 10.1 Competitor discovery

Discover and classify competitors using:

- Client Context
- Search
- Maps and directories
- Social platforms
- Review platforms
- Ads libraries
- Industry sources
- Operator additions

### 10.2 Competitor profiles

Each profile should include:

```yaml
name:
category:
locations:
services:
target_segments:
positioning:
offers:
pricing_signals:
guarantees:
proof_types:
review_profile:
brand_style:
colour_system:
visual_language:
channels:
posting_frequency:
formats:
themes:
advertising_activity:
landing_pages:
lead_capture:
follow_up:
sales_path:
strengths:
weaknesses:
gaps:
evidence:
confidence:
last_checked_at:
```

### 10.3 Website and landing-page observation

Track:

- Homepage positioning
- Primary CTA
- Offer
- Proof
- Trust markers
- Lead form
- Booking flow
- Pricing signals
- Page speed or quality signals where available
- Visual system
- Mobile experience
- Landing-page changes

### 10.4 Social-content observation

Track:

- Platform
- Date
- Format
- Topic
- Hook
- Proof type
- CTA
- Engagement
- Comments
- Repetition
- Visual treatment
- Apparent pattern
- Evidence

### 10.5 Ad observation

Track where legally and technically available:

- Active Ads
- Creative
- Hook
- Offer
- CTA
- Landing destination
- Duration
- Variants
- Apparent audience
- Evidence

### 10.6 Performance classification

Distinguish:

```text
observed_visibility
observed_engagement
inferred_success
commercially_verified_success
unknown
```

Do not equate visible engagement with commercial results.

### 10.7 Competitive-gap engine

Generate:

- Saturated messages
- Weak proof
- Missing proof
- Unanswered questions
- Unserved segments
- Positioning gaps
- Offer gaps
- Format gaps
- Platform gaps
- Trust gaps
- Demand-capture gaps
- Ethical adaptation opportunities

### 10.8 Competitor OS UI

Support:

- Competitor list
- Categories
- Profile
- Website snapshots
- Social observations
- Ad observations
- Offers
- Positioning
- Brand
- Gaps
- Comparison
- Refresh
- Approval
- Evidence
- Version history

## Deliverables

- Discovery system
- Competitor schemas
- Monitoring system
- Website observations
- Social observations
- Ad observations
- Competitive-gap engine
- Comparison UI
- Competitor report
- Tests

## Acceptance criteria

1. All competitor categories are supported.
2. Operator-added and discovered competitors coexist.
3. Every observation retains source and date.
4. Competitor success is not overstated.
5. Website, social, Ad, Offer and positioning observations are visible.
6. Competitive gaps are generated.
7. Gaps can feed Content Opportunities.
8. Monitoring is resumable and idempotent.
9. Approved profiles are versioned.
10. Cross-client competitor data remains isolated unless explicitly shared as a permitted market reference.

## Exit gate

For a test client, Cockpit can discover, approve, monitor and compare the relevant competitive landscape and generate evidence-backed competitive opportunities.

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
