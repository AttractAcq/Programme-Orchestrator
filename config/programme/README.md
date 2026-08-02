# Cockpit Programme Authority

This directory contains the complete versioned authority used by the Cockpit Programme Orchestrator.

## Build sequence

```text
Phase 1 — Core Cockpit, A–P
→ Phase 1-B — Facebook Distribution, 1B-A–1B-F
→ Phase 2-A — Market Intelligence, 2A-A–2A-G
→ Phase 2-B — AI Control Plane and Automation, AI-A–AI-N
```

The production graph is `../BUILD_SEQUENCE.json`. All 43 stages are sequentially dependency-gated and require human approval by default.

## Authority layout

- `phase-1/build-plan.md` — approved core A–P build plan.
- `phase-1/architecture-audit.md` — approved high-level Cockpit audit.
- `phase-1/prompt-collection.md` — approved rendered A–P prompt collection preserved as source.
- `phase-1/prompts/` — standalone A–P prompts extracted from the approved collection.
- `phase-1b/facebook-build-plan.md` — formal Facebook distribution programme derived from the agreed Phase 1-B scope.
- `phase-1b/prompts/` — standalone 1B-A–1B-F prompts.
- `phase-2a/market-intelligence-build-plan.md` — approved Market Intelligence plan.
- `phase-2a/prompts/` — standalone 2A-A–2A-G prompts generated from its exact stage sections.
- `phase-2b/ai-automation-build-plan.md` — approved AI and automation plan.
- `phase-2b/prompts/` — standalone AI-A–AI-N prompts generated from its exact stage sections.
- `SOURCE_HASHES.json` — SHA-256 provenance for every authority and prompt file.

## Authority rule

Approved source documents are imported without rewriting. Generated standalone prompts reproduce the authoritative stage section and add only execution, safety, verification and operator-report framing.

The Stage A standalone prompt also carries its explicitly approved frozen
Gates 1–12 verification contract. That finite contract governs Stage A
pre-commit blocker classification without altering the source build plan or any
other stage contract.

The target `AttractAcq/Cockpit` repository remains the authority for current implementation state. These files govern intended future state and execution order.
