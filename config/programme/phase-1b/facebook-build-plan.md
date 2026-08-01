# Phase 1-B Facebook Distribution Build Plan

**Product:** Attract Acquisition Cockpit  
**Programme:** Build Phase 1-B — Facebook Distribution and Facebook-Specific Platform Support  
**Internal stages:** 1B-A through 1B-F  
**Prerequisite:** Build Phase 1, Programme Stages A–P  
**Successor:** Build Phase 2-A — Market Intelligence and Audience Operating System

---

# 1. Programme Position

The complete build sequence is:

```text
Build Phase 1 — Core Cockpit, Stages A–P
→ Build Phase 1-B — Facebook Distribution, Stages 1B-A through 1B-F
→ Build Phase 2-A — Market Intelligence, Stages 2A-A through 2A-G
→ Build Phase 2-B — AI Control Plane and Fulfilment Automation, Stages AI-A through AI-N
```

Phase 1-B makes Facebook a first-class organic distribution destination alongside Instagram. It does not assume that Facebook is universally superior. It creates the platform capability, platform-specific rendition model and analytics required for Phase 2-A to test and recommend the correct platform mix per client and Avatar.

# 2. Strategic Objective

Cockpit must support one canonical Content Item producing distinct, governed platform renditions:

```text
Canonical Content Item
→ Instagram rendition
→ Facebook rendition
```

Each rendition may have different:

- Copy
- Hook treatment
- CTA
- Aspect ratio
- Duration
- Thumbnail
- Metadata
- Community or local framing
- Scheduling policy
- Publication state
- Analytics

The system must not treat Facebook as an alias for Instagram or report a cross-post as independently published without evidence.

# 3. Non-Negotiable Rules

1. Preserve the canonical Content Opportunity → Content Item → Brief → Asset → Distribution → Performance spine.
2. Preserve current Instagram and Meta integrations unless a controlled migration is required.
3. Use Facebook Pages and supported Meta destinations; do not automate personal profiles or unsupported surfaces.
4. Keep credentials, Page access tokens, system-user access and Meta App configuration outside tracked source.
5. Persist every external publication attempt before calling Meta.
6. Use idempotency, leases, retry caps, error classes and reconciliation.
7. Separate requested, accepted, processing, published and verified states.
8. Do not report publication success from an HTTP acceptance response alone.
9. Preserve client isolation and destination ownership.
10. Keep platform-specific policy and capability detection explicit.
11. Make unsupported Facebook formats fail closed with an actionable reason.
12. Do not launch paid campaigns; paid distribution remains governed by the approved Ad and Meta Ads architecture.
13. Use test Pages, fixtures or explicitly authorised clients for live verification.
14. Every platform output must retain Content Item, Brief, Asset, authority snapshot and operator provenance.

# 4. Target Domain Model

Required concepts include:

```text
platform_destinations
platform_destination_capabilities
content_renditions
rendition_assets
publication_jobs
publication_attempts
publication_receipts
publication_reconciliation
platform_performance_snapshots
platform_experiments
```

A Facebook destination must retain:

- Client ownership
- Meta business or portfolio identity where applicable
- Facebook Page identity
- Capability set
- Token reference, never raw secret material
- Connection and permission state
- Last verification time
- Revocation or expiry state

# 5. Required Facebook Formats

Support where the active Meta API and granted permissions permit:

- Facebook Page feed text/image posts
- Facebook Page video posts
- Facebook Reels
- Link posts when strategically and technically permitted
- Facebook Stories only where the API and account capability genuinely support them

The UI must display unavailable capabilities rather than pretending support.

# 6. Stage 1B-A — Facebook Architecture and Capability Baseline

## Objective

Reconcile the current Meta, Instagram, organic distribution and analytics implementation, then define the additive Facebook contracts and migration boundary.

## Scope

- Audit current Meta App, token, destination, publishing and webhook code.
- Trace every Instagram and Meta caller.
- Inventory existing distribution tables, RPCs, Edge Functions, UI and tests.
- Confirm current Meta Graph API version and supported Facebook Page publishing capabilities from repository configuration and approved primary documentation available to the operator.
- Define canonical platform, destination, rendition, publication and receipt contracts.
- Define status machines and failure taxonomy.
- Define compatibility with current Instagram publication records.
- Produce a migration and rollout plan.

## Required outputs

- Facebook capability matrix
- Current-state integration inventory
- Canonical domain contract
- Status and failure model
- Migration/backfill design
- Security and permission model
- Stage implementation report

## Tests

- Contract validation
- Status-transition tests
- Cross-client ownership tests
- Compatibility tests against existing Instagram records
- Capability-failure tests

## Acceptance criteria

- Current Meta behaviour is traced from UI to persistence and provider.
- Facebook capability is not inferred from Instagram capability.
- Canonical contracts are agreed in code and documentation.
- No existing Instagram path regresses.
- The next stage has an additive migration plan.

## Exit gate

No Facebook credential or publishing implementation begins until the destination, rendition, publication and verification contracts are canonical and tested.

# 7. Stage 1B-B — Facebook Page Destinations and Authorisation

## Objective

Create secure, client-scoped Facebook Page destination onboarding, capability discovery and connection health.

## Scope

- Add ordered additive migrations for destination and capability records.
- Implement Facebook Page discovery from authorised Meta identities.
- Implement explicit client-to-Page selection and ownership checks.
- Store token references and permission metadata without committing secrets.
- Detect required permissions and missing permissions.
- Verify Page access and supported publication capabilities.
- Handle token expiry, revocation, Page removal and permission loss.
- Add destination settings UI and health states.
- Preserve existing Instagram destination behaviour.

## Required outputs

- Schema and RLS
- Secure destination service
- Meta capability adapter
- Settings and connection UI
- Health and reconnect states
- Audit events
- Tests and documentation

## Tests

- Correct Page discovery
- Cross-client Page rejection
- Missing permission
- Expired or revoked token
- Duplicate destination
- Capability refresh
- Reconnect
- Existing Instagram regression

## Acceptance criteria

- A client can connect and approve a Facebook Page destination.
- Raw access tokens are not stored in tracked code or exposed to the browser.
- Capability state is visible and refreshable.
- Invalid ownership and stale credentials fail closed.
- Destination changes are audited.

## Exit gate

A verified Facebook Page destination and capability set can be selected safely by downstream rendition and publishing workflows.

# 8. Stage 1B-C — Facebook Renditions and Platform-Specific Planning

## Objective

Allow one canonical Content Item to produce an independent Facebook rendition without duplicating the Content Item lifecycle.

## Scope

- Implement content-rendition records linked to canonical Content Items.
- Support Facebook-specific copy, CTA, media treatment, metadata and scheduling guidance.
- Add format and capability validation.
- Extend Calendar and Brief surfaces to show intended platforms and rendition readiness.
- Add preview and approval states for Facebook renditions.
- Preserve shared assets where valid while allowing platform-specific assets.
- Prevent edits to a rendition from silently mutating the canonical Brief or another platform rendition.
- Add deterministic fallback rules only where approved.

## Required outputs

- Rendition schema and RLS
- Shared types and APIs
- Facebook rendition builder and preview
- Brief and Calendar integration
- Approval workflow
- Compatibility adapters
- Tests and documentation

## Tests

- One Content Item with multiple renditions
- Independent copy and CTA
- Shared versus platform-specific asset
- Unsupported format
- Approval boundaries
- Cross-client rejection
- Instagram regression

## Acceptance criteria

- Facebook is represented as an independent rendition.
- Content lineage remains canonical and traceable.
- Operators can review Facebook output before publishing.
- Unsupported destination capabilities block publication clearly.
- Instagram and Facebook data cannot overwrite one another.

## Exit gate

An approved Content Item can produce an approved, capability-valid Facebook rendition ready for publication.

# 9. Stage 1B-D — Facebook Publishing, Scheduling and Reconciliation

## Objective

Implement durable Facebook Page publishing with provider receipts, retries and verified final state.

## Scope

- Extend the canonical distribution state machine for Facebook.
- Persist publication jobs before external calls.
- Add idempotency keys, leases, retry caps and dead-letter or exception handling.
- Implement supported Facebook Page feed, image, video and Reel publication adapters.
- Support scheduling through Cockpit while respecting Meta capability constraints.
- Persist provider request metadata, response IDs and publication receipts.
- Reconcile accepted jobs to final Facebook publication state.
- Handle asynchronous video processing.
- Support safe retry, cancel where possible and operator recovery.
- Add publication status UI and error actions.

## Required outputs

- Facebook publication adapter
- Durable job and attempt model
- Receipt and reconciliation service
- Scheduling integration
- Recovery UI
- Provider-neutral tests and Meta contract tests
- Documentation

## Tests

- Successful publication
- Duplicate request
- Provider timeout
- Rate limit
- Permission loss
- Video processing delay
- Failed processing
- Retry cap
- Reconciliation mismatch
- Cross-client destination spoofing

## Acceptance criteria

- A publication is not marked published until verified.
- Duplicate execution cannot create duplicate posts under normal recoverable conditions.
- Every attempt and provider response is traceable.
- Failures expose safe recovery actions.
- Existing Instagram publication continues to work.

## Exit gate

Approved Facebook renditions can be scheduled, published, reconciled and recovered through the canonical distribution system.

# 10. Stage 1B-E — Facebook Analytics and Platform Experiments

## Objective

Capture Facebook-specific performance and support controlled Facebook-versus-Instagram experiments.

## Scope

- Add Facebook publication identity and metric ingestion.
- Normalise metrics without erasing platform-specific definitions.
- Track reach, impressions, plays or views, engagement, clicks and qualified downstream outcomes where available.
- Record metric source, retrieval window and freshness.
- Add Facebook performance UI and platform comparison.
- Implement platform experiments linked to Avatar, segment, content, format and commercial objective.
- Prevent vanity metrics from being presented as commercial proof.
- Feed controlled findings into analytics and iteration without silently rewriting authority.

## Required outputs

- Facebook metric adapters
- Performance snapshots
- Comparison UI
- Platform experiment entities and workflow
- Analytics integration
- Controlled learning proposals
- Tests and documentation

## Tests

- Metric ingestion and refresh
- Metric definition differences
- Missing or delayed metrics
- Duplicate snapshots
- Publication ownership
- Experiment assignment
- Qualified-outcome comparison
- No false causal claim

## Acceptance criteria

- Facebook and Instagram metrics remain distinguishable.
- Publication performance is linked to canonical content lineage.
- Experiments compare defined outcomes and retain uncertainty.
- Platform recommendations are proposals, not silent strategy mutations.
- Performance refresh is idempotent and observable.

## Exit gate

Cockpit can measure Facebook independently and run evidence-producing platform experiments required by Phase 2-A.

# 11. Stage 1B-F — End-to-End Hardening and Rollout

## Objective

Prove the complete Facebook workflow, retire temporary compatibility paths and establish the Phase 2-A platform foundation.

## Scope

- Exercise destination onboarding through performance refresh.
- Validate mobile, empty, loading, error, retry and permission states.
- Run security, RLS, secret and project-reference checks.
- Verify migration ordering and safe backfill.
- Verify Meta webhook or polling reconciliation as implemented.
- Verify no unsupported surface is exposed as operational.
- Produce operator runbooks for connection, reconnect, publishing failure and token loss.
- Perform authorised live verification against a safe Facebook Page.
- Remove proven-dead temporary paths only after replacement verification.
- Update architecture, data dictionary and implementation records.

## Required golden paths

1. Connect a Facebook Page and verify capabilities.
2. Create a Facebook rendition from a canonical Content Item.
3. Approve and schedule it.
4. Publish and reconcile the provider receipt.
5. Refresh Facebook metrics.
6. Compare a Facebook and Instagram experiment.
7. Recover from permission loss and a retryable publishing failure.

## Required outputs

- End-to-end verification evidence
- Live verification record
- Security and migration report
- Operations runbook
- Final Phase 1-B implementation report
- Phase 2-A readiness statement

## Tests

- Full deterministic suite
- Database and RLS suite
- Provider contract suite
- UI workflow suite
- Failure and recovery suite
- Existing Instagram and core Cockpit regression suite

## Acceptance criteria

- Every golden path passes.
- Production state is observable and recoverable.
- Facebook and Instagram are independent first-class destinations.
- No secret, token or client data leaks.
- No unsupported API behaviour is claimed.
- The complete repository typecheck, lint, test and build gates pass.
- Phase 2-A can evaluate and experiment across Facebook and Instagram.

## Exit gate

Build Phase 1-B is complete and the repository is ready for Build Phase 2-A.
