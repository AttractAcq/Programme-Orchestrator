# Programme Authority Import Report

## Result

The Cockpit Programme Orchestrator now contains the complete executable build sequence.

## Sequence

- Phase 1: Stages A–P — 16 stages
- Phase 1-B: Stages 1B-A–1B-F — 6 stages
- Phase 2-A: Stages 2A-A–2A-G — 7 stages
- Phase 2-B: Stages AI-A–AI-N — 14 stages
- Total: 43 stages

## Imported approved authorities

The following documents were imported byte-for-byte and their SHA-256 hashes were verified against the supplied source files:

- Phase 1 build plan
- Phase 1 rendered prompt collection
- High-level Cockpit audit
- Phase 2-A Market Intelligence build plan
- Phase 2-B AI build plan

The source and imported hashes are recorded under `config/programme/SOURCE_HASHES.json`.

## Generated executable authority

- Phase 1 A–P prompts were extracted from the approved rendered prompt collection.
- Phase 1-B was formalised as six Facebook-specific stages using the approved scope: Facebook Page destinations, platform renditions, publishing, reconciliation, analytics, experiments and rollout.
- Phase 2-A standalone prompts reproduce the exact authoritative stage sections from the approved Market Intelligence plan.
- Phase 2-B standalone prompts reproduce the exact authoritative stage sections from the approved AI build plan.
- Generated prompts add execution, safety, verification and final-report framing without replacing the governing stage requirements.

## Manifest

`config/BUILD_SEQUENCE.json` is the production authority.

- Target repository: `AttractAcq/Cockpit`
- Baseline commit: `7d4c1b9`
- Integration branch: `programme/cockpit-complete-build`
- Builder provider: `codex-exec`
- Independent verifier: enabled
- Human approval: required for every stage
- Automatic remote push: disabled

`config/build-sequence.example.json` contains the same 43-stage graph in safe mock mode.

## Validation

- Manifest: valid
- Phase count: 4
- Stage count: 43
- Authority files checked: 54
- Backend tests: 14/14 passed
- Production CLI validation: passed
- Stage A dry-run: passed
- Git diff checks: passed
