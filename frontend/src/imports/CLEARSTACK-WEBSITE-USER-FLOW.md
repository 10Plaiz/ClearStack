# ClearStack Website User Flow

**important: The user will navigate the website. No code generation, only suggestions.**
**important: There is no Login/Register page.**

## 1. Website User Flow

### Step 1: Start a Setup Session

The user chooses whether they are starting from scratch or reviewing an existing project.

Options:

- "I am starting a new project"
- "I already have a project or repository"

### Step 2: Gather Project Context

The website asks structured questions such as:

- What are you building?
  - website
  - web app
  - mobile app
  - desktop app
  - API/backend service
  - AI tool
  - data dashboard
  - proposal only
  - prototype or MVP
- What stage are you in?
  - ideation
  - proposal writing
  - planning
  - prototype
  - MVP development
  - testing
  - documentation
  - maintenance
- What is your experience level?
  - beginner
  - intermediate
  - experienced
- What AI tools are you using or planning to use?
  - ChatGPT
  - Claude
  - Codex
  - Cursor
  - GitHub Copilot
  - other tools
  - not sure yet
- What stack or tools do you already know?
  - HTML/CSS/JavaScript
  - React
  - Vue
  - Python
  - Node.js
  - PHP
  - Supabase/Firebase
  - SQL
  - no stack selected yet
- What do you want the AI to help with?
  - brainstorming
  - proposal writing
  - UI design
  - coding
  - debugging
  - testing
  - documentation
  - deployment
- What should the AI avoid?
  - changing unrelated files
  - adding unnecessary features
  - using unfamiliar frameworks
  - making assumptions
  - skipping tests
  - exposing secrets
  - pushing to protected branches without permission
- What learning support do you need?
  - explain generated code
  - break features into small steps
  - identify what to learn first
  - review code before adding more features
  - help debug without giving the full answer immediately
- Does your team need decision tracking?
  - yes
  - no
  - not sure
- Does your team need progress handoff documentation?
  - yes
  - no
  - not sure

### Step 3: Lightweight Public Repository Review

If the user already has a public GitHub repository, the user can provide a repository URL.

For a 24-hour hackathon MVP, the system should inspect high-level repository information only, such as:

- folder structure
- README presence
- documentation files
- existing AI instruction files
- project guide files
- decision logs
- issue templates
- testing or build scripts
- signs of excessive or duplicated instructions

This is feasible if implemented as a shallow public repository review using the GitHub API or public repository contents. The MVP should not promise deep code auditing, private repository access, automatic fixes, or pull request creation.

### Step 4: Generate a Clear AI Setup

The system produces a project-specific setup package such as:

- recommended AI usage rules
- minimal project information file
- decision log template
- progress handoff checklist
- suggested documentation files
- guardrails for the user's current stage
- learning checkpoints
- warnings about unnecessary setup
- recommended next actions

Example outputs:

- `PROJECT_CONTEXT.md`
- `AI_WORKFLOW.md`
- `DECISIONS.md`
- `PROGRESS_HANDOFF.md`
- `README.md` recommendations
- tool-specific instruction snippets, if applicable

### Step 5: Explain the Setup

The website should explain each recommendation in beginner-friendly language.

Example:

> "A decision log is useful because future teammates and AI tools need to know why important choices were made. Without it, the project may drift or repeat old debates."

Example:

> "You do not need a large production deployment checklist yet because your project is still in proposal stage. Adding it now may distract the AI from the current goal."

### Step 6: Project-Aware Chat

After the setup is generated, the user can ask questions in a chatbot panel.

The chatbot should answer based on the user's project details and generated guardrails.

Example questions:

- "Do I need a decision log for this project?"
- "Is this prompt too broad?"
- "What should I tell my AI tool before coding?"
- "Which files should I create first?"
- "Is this GitHub skill useful for my MVP?"
- "What should I remove from my AI instructions?"
- "Can you explain why this setup file is useful?"
- "Should I build this feature now or later?"

The chatbot should not behave like a fully autonomous coding agent or general coding chatbot in the MVP. It should primarily act as a guide, reviewer, and explainer for setup, project structure, documentation, scope, and AI usage decisions. It may explain code-related risks or learning checkpoints, but code generation should not be the main feature.

## 2. Assistant Direction

The best MVP direction is a guided chatbot with a structured setup workflow.

### Why Not a Full Coding Agent First

A full coding agent would imply that the system can inspect repositories deeply, edit files, create pull requests, install tools, and enforce rules automatically. That is powerful but too broad for a proposal-stage hackathon idea. It also introduces security, permissions, privacy, and implementation complexity.

### Better MVP Direction

The system should be described as an assistant that:

- asks structured onboarding questions
- analyzes the user's answers
- optionally reviews public repository structure
- generates setup recommendations
- explains risks and tradeoffs
- answers follow-up questions from the user's project details
- encourages incremental learning instead of blind code generation

This is chatbot-like from the user's perspective, but it does more than answer random questions. It follows a bounded workflow: gather project details, check fit, generate guardrails, and recommend next steps.

Best wording:

> ClearStack is a guided AI assistant for project setup and safety checks, not a fully autonomous coding agent.
