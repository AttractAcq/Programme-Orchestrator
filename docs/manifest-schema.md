# Build Sequence Manifest

`config/build-sequence.example.json` is the machine-readable authority for stage order and execution policy.

- `programme.target_repository` selects the repository being changed.
- `phases[].stages[]` define globally unique stage IDs.
- `depends_on` forms a directed acyclic graph.
- `prompt_path` is resolved relative to the manifest directory and may not escape it.
- Default verification commands apply to every stage.
- Stage-specific verification commands are appended.
- `requires_human_approval` pauses a verified stage before completion.
- `integration_branch` is the cumulative branch used as the base for every stage.
- `auto_push` and `push_integration_branch` are disabled by default.

The shipped example uses placeholders. Add the canonical programme plans and prompts before real execution.
