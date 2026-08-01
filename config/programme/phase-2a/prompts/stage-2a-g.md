# Build Phase 2-A — 2A-G: Ideation Integration, Continuous Intelligence and Operationalisation

You are operating inside Attract Acquisition's `AttractAcq/Cockpit` repository and are responsible for implementing **2A-G — Ideation Integration, Continuous Intelligence and Operationalisation**. This is a full implementation task, not a speculative report.

## Programme authority and position

- Governing plan: `config/programme/phase-2a/market-intelligence-build-plan.md` in the Programme Orchestrator authority repository.
- Dependency position: Stage 2A-F is complete.
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

# 13. Stage 2A-G — Ideation Integration, Continuous Intelligence and Operationalisation

## Objective

Make Market Intelligence an active input into content, Ads, planning, performance and future learning.

## Required work

### 13.1 Content Opportunity enrichment

Extend Content Opportunities with:

```yaml
primary_avatar_id:
secondary_avatar_ids:
market_segment_id:
market_intelligence_version_id:
competitors_referenced:
competitive_pattern:
competitive_gap:
differentiation_angle:
positive_associations:
negative_associations_to_avoid:
recommended_platforms:
recommended_formats:
platform_experiment_id:
market_relevance:
evidence:
confidence:
```

### 13.2 Existing source streams

Enrich:

- Manual Ideas
- Proof-led Opportunities
- Seven-technique Research
- Performance-led Opportunities

with Market Intelligence.

The revised generation contract is:

```text
Source
+ Avatar
+ Segment
+ Competitor landscape
+ Competitive gap
+ Association strategy
+ Platform strategy
→ Content Opportunity
```

### 13.3 New intelligence-driven generators

Add:

#### Avatar tension generator

Uses:

- Fear
- Desire
- Objection
- Trigger
- Identity
- Decision conflict
- Primary versus secondary Avatar tension

#### Competitive-gap generator

Uses:

- Weak competitor proof
- Unanswered questions
- Saturated messages
- Missing formats
- Unserved segments
- Trust gaps
- Offer gaps

#### Association generator

Creates content designed to:

- Reinforce a positive association
- Reject a negative category association
- Demonstrate desired identity
- Borrow legitimate trust
- Show category contrast

#### Market-segment generator

Uses:

- Priority segment
- High-value segment
- Seasonal segment
- Geographic segment
- Underserved segment

#### Platform-native generator

Uses:

- Facebook behaviour
- Instagram behaviour
- Community context
- Platform-specific CTA
- Platform-native format

### 13.4 Opportunity scoring

Add intelligence-aware scoring:

- Avatar relevance
- Segment value
- Market size
- Competitive whitespace
- Association strength
- Platform fit
- Proof availability
- Commercial objective
- Timeliness
- Production feasibility
- Saturation risk

### 13.5 Content Brief integration

Briefs should receive:

- Target Avatar
- Secondary decision-maker
- Segment
- Competitive context
- Required differentiation
- Positive associations to reinforce
- Negative associations to avoid
- Platform-specific treatment
- Evidence and confidence
- Proof requirements

### 13.6 Ad integration

Ads should consume:

- Avatar and buying role
- Segment
- Market size
- Competitor messaging
- Competitive gap
- Association strategy
- Platform recommendation
- Proof requirement
- Experiment hypothesis

### 13.7 Performance feedback

Performance should update:

- Platform confidence
- Format confidence
- Avatar-response confidence
- Segment-response confidence
- Proof preferences
- Association hypotheses
- Competitive-gap value
- Market assumptions where appropriate

Performance must not silently rewrite approved intelligence.

It should create:

```text
market_intelligence_change_proposals
```

### 13.8 Continuous monitoring

Recommended schedules:

```text
Weekly
Competitor content monitoring

Monthly
Competitor profile refresh
Platform recommendation review
Competitive-gap refresh

Quarterly
Avatar refresh
Market-size refresh
Association review
Full intelligence synthesis refresh

Event triggered
Major performance change
New service
New geography
New Offer
Major competitor move
New verified Proof
```

### 13.9 Global operational controls

Complete the portfolio view with:

- Stale intelligence
- Scheduled refresh
- Failed monitoring
- Approval queue
- Cost
- Provider usage
- Clients missing Avatar OS
- Clients missing Market OS
- Clients missing Competitor OS
- Clients missing Platform Strategy

### 13.10 Phase 2-B bridge

Expose versioned domain commands for the later AI layer:

```text
run_avatar_os
refresh_avatar_os
run_market_os
refresh_market_os
discover_competitors
refresh_competitor_os
monitor_competitor_content
run_association_intelligence
refresh_association_intelligence
recommend_platform_mix
create_platform_experiment
synthesise_market_intelligence
generate_avatar_opportunities
generate_competitive_gap_opportunities
generate_association_opportunities
generate_market_segment_opportunities
refresh_client_market_intelligence
show_market_intelligence_blockers
```

These commands should exist as safe domain actions before the Phase 2-B Client Agent calls them.

## Deliverables

- Opportunity enrichment
- New generators
- Intelligence-aware scoring
- Brief integration
- Ad integration
- Performance feedback
- Change proposals
- Monitoring schedules
- Global operations completion
- Phase 2-B command bridge
- End-to-end tests
- Final implementation report

## Acceptance criteria

1. Approved Market Intelligence affects Content Opportunities.
2. Avatar, segment, competitive and association context are preserved.
3. New intelligence-driven generators work.
4. Opportunity scoring uses Market Intelligence.
5. Briefs receive the required intelligence.
6. Ads receive the required intelligence.
7. Facebook and Instagram recommendations influence renditions.
8. Performance creates controlled intelligence proposals.
9. Refresh schedules are idempotent and observable.
10. Global portfolio intelligence status is operational.
11. Safe domain commands are available for Phase 2-B.
12. No AI or automation path needs to bypass canonical records.

## Exit gate

For a test client, approved Avatar, Market, Competitor, Association and Platform intelligence can move through Ideation, Opportunity scoring, planning, production, distribution and performance learning as one traceable system.

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
