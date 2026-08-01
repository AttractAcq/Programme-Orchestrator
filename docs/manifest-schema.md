# Build Sequence Manifest

`config/BUILD_SEQUENCE.json` is the production machine-readable authority. `config/build-sequence.example.json` contains the same complete dependency graph with the mock provider and verifier-agent execution disabled.

## Core fields

- `programme.target_repository` identifies the repository being changed.
- `programme.baseline_commit` records the approved starting baseline.
- `phases[].build_plan_path` references the governing phase plan.
- `phases[].authority_paths` references additional governing documents.
- `phases[].depends_on` enforces whole-phase prerequisites.
- `phases[].stages[]` defines globally unique executable stages.
- `stages[].depends_on` forms the stage DAG inside and across phases.
- `stages[].prompt_path` is the standalone prompt passed to the coding agent.
- `requires_human_approval` pauses after verification and commit.
- `integration_branch` is the cumulative approved branch.
- `auto_push` and `push_integration_branch` are disabled by default.

Every referenced plan, authority document and prompt is resolved relative to the manifest directory and may not escape it.

## Complete graph

The production manifest contains 43 stages:

- Phase 1: 16
- Phase 1-B: 6
- Phase 2-A: 7
- Phase 2-B: 14

Each phase depends on completion of the preceding phase. Each stage also depends on the immediately preceding stage in its own phase.
