# Build Phase 2-A — 2A-B: Avatar OS

You are operating inside Attract Acquisition's `AttractAcq/Cockpit` repository and are responsible for implementing **2A-B — Avatar OS**. This is a full implementation task, not a speculative report.

## Programme authority and position

- Governing plan: `config/programme/phase-2a/market-intelligence-build-plan.md` in the Programme Orchestrator authority repository.
- Dependency position: Stage 2A-A is complete.
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

# 8. Stage 2A-B — Avatar OS

## Objective

Create an evidence-backed model of the client’s primary, secondary and tertiary buying Avatars and the relationships between them.

## Scope

Avatar OS must answer:

- Who initiates the purchase?
- Who researches?
- Who approves?
- Who pays?
- Who uses the service?
- Who blocks the purchase?
- Who influences trust?
- Which role changes at different price thresholds?
- Which fears, desires, objections and associations influence each role?
- Which platforms and formats are relevant to each role?

## Required work

### 8.1 Avatar question library

Create a versioned question framework of approximately 150 high-value questions.

Organise the questions into domains:

1. Identity and demographics
2. Household and family
3. Employment and income
4. Property and asset ownership
5. Buying role
6. Trigger events
7. Current situation
8. Problems
9. Functional fears
10. Financial fears
11. Emotional fears
12. Social fears
13. Desired functional outcomes
14. Desired emotional outcomes
15. Desired identity outcomes
16. Decision criteria
17. Objections
18. Previous attempts
19. Alternatives
20. Trust requirements
21. Proof preferences
22. Language
23. Search behaviour
24. Platform behaviour
25. Media behaviour
26. Community behaviour
27. Cultural and sporting associations
28. Brand associations
29. Daily routine
30. Time constraints
31. Purchase timing
32. Purchase frequency
33. Price sensitivity
34. Commercial value
35. Referral potential
36. Secondary decision-maker behaviour
37. Tertiary influencer behaviour

Each question requires:

```yaml
question_id:
question_version:
domain:
question:
commercial_reason:
required_or_optional:
applicable_avatar_roles:
acceptable_evidence_types:
```

### 8.2 Buying-role model

Support:

```text
primary_buyer
economic_buyer
researcher
influencer
approver
end_user
gatekeeper
referrer
secondary_decision_maker
```

Allow one person to hold multiple roles.

### 8.3 Avatar relationships

Map:

- Influence direction
- Approval thresholds
- Conflict
- Shared objections
- Different desired outcomes
- Information transfer
- Final decision authority

Example:

```text
Primary homeowner initiates
→ spouse becomes approver above R5,000
→ neighbour or family referral influences trust
```

### 8.4 Avatar research agent

The research workflow must:

```text
Read approved Context
→ identify likely buying roles
→ build research plan
→ gather evidence
→ answer applicable questions
→ identify unknowns
→ assign confidence
→ create Avatars
→ create relationship map
→ generate strategic implications
→ submit for review
```

### 8.5 Avatar review UI

Support:

- Question-by-question answers
- Evidence
- Confidence
- Unknowns
- Operator edits
- Role changes
- Relationship map
- Approval
- Version comparison
- Refresh
- Exported human-readable report

### 8.6 Avatar outputs

Each Avatar must include:

```yaml
avatar_role:
priority:
segment:
demographic_profile:
household_profile:
buying_role:
triggers:
problems:
fears:
desired_outcomes:
decision_criteria:
objections:
language_patterns:
information_sources:
platform_usage:
positive_associations:
negative_associations:
proof_preferences:
content_preferences:
commercial_value:
evidence:
confidence_by_field:
unknowns:
approval_status:
version:
```

## Deliverables

- Question library
- Avatar schemas
- Buying-role system
- Relationship model
- Avatar research workflow
- Avatar review UI
- Avatar report rendering
- Avatar version history
- Tests

## Acceptance criteria

1. Primary, secondary and tertiary Avatars can be represented.
2. Buying roles can be separate from demographic personas.
3. Every material answer contains evidence, confidence or unknown.
4. Unsupported precision is not presented as fact.
5. Threshold-based role changes can be modelled.
6. Avatar relationships are visible.
7. Approved Avatars are versioned.
8. Avatar data is consumable by Ideation and platform systems.
9. Cross-client Avatar data cannot leak.
10. End-to-end research and approval tests pass.

## Exit gate

For a test client, Cockpit can produce and approve a complete buying-system model with evidence, confidence, primary, secondary and tertiary Avatars.

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
