# Build Phase 2-A — 2A-C: Market OS

You are operating inside Attract Acquisition's `AttractAcq/Cockpit` repository and are responsible for implementing **2A-C — Market OS**. This is a full implementation task, not a speculative report.

## Programme authority and position

- Governing plan: `config/programme/phase-2a/market-intelligence-build-plan.md` in the Programme Orchestrator authority repository.
- Dependency position: Stage 2A-B is complete.
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

# 9. Stage 2A-C — Market OS

## Objective

Quantify the client’s realistic commercial market and identify the segments worth targeting.

## Scope

Market OS must model:

- TAM
- SAM
- SOM
- Targetable Media Market
- Priority segments
- Geography
- Purchase frequency
- Average value
- Seasonality
- Capacity constraints
- Competitive density
- Reachability

## Required work

### 9.1 Market definition

Create explicit definitions for:

- Product or service
- Buyer
- Geography
- Time period
- Eligibility
- Exclusions
- Purchase event
- Unit of measurement

### 9.2 Market size models

Support:

```text
top_down
bottom_up
proxy_based
capacity_constrained
media_reach_based
```

A market model may combine methods.

### 9.3 Required market outputs

```yaml
tam_count:
tam_value:
sam_count:
sam_value:
som_count:
som_value:
targetable_media_market_count:
targetable_media_market_value:
```

Each output must include:

- Method
- Formula
- Inputs
- Source
- Assumptions
- Range
- Confidence
- Date

### 9.4 Segment model

Segments may use:

- Geography
- Property type
- Business type
- Household type
- Job value
- Need state
- Trigger event
- Urgency
- Service line
- Profitability
- Reachability
- Platform
- Seasonality

### 9.5 Capacity constraints

SOM must account for:

- Delivery capacity
- Geographic radius
- Staff
- Equipment
- Production capacity
- Sales capacity
- Budget
- Lead response
- Fulfilment limits

### 9.6 Market OS UI

Support:

- Market definition
- Calculation builder
- Source inspection
- Assumption editing
- Sensitivity cases
- Segment table
- Segment priority
- Confidence
- Approval
- Version comparison
- Refresh

### 9.7 Market implications

Generate:

- Priority segments
- Segments to avoid
- Required proof
- Platform implications
- Offer implications
- Seasonal opportunities
- Capacity risks
- Content priorities

## Deliverables

- Market schemas
- Market model engine
- Source and assumption system
- TAM/SAM/SOM calculations
- Targetable Media Market
- Segment system
- Sensitivity analysis
- Market review UI
- Human-readable report
- Tests

## Acceptance criteria

1. A client market can be explicitly defined.
2. TAM, SAM, SOM and media-reachable market are calculated.
3. Every result exposes its method and assumptions.
4. Observed and modelled values are distinguished.
5. Sensitivity cases work.
6. Capacity affects SOM.
7. Segments can be prioritised.
8. Approved market models are versioned.
9. Market outputs are consumable downstream.
10. No calculated estimate is presented as verified fact.

## Exit gate

For a test client, Cockpit can produce an approved, evidence-backed market model with transparent TAM, SAM, SOM, reachability and segment priorities.

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
