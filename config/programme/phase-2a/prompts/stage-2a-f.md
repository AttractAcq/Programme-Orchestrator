# Build Phase 2-A — 2A-F: Platform Intelligence and Market Synthesis

You are operating inside Attract Acquisition's `AttractAcq/Cockpit` repository and are responsible for implementing **2A-F — Platform Intelligence and Market Synthesis**. This is a full implementation task, not a speculative report.

## Programme authority and position

- Governing plan: `config/programme/phase-2a/market-intelligence-build-plan.md` in the Programme Orchestrator authority repository.
- Dependency position: Stage 2A-E is complete.
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

# 12. Stage 2A-F — Platform Intelligence and Market Synthesis

## Objective

Combine Avatar, Market, Competitor and Association intelligence into one approved client strategy and determine the platforms and formats that should be tested.

## Prerequisite

Build Phase 1-B must already provide first-class Facebook distribution and analytics alongside Instagram.

## Required work

### 12.1 Platform Intelligence

Evaluate at minimum:

- Facebook
- Instagram

The model should support later additions without redesign:

- LinkedIn
- TikTok
- YouTube
- Google Business Profile
- Email
- WhatsApp
- Directories

### 12.2 Platform evaluation factors

```text
Avatar presence
Buying-role presence
Organic reach potential
Paid targeting capability
Community relevance
Format fit
Lead-capture capability
Local-market behaviour
Competitor activity
Historical client performance
Cost per qualified outcome
Operational effort
Production fit
```

### 12.3 Platform strategy outputs

```yaml
platform:
priority:
target_avatars:
objectives:
recommended_formats:
recommended_cadence:
recommended_content_types:
recommended_ctas:
organic_role:
paid_role:
community_role:
evidence:
confidence:
test_required:
approval_status:
```

### 12.4 Platform renditions

Consume the Phase 1-B rendition architecture:

```text
One Content Item
→ Instagram rendition
→ Facebook rendition
```

Support platform-specific:

- Copy
- CTA
- Aspect ratio
- Duration
- Thumbnail
- Community framing
- Scheduling
- Metadata
- Analytics

### 12.5 Platform experiments

Create:

```yaml
hypothesis:
avatar:
segment:
platforms:
formats:
message:
organic_or_paid:
budget_or_window:
primary_metric:
secondary_metrics:
start_date:
end_date:
result:
confidence:
decision:
```

### 12.6 Client Market Intelligence Synthesis

Create one approved synthesis covering:

- Primary, secondary and tertiary Avatars
- Buying committee
- Priority segments
- TAM, SAM, SOM and reachability
- Competitor landscape
- Demand patterns
- Competitive gaps
- Positive associations
- Negative associations
- Positioning implications
- Offer implications
- Proof requirements
- Platform strategy
- Format strategy
- Research gaps
- Recommended tests

### 12.7 Strategic implication records

Implications should be typed:

```text
positioning
offer
proof
brand
content
ad
platform
distribution
sales
research
```

Do not silently apply strategic changes.

Create reviewable proposals where existing approved authority may need to change.

### 12.8 Synthesis UI

Support:

- Executive overview
- Evidence drill-down
- Contradictions
- Unknowns
- Recommendations
- Platform strategy
- Proposed strategic changes
- Approval
- Version history
- Export

## Deliverables

- Platform Intelligence model
- Facebook/Instagram comparison
- Platform experiment system
- Client Market Intelligence Synthesis
- Strategic implications
- Change proposals
- Review UI
- Tests

## Acceptance criteria

1. Facebook and Instagram are independently evaluated.
2. Platform strategy is linked to specific Avatars and segments.
3. Platform outputs are evidence backed.
4. Platform experiments can be created and measured.
5. The synthesis includes all intelligence domains.
6. Contradictions and unknowns remain visible.
7. Strategic implications are typed and reviewable.
8. Existing approved Context is not silently overwritten.
9. Approved synthesis is versioned.
10. Downstream systems can retrieve the approved synthesis.

## Exit gate

For a test client, Cockpit can approve one integrated Market Intelligence Strategy that explains who to target, how large the opportunity is, how competitors operate, what associations matter, and which platforms and formats should be tested.

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
