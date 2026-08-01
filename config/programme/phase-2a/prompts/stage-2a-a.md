# Build Phase 2-A — 2A-A: Intelligence Architecture and Research Foundation

You are operating inside Attract Acquisition's `AttractAcq/Cockpit` repository and are responsible for implementing **2A-A — Intelligence Architecture and Research Foundation**. This is a full implementation task, not a speculative report.

## Programme authority and position

- Governing plan: `config/programme/phase-2a/market-intelligence-build-plan.md` in the Programme Orchestrator authority repository.
- Dependency position: Build Phase 1-B is complete.
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

# 7. Stage 2A-A — Intelligence Architecture and Research Foundation

## Objective

Create the canonical foundation used by every later Market Intelligence system.

## Scope

This stage establishes:

- Shared research contracts
- Evidence model
- Confidence model
- Versioning
- Approval
- Refresh
- Research-provider abstraction
- Source governance
- Core UI shells
- Global and client intelligence status

It does not yet complete Avatar, Market or Competitor research.

## Required work

### 7.1 Architecture

Define:

- Domain boundaries
- Entity ownership
- Authority relationship with Phase 1 and Phase 2
- Research-run lifecycle
- Evidence lifecycle
- Approval lifecycle
- Refresh policy
- Supersession policy
- Downstream-consumer contracts
- Failure taxonomy
- Cost tracking
- Provider abstraction

### 7.2 Confidence framework

Implement a field-level confidence model.

Recommended fields:

```yaml
confidence_level:
confidence_score:
confidence_reason:
evidence_count:
source_quality:
source_recency:
contradiction_state:
review_required:
```

Recommended levels:

```text
verified
strongly_inferred
weakly_inferred
modelled
unknown
not_relevant
```

### 7.3 Evidence framework

Every research finding must support:

```yaml
source_type:
source_url_or_record:
source_title:
publisher_or_owner:
retrieved_at:
published_at:
evidence_excerpt:
structured_observation:
content_hash:
client_id:
research_run_id:
usage_permissions:
```

### 7.4 Research-provider abstraction

Support provider-neutral capabilities:

```text
web_search
web_page_fetch
social_profile_discovery
social_content_observation
ad_library_observation
document_analysis
structured_extraction
calculation
classification
summarisation
```

Do not make one provider the domain architecture.

### 7.5 Shared research jobs

Implement:

- Persistent runs
- Persistent steps
- Retry
- Backoff
- Provider wait
- Partial completion
- Cost records
- Last error
- Resume
- Cancellation
- Idempotency

### 7.6 Client UI shell

Create the Market Intelligence client area with:

- Overview
- Domain completion
- Freshness
- Research history
- Pending approvals
- Evidence summary
- No-data states
- Error states
- Refresh actions

### 7.7 Global UI shell

Create the portfolio view showing:

- Client
- Avatar status
- Market status
- Competitor status
- Association status
- Platform status
- Last refresh
- Pending review
- Failure
- Estimated next action

## Deliverables

- Shared schema
- Shared types
- Research API
- Provider interface
- Evidence and confidence system
- Approval and versioning system
- Client Market Intelligence shell
- Global portfolio shell
- Research-run UI
- Architecture documentation
- Test fixtures

## Acceptance criteria

1. A research run can be created, resumed, failed and retried.
2. Evidence is client scoped.
3. Findings contain confidence and evidence.
4. Approved records are version controlled.
5. Staleness can be calculated.
6. Research costs are recorded.
7. Client and global status screens work.
8. No unsupported finding can be marked verified without evidence.
9. Cross-client evidence references fail.
10. All migrations, RLS, API and UI tests pass.

## Exit gate

The shared intelligence foundation is complete and no later domain needs to invent a separate research, evidence, confidence or approval system.

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
