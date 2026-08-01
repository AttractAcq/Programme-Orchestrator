# Phase 2-A Market Intelligence Build Plan

**Product:** Attract Acquisition Cockpit  
**Programme:** Build Phase 2-A — Market Intelligence and Audience Operating System  
**Internal stages:** 2A-A through 2A-G  
**Prerequisites:** Build Phase 1 and Build Phase 1-B  
**Successor programme:** Build Phase 2-B — AI Control Plane, Client Agents and Fulfilment Automation  
**Primary client surface:** Client Market Intelligence area  
**Primary global surface:** Cockpit Market Intelligence Portfolio view

---

# 1. Programme Position

The complete Cockpit build sequence is:

```text
BUILD PHASE 1
Core Cockpit completion
Programme Stages A–P

        ↓

BUILD PHASE 1-B
Facebook distribution and Facebook-specific platform support

        ↓

BUILD PHASE 2-A
Market Intelligence and Audience Operating System
Internal Stages 2A-A through 2A-G

        ↓

BUILD PHASE 2-B
AI Control Plane, Client Agents, RAG, Workflow Orchestration,
Scheduled Automation and Progressive Autonomy
```

Build Phase 2-A is not the general AI automation layer.

Its purpose is to create the client-specific intelligence that the later AI and automation layer will retrieve, maintain and act upon.

The distinction is:

```text
Build Phase 2-A
Creates and maintains market intelligence

Build Phase 2-B
Retrieves, reasons over and operationally acts on that intelligence
```

---

# 2. Strategic Objective

Cockpit will no longer generate content only from internal business context, proof and general Ideation.

It will:

- Understand the buyer in extreme but evidence-controlled detail.
- Identify the complete buying committee, not only one simplistic persona.
- Quantify the total, serviceable, obtainable and media-reachable market.
- Observe direct, indirect, substitute and attention competitors.
- Map the associations that shape trust, status, quality and rejection.
- Determine which platforms and formats should be tested for each Avatar.
- Use that intelligence before creating positioning, Ideas, Content Opportunities, Ads and Calendar recommendations.
- Learn from market and performance data over time.

The target intelligence flow is:

```text
Approved Client Context
        ↓
Avatar OS
Market OS
Competitor OS
Association Intelligence
Platform Intelligence
        ↓
Client Market Intelligence Synthesis
        ↓
Positioning Implications
Offer Implications
Proof Requirements
Content Opportunities
Ad Opportunities
Calendar Requirements
Platform and Format Recommendations
        ↓
Performance and Commercial Signals
        ↓
Intelligence Refresh and Learning
```

---

# 3. Programme Principles

## 3.1 Intelligence must be evidence controlled

Detailed output is not useful if it is fictional.

Every material claim must be labelled as one of:

```text
verified
strongly_inferred
weakly_inferred
modelled
unknown
not_commercially_relevant
```

Every record must preserve:

- Source
- Source date
- Research method
- Evidence excerpt or structured evidence
- Confidence
- Researcher or model
- Approval state
- Version
- Supersession history

## 3.2 Fine detail must serve commercial decisions

Avatar OS may investigate highly specific details, including:

- Household composition
- Daily routine
- Shopping behaviour
- Vehicles
- Sports and cultural identity
- Media consumption
- Family roles
- Social status
- Community involvement
- Food, travel and leisure preferences

However, the system must distinguish between:

```text
Commercially relevant detail
Detail useful for relatability or creative direction
Weak cultural hypothesis
Unsupported decoration
```

Cockpit must not create a highly detailed fictional character merely because a prompt requested 150 answers.

## 3.3 The buying system matters more than a single Avatar

Each client may have:

- Primary buyer
- Secondary decision-maker
- Economic buyer
- Researcher
- End user
- Influencer
- Gatekeeper
- Referrer
- Financial approver

The system must model the relationship between these roles.

## 3.4 Market sizing must expose assumptions

TAM, SAM and SOM must never be presented as exact facts when they are calculated or modelled.

Every market number must include:

- Formula
- Inputs
- Source
- Geography
- Time period
- Assumptions
- Confidence
- Sensitivity range
- Last refresh date

## 3.5 Competitor observation is not competitor copying

The purpose is:

```text
Understand existing demand
→ identify what currently resonates
→ identify category conventions and weak points
→ create a stronger angle using better proof, positioning and execution
```

The system must not reproduce protected creative work, impersonate competitors or copy their materials.

## 3.6 Platform choice must remain testable

Cockpit must not permanently assume Instagram is correct.

Build Phase 1-B establishes Facebook as a first-class distribution destination.

Build Phase 2-A then evaluates:

- Facebook
- Instagram
- Platform-specific formats
- Platform-specific Avatars
- Reachability
- Commercial outcomes
- Competitor behaviour
- Organic and paid opportunities

The output should be a testable platform strategy, not an unsupported platform preference.

## 3.7 Intelligence is a source of truth, not only a report

Avatar, Market, Competitor, Association and Platform data must be stored as structured, versioned entities.

Human-readable reports are renderings of those entities.

Downstream systems must consume the structured records rather than repeatedly parsing prose.

---

# 4. Required Cockpit Surfaces

## 4.1 Client Market Intelligence area

Add a client-specific Market Intelligence area with these sections:

```text
Market Intelligence
├── Overview
├── Avatar OS
├── Market OS
├── Competitor OS
├── Associations
├── Platforms
├── Strategic Implications
└── Research History
```

This area is the structured source of truth for the selected client.

It must support:

- Research runs
- Review
- Editing
- Approval
- Version history
- Evidence inspection
- Confidence inspection
- Refresh
- Supersession
- Downstream-consumer visibility

## 4.2 Global Market Intelligence Portfolio view

Add a Cockpit-level administrative view for all clients.

It must show:

- Intelligence completeness by client
- Intelligence freshness
- Research currently running
- Failed research
- Avatars awaiting approval
- Market models awaiting approval
- Competitor sets awaiting approval
- Stale competitor monitoring
- Missing platform recommendations
- Clients without evidence-backed market intelligence
- Research cost and provider usage
- Cross-client intelligence health

The global view is operational and structured.

The conversational multi-client AI Console is introduced later in Build Phase 2-B.

## 4.3 Integration with existing client systems

Market Intelligence must connect to:

- Phase 1 Context
- Phase 2 Execution
- Proof Vault
- Manual Ideas
- Research Ideation
- Content Opportunities
- Content Items
- Content Briefs
- Ads
- Facebook distribution
- Instagram distribution
- Analytics
- Performance and Iteration

---

# 5. Canonical Data Architecture

## 5.1 Shared research entities

```text
market_intelligence_runs
market_intelligence_sources
market_intelligence_evidence
market_intelligence_findings
market_intelligence_approvals
market_intelligence_versions
market_intelligence_refresh_schedules
```

## 5.2 Avatar entities

```text
client_avatars
avatar_buying_roles
avatar_relationships
avatar_attributes
avatar_questions
avatar_question_versions
avatar_answers
avatar_behaviours
avatar_fears
avatar_desires
avatar_objections
avatar_triggers
avatar_language_patterns
avatar_media_patterns
avatar_commercial_profiles
avatar_evidence_links
```

## 5.3 Market entities

```text
client_markets
market_geographies
market_segments
market_size_models
market_size_inputs
market_size_outputs
market_assumptions
market_sensitivity_cases
market_seasonality
market_capacity_constraints
market_evidence_links
```

## 5.4 Competitor entities

```text
client_competitors
competitor_categories
competitor_profiles
competitor_web_properties
competitor_social_accounts
competitor_content_observations
competitor_offer_observations
competitor_ad_observations
competitor_landing_page_observations
competitor_brand_observations
competitor_positioning_observations
competitor_performance_signals
competitive_gaps
competitor_monitoring_runs
competitor_evidence_links
```

## 5.5 Association entities

```text
avatar_associations
association_categories
association_evidence
association_brand_applications
association_content_applications
association_visual_applications
association_language_applications
association_risks
```

## 5.6 Platform entities

```text
client_platform_strategies
avatar_platform_affinities
platform_format_recommendations
platform_rendition_rules
platform_experiments
platform_experiment_variants
platform_experiment_results
platform_decisions
```

## 5.7 Synthesis entities

```text
client_market_intelligence_summaries
market_intelligence_implications
market_intelligence_opportunity_inputs
market_intelligence_execution_recommendations
market_intelligence_change_proposals
```

## 5.8 Ownership and security

Every client-specific record must include `client_id`.

Required controls:

- RLS
- Composite ownership checks
- Cross-client source rejection
- Service-role-only research mutations where appropriate
- Explicit grants
- Safe `search_path`
- Version immutability after approval
- Controlled supersession
- Full audit events
- No cross-client research-result leakage

---

# 6. Shared State Model

Research and intelligence outputs should use a consistent lifecycle.

```text
draft
→ collecting
→ processing
→ needs_review
→ approved
→ active
→ stale
→ superseded
→ archived
```

Failure states:

```text
failed_retryable
failed_terminal
blocked_missing_source
blocked_missing_context
blocked_permission
```

An approved version must not be silently edited.

A material change creates a new version or a controlled amendment proposal.

---

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

# 14. Phase 2-A Golden Paths

## Golden Path 1 — Full market-intelligence build

```text
Approved Client Context
→ run Avatar OS
→ approve Avatars
→ run Market OS
→ approve market model
→ discover and approve competitors
→ run Association Intelligence
→ evaluate Facebook and Instagram
→ create synthesis
→ approve synthesis
```

## Golden Path 2 — Primary and secondary decision-makers

```text
Primary Avatar identified
→ secondary buyer identified
→ spend threshold modelled
→ distinct fears and proof preferences recorded
→ one Content Opportunity addresses both roles
```

## Golden Path 3 — Competitive gap content

```text
Competitor monitoring
→ weak proof pattern identified
→ gap approved
→ proof-backed Content Opportunity created
→ Content Item created
→ Facebook and Instagram renditions produced
```

## Golden Path 4 — Market sizing

```text
Define geography and service
→ collect source inputs
→ calculate TAM
→ constrain to SAM
→ apply capacity and realistic share to SOM
→ calculate targetable media market
→ approve priority segment
```

## Golden Path 5 — Association-led brand content

```text
Positive trust association identified
→ negative category stereotype identified
→ Association Opportunity created
→ Brief specifies visual and language treatment
→ final content demonstrates the intended association
```

## Golden Path 6 — Platform experiment

```text
Avatar and competitor evidence suggests Facebook
→ Instagram remains plausible
→ experiment created
→ platform-specific renditions published
→ qualified outcomes collected
→ platform recommendation updated through review
```

## Golden Path 7 — Performance learning

```text
Content performs materially above baseline
→ relevant Avatar, segment, association and platform factors identified
→ change proposal created
→ operator reviews
→ approved intelligence version updated
→ future Opportunities use the learning
```

---

# 15. Testing Requirements

## 15.1 Database

Test:

- RLS
- Client isolation
- Composite ownership
- Version immutability
- Supersession
- Approval
- Evidence links
- Confidence constraints
- Idempotency
- Unique active versions
- Cross-client rejection

## 15.2 Research

Test:

- Provider failure
- Partial evidence
- Contradictory evidence
- Missing source
- Duplicate source
- Stale source
- Retry
- Resume
- Cancellation
- Cost limits
- Unsupported verification

## 15.3 Avatar OS

Test:

- Primary, secondary and tertiary Avatars
- Multiple roles
- Threshold-based authority
- Unknown answers
- Weak inference
- Evidence approval
- Question-version changes

## 15.4 Market OS

Test:

- Top-down model
- Bottom-up model
- Sensitivity
- Missing inputs
- Capacity constraint
- Range
- Modelled versus observed labelling

## 15.5 Competitor OS

Test:

- Discovery
- Manual addition
- Duplicate competitor
- Category assignment
- Monitoring
- Website change
- Social observation
- Ad observation
- No false commercial-success claim

## 15.6 Association Intelligence

Test:

- Avatar-specific mapping
- Positive and negative associations
- Evidence
- Risk
- Sensitive profiling controls
- Brand and content applications

## 15.7 Platform Intelligence

Test:

- Facebook and Instagram separation
- Platform rendition rules
- Experiment creation
- Metrics
- Decision update
- Missing data

## 15.8 Integration

Test:

- Market Intelligence to Opportunity
- Opportunity to Brief
- Brief to platform rendition
- Distribution to analytics
- Performance to change proposal
- Approval to new intelligence version

---

# 16. Security and Ethical Controls

## 16.1 Sensitive attributes

Do not use protected or sensitive characteristics to discriminate unlawfully or unfairly.

Where demographic or cultural data is used:

- Record the commercial reason.
- Avoid stereotypes.
- Require evidence.
- Require review where sensitive.
- Preserve unknowns.
- Allow deletion and correction.

## 16.2 Public data

Competitor and market research must respect:

- Platform terms
- Applicable laws
- Rate limits
- Copyright
- Privacy
- Data minimisation
- Permitted use

## 16.3 Proof and customer data

Do not expose private customer Proof in external research.

Use:

- Consent
- Redaction
- Anonymisation
- Publication permissions
- Role-based access

## 16.4 Research injection

Treat web pages, competitor content and uploaded documents as untrusted data.

Research agents must not follow embedded instructions from source material.

---

# 17. Success Metrics

## Intelligence completeness

- Percentage of clients with approved Avatar OS
- Percentage with approved Market OS
- Percentage with approved Competitor OS
- Percentage with approved Association Strategy
- Percentage with approved Platform Strategy

## Intelligence quality

- Evidence coverage
- Verified versus inferred distribution
- Unknown-field visibility
- Contradiction rate
- Approval revision rate
- Research freshness

## Operational impact

- Percentage of Opportunities linked to approved Avatars
- Percentage linked to market segments
- Percentage linked to competitive gaps
- Percentage linked to association strategy
- Percentage with platform-specific renditions

## Commercial learning

- Qualified outcome by Avatar
- Qualified outcome by segment
- Qualified outcome by platform
- Qualified outcome by proof type
- Qualified outcome by competitive angle
- Qualified outcome by association strategy

## Efficiency

- Research cost per client
- Refresh cost
- Time to approval
- Monitoring failure rate
- Manual research hours saved

---

# 18. Phase 2-A Completion Criteria

Build Phase 2-A is complete when:

1. The shared research foundation is operational.
2. Avatar OS models primary, secondary and tertiary buying roles.
3. Approximately 150 versioned research questions are supported.
4. Every material Avatar finding has evidence, confidence or unknown status.
5. Market OS produces transparent TAM, SAM, SOM and targetable media market.
6. Competitor OS maps and monitors the complete competitive landscape.
7. Competitor observations distinguish visibility from commercial proof.
8. Association Intelligence affects Brand and content decisions.
9. Facebook and Instagram are evaluated independently.
10. Platform-specific renditions and experiments are supported.
11. One approved Client Market Intelligence Synthesis exists.
12. Intelligence enriches Content Opportunities.
13. Intelligence affects Opportunity scoring.
14. Intelligence reaches Content Briefs and Ads.
15. Performance can propose intelligence updates.
16. Refresh schedules are operational.
17. Global Market Intelligence controls are operational.
18. Phase 2-B command boundaries are exposed.
19. All client isolation, RLS, evidence, approval and version tests pass.
20. No downstream system needs to parse unstructured reports as its primary contract.

---

# 19. Handoff to Build Phase 2-B

Build Phase 2-B may begin only after Phase 2-A is complete.

The original Phase 2 AI build plan remains the authority for Phase 2-B:

```text
docs/programme/phase_2_ai_build_plan.md
```

Phase 2-B will add:

- Client Knowledge Fabric and RAG across all approved Cockpit data
- Client Agent runtime
- Canonical AI command execution
- Durable workflow orchestration
- Client Automation tab
- Global Admin AI Console
- Cron and condition-based automation
- Progressive autonomy
- Multi-client cost and capacity controls

Phase 2-A must therefore leave:

- Structured approved intelligence
- Versioned records
- Reliable evidence
- Searchable source links
- Explicit command boundaries
- Observable refresh workflows
- Stable downstream contracts

The final programme sequence is:

```text
Phase 1 — Core Cockpit Stages A–P
        ↓
Phase 1-B — Facebook Distribution
        ↓
Phase 2-A — Market Intelligence Stages 2A-A through 2A-G
        ↓
Phase 2-B — AI Control Plane and Fulfilment Automation
```

The strategic result is:

> Cockpit understands who the client should target, how large and reachable that market is, how competitors currently capture demand, which associations shape trust, and which platforms and formats should be used before it decides what content to create or automate.
