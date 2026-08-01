# Security Model

- Bind the API to `127.0.0.1` unless remote access is explicitly required.
- Set `ORCHESTRATOR_API_TOKEN` before exposing the API beyond localhost.
- Keep the Codex CLI authenticated only on the trusted execution host.
- Do not mount SSH keys or GitHub tokens into containers unless branch push is required.
- `auto_push` is disabled by default and the orchestrator never merges a stage branch to `main`.
- The target repository must be clean before a stage begins.
- Prompts may not escape the configured manifest directory.
- Web, document and repository content should be treated as untrusted instructions inside stage prompts.
