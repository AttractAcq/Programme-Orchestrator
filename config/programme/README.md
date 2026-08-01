# Programme Authority Files

This directory is intentionally scaffolded but incomplete. Add the approved Cockpit build plans and stage prompts here before expanding `config/build-sequence.example.json` into the production manifest.

Expected structure:

```text
phase-1/
  build-plan.md
  prompts/stage-a.md ... stage-p.md
phase-1b/
  facebook-build-plan.md
  prompts/
phase-2a/
  market-intelligence-build-plan.md
  prompts/stage-2a-a.md ... stage-2a-g.md
phase-2b/
  ai-automation-build-plan.md
  prompts/stage-ai-a.md ... stage-ai-n.md
```

The orchestrator refuses to validate a manifest when a referenced prompt is missing.
