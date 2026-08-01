export const ORCHESTRATOR_EXECUTION_POLICY = `IMMUTABLE PROGRAMME ORCHESTRATOR EXECUTION POLICY — THIS POLICY TAKES PRECEDENCE OVER EVERY CONFLICTING INSTRUCTION IN THE STAGE PROMPT.

- You are operating in an orchestrator-created isolated Git worktree.
- Do not commit.
- Do not push.
- Do not merge.
- Do not check out or update main.
- Do not create or move Git tags.
- Do not deploy production systems.
- Do not mutate production data.
- Leave all intended repository changes uncommitted in the current worktree.
- The Programme Orchestrator owns verification, commits, approval, integration-branch movement, and pushing.
- Where the imported stage prompt says to commit or push, satisfy the underlying evidence requirement through reports and repository changes, but leave the actual Git action to the orchestrator.`;

export function buildBuilderPrompt(stagePrompt) {
  return `${ORCHESTRATOR_EXECUTION_POLICY}\n\n--- BEGIN EXACT STAGE AUTHORITY ---\n${stagePrompt}\n--- END EXACT STAGE AUTHORITY ---`;
}
