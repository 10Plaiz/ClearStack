# DECISIONS.md

Log only public-safe decisions that affect future work for ClearStack.

Add an entry only if it changes product scope, concept direction, target users, public naming, MVP boundaries, or a standing project constraint.

Do not log brainstorming, temporary ideas, routine file creation, private team strategy, judging notes, internal workflow details, credentials, personal details, or observations that do not change later work.

## Entry Template

## YYYY-MM-DD

Decision:
Why:
Impact:
Status: active

## 2026-05-11

Decision: Use the AI development guardrails concept as the active proposal direction, targeting hackathon teams, student developers, beginner builders, and users without an existing AI setup.
Why: This keeps the concept broader than programming students only while preserving a clear user group that benefits from clear AI project instructions, setup guardrails, and lightweight documentation discipline.
Impact: Future proposal drafting should frame the solution as an AI setup and guardrail assistant for builders, not as a generic prompt generator, generic coding tutor, or fully autonomous coding agent.
Status: active

Decision: Include lightweight public GitHub repository review in the MVP scope, but exclude private repository access, deep code auditing, automatic file edits, and pull request creation.
Why: Public repository structure review is feasible in a 24-hour hackathon if limited to visible files, documentation signals, and AI setup indicators; deeper automation would introduce scope, privacy, and security risks.
Impact: Mockups and feature descriptions should include a public repository URL input and repository setup review results, but should not promise full repo remediation.
Status: active

Decision: Use ClearStack as the project name.
Why: ClearStack communicates a clearer, less cluttered development setup while still sounding relevant to software builders and tool stacks.
Impact: Future proposal drafts, mockups, and concept summaries should refer to the product as ClearStack.
Status: active

Decision: Use "Project Handoff" as the user-facing name for continuity guidance.
Why: Project Handoff communicates continuity between teammates and future AI sessions in a clear, easy-to-remember way.
Impact: ClearStack materials should use Project Handoff for user-facing templates while preserving the underlying purpose of recording what changed, what is stable, and what comes next.
Status: active

Decision: Keep backend architecture and deployment details in the private teammate bundle until the Supabase Edge Function implementation is finalized.
Why: The public repository should stay free of security-sensitive infrastructure details while the backend is still being designed.
Impact: Public docs should remain high-level; private handoff notes should carry the working backend plan for Supabase, Edge Functions, and Vertex AI.
Status: active

Decision: Use Supabase Auth now for login in the MVP.
Why: Signed-in users give the project a stable owner for setup data and make row-level access control and future session recovery much simpler than anonymous-only cache storage.
Impact: Future implementation should assume an authenticated user owns each setup record, even if the backend storage is still being designed.
Status: active

Decision: Use email/password login with code-based email verification in the MVP, and do not add Google or other OAuth providers.
Why: This keeps the auth flow simple for the first release while still giving the team a secure, familiar login path without adding provider complexity.
Impact: Auth implementation should focus on standard email/password sign-up and login with verification code flow, not social login buttons.
Status: active

Decision: Make Generate the point where the current setup snapshot is saved and the dashboard opens from persisted data.
Why: This turns generation into a clear handoff step, avoids depending on cache as the source of truth, and gives the backend a single place to finalize the session before any AI processing.
Impact: The frontend should treat Generate as a save-and-lock action, and the backend should read the persisted setup snapshot instead of reconstructing state from client memory.
Status: active
