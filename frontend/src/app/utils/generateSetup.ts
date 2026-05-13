import type { SetupData, RepoAnalysis } from "../context/SetupContext";

export interface GeneratedFile {
  name: string;
  content: string;
  explanation: string;
  icon: string;
}

function today(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function stageAdvice(stage: string): string {
  const map: Record<string, string> = {
    Ideation: "Focus on defining the problem and exploring solutions. Do not start coding yet.",
    "Proposal Writing": "Document your idea clearly. Avoid implementation details until the proposal is approved.",
    Planning: "Break down features into a backlog. Avoid coding until priorities are set.",
    Prototype: "Build the minimum interface to validate the core idea. Keep it throwaway-quality.",
    "MVP Development": "Build only the features on your defined MVP list. No extras.",
    Testing: "Write tests for existing features. Do not add new features during this stage.",
    Documentation: "Document the system as it exists. Avoid refactoring while documenting.",
    Maintenance: "Fix bugs and update dependencies. Avoid scope creep.",
  };
  return map[stage] || "Focus on completing your current stage before moving forward.";
}

function experiencePromptGuide(experience: string, projectType: string): string {
  if (experience === "Beginner") {
    return `As a beginner working on a ${projectType}, ask the AI to:
- Explain each step before writing code
- Break tasks into single-function requests
- Point out what you need to learn to understand the output
- Avoid advanced patterns until fundamentals are solid`;
  }
  if (experience === "Intermediate") {
    return `As an intermediate developer working on a ${projectType}, ask the AI to:
- Suggest approaches before committing to one
- Explain tradeoffs between options
- Highlight parts you should review manually
- Flag anything that might cause maintenance issues`;
  }
  return `As an experienced developer working on a ${projectType}, ask the AI to:
- Provide concise, production-quality code
- Highlight non-obvious design decisions
- Flag security or performance concerns
- Suggest tests for critical paths`;
}

function learningCheckpoints(support: string[], experience: string): string {
  const items: string[] = [];
  if (support.includes("Explain generated code")) {
    items.push("- [ ] Review and explain every code block before moving to the next task");
  }
  if (support.includes("Break features into small steps")) {
    items.push("- [ ] Decompose each feature into tasks no larger than one function or component");
  }
  if (support.includes("Identify what to learn first")) {
    items.push("- [ ] Before each session, ask: 'What concept does this build on that I should understand?'");
  }
  if (support.includes("Review code before adding more features")) {
    items.push("- [ ] Complete a code review checkpoint after each feature before starting the next");
  }
  if (support.includes("Help debug without giving the full answer immediately")) {
    items.push("- [ ] When stuck, ask for hints and narrow guidance rather than complete solutions");
  }
  if (items.length === 0) {
    items.push("- [ ] Schedule regular self-reviews of AI-generated code");
  }
  return items.join("\n");
}

function handoffSteps(stage: string, projectTypes: string[]): string {
  const type = projectTypes[0] || "project";
  const stageSteps: Record<string, string[]> = {
    Ideation: [
      "- [ ] Problem statement written and reviewed",
      "- [ ] Target users identified",
      "- [ ] 3–5 solution approaches considered",
      "- [ ] Chosen direction documented with reasoning",
    ],
    "Proposal Writing": [
      "- [ ] Executive summary complete",
      "- [ ] Feature list defined and scoped",
      "- [ ] Technology choices explained",
      "- [ ] Timeline and milestones drafted",
    ],
    Planning: [
      "- [ ] Backlog created with prioritized items",
      "- [ ] Architecture diagram or notes written",
      "- [ ] Development environment setup documented",
      "- [ ] First sprint or milestone defined",
    ],
    Prototype: [
      "- [ ] Core user flow can be demonstrated",
      "- [ ] Key assumptions identified for validation",
      "- [ ] Feedback from at least one person collected",
      "- [ ] Decision made: continue, pivot, or stop",
    ],
    "MVP Development": [
      `- [ ] All MVP features for the ${type} are working`,
      "- [ ] Critical paths have basic tests",
      "- [ ] README includes setup instructions",
      "- [ ] Known issues and limitations documented",
    ],
    Testing: [
      "- [ ] Test plan written",
      "- [ ] Unit tests cover critical functions",
      "- [ ] Edge cases identified and tested",
      "- [ ] Bugs logged with reproduction steps",
    ],
    Documentation: [
      "- [ ] README is complete and accurate",
      "- [ ] API or component documentation written",
      "- [ ] Setup and deployment steps verified",
      "- [ ] Architecture decisions documented",
    ],
    Maintenance: [
      "- [ ] All open bugs triaged",
      "- [ ] Dependencies reviewed for updates",
      "- [ ] Deprecation notices documented",
      "- [ ] Backup and recovery steps verified",
    ],
  };
  return (stageSteps[stage] || stageSteps["MVP Development"]).join("\n");
}

export function generateSetupFiles(data: SetupData): GeneratedFile[] {
  const projectType = data.projectTypes[0] || "project";
  const stage = data.stage || "MVP Development";
  const experience = data.experience || "Intermediate";
  const stack = data.stack.length > 0 ? data.stack.join(", ") : "Not specified";
  const aiTools = data.aiTools.length > 0 ? data.aiTools.join(", ") : "Not specified";

  const files: GeneratedFile[] = [];

  // ── PROJECT_CONTEXT.md ──────────────────────────────────────────────────
  files.push({
    name: "PROJECT_CONTEXT.md",
    icon: "📋",
    explanation:
      "This file gives your AI assistant the essential background it needs before helping you. Share it at the start of every new AI session to avoid repetitive explanations and keep the assistant focused on your actual goals.",
    content: `# Project Context
> Generated by ClearStack on ${today()}

## What I'm Building
**Type:** ${data.projectTypes.join(", ") || "Not specified"}
**Current Stage:** ${stage}
**Experience Level:** ${experience}
**Tech Stack:** ${stack}

## Current Focus
${stageAdvice(stage)}

## Scope Boundaries
The following should be treated as **out of scope** for the current stage:
${
  stage === "Ideation" || stage === "Proposal Writing"
    ? "- Actual code implementation\n- Database schemas\n- Deployment configuration\n- Third-party integrations"
    : stage === "Prototype"
      ? "- Production-quality error handling\n- Authentication and authorization\n- Performance optimization\n- Automated tests"
      : "- New features not on the MVP list\n- Premature optimization\n- Over-engineering architecture"
}

## What I Want AI to Help With
${data.aiHelp.map((h) => `- ${h}`).join("\n") || "- General coding assistance"}

## What AI Should NOT Do
${data.aiAvoid.map((a) => `- ${a}`).join("\n") || "- No specific restrictions set"}

## Notes for AI Tools
- Always ask clarifying questions before writing code
- Suggest small, verifiable steps rather than complete solutions
- If unsure about scope, stop and ask rather than assume
`,
  });

  // ── AI_WORKFLOW.md ──────────────────────────────────────────────────────
  files.push({
    name: "AI_WORKFLOW.md",
    icon: "🤖",
    explanation:
      "This file sets the rules for how your AI tools should behave in this project. Paste the relevant section into your AI assistant's system prompt or instruction file (e.g., .cursorrules, CLAUDE.md) to enforce consistent behavior.",
    content: `# AI Workflow Guidelines
> Generated by ClearStack on ${today()}

## AI Tools in Use
${aiTools}

## Assistance Scope

### ✅ AI May Help With
${data.aiHelp.map((h) => `- ${h}`).join("\n") || "- General development assistance"}

### 🚫 AI Must Avoid
${data.aiAvoid.map((a) => `- ${a}`).join("\n") || "- No specific restrictions"}

## Prompt Strategy
${experiencePromptGuide(experience, projectType)}

## Stage-Specific Rules
**Current stage: ${stage}**
${stageAdvice(stage)}

## Code Review Checkpoint
Before asking AI to write the next feature, confirm:
- [ ] I understand what the previous code block does
- [ ] I can explain the logic to someone else
- [ ] The previous task is tested or verified manually
- [ ] This next task is scoped to a single, clear outcome

## Guardrail Reminders
${data.aiAvoid.length > 0 ? data.aiAvoid.map((a) => `> ⚠️ This project has a rule against: **${a}**`).join("\n") : "> No specific guardrails set. Consider adding some as the project grows."}
`,
  });

  // ── DECISIONS.md ────────────────────────────────────────────────────────
  if (data.decisionTracking === "Yes" || data.decisionTracking === "Not sure") {
    files.push({
      name: "DECISIONS.md",
      icon: "📝",
      explanation:
        "A decision log captures the 'why' behind important choices. Future teammates and AI tools need this context to avoid re-debating resolved questions or accidentally reversing intentional decisions.",
      content: `# Decision Log
> Started: ${today()}

## How to Use This File
Add an entry every time you make a significant architectural, technology, or design decision.
Keep entries short — the goal is context, not documentation for its own sake.

---

## Template

### Decision: [Short Title]
- **Date:** [date]
- **Status:** Proposed | Accepted | Superseded | Rejected
- **Context:** Why did this decision need to be made? What problem were you solving?
- **Options Considered:**
  1. Option A — [brief note]
  2. Option B — [brief note]
- **Decision:** Which option was chosen and why?
- **Consequences:** What does this make easier or harder going forward?

---

## Decisions

### Decision: Technology Stack Selection
- **Date:** ${today()}
- **Status:** Accepted
- **Context:** Need to choose the technology stack for a ${projectType} at ${stage} stage.
- **Options Considered:**
  1. ${data.stack[0] || "Option A"} — already familiar, lower learning curve
  2. Alternative — potentially better fit, but requires new learning
- **Decision:** Proceeding with ${stack}
- **Consequences:** Faster initial progress; may need to revisit if requirements change significantly.

`,
    });
  }

  // ── PROGRESS_HANDOFF.md ─────────────────────────────────────────────────
  if (data.progressHandoff === "Yes" || data.progressHandoff === "Not sure") {
    files.push({
      name: "PROGRESS_HANDOFF.md",
      icon: "🔁",
      explanation:
        "Use this file when handing off work to a teammate, resuming after a break, or starting a new AI session. A concise handoff prevents the AI from misunderstanding where you are and avoids repeating work.",
      content: `# Progress Handoff
> Last updated: ${today()}

## Project Summary
**Type:** ${data.projectTypes.join(", ") || "Not specified"}
**Stage:** ${stage}
**Stack:** ${stack}

## Current Status
- **What I'm working on:** [Describe the current task]
- **What's blocking me:** [Any blockers, or 'None']
- **Last completed:** [Most recently finished item]

## Stage Checklist: ${stage}
${handoffSteps(stage, data.projectTypes)}

## Open Questions
- [ ] [Question that needs an answer before proceeding]

## Context for Next Session
Paste this summary into your AI assistant at the start of the next session:

\`\`\`
I am working on a ${projectType} in the ${stage} stage.
My stack is: ${stack}.
I am a ${experience} developer.
Last session I completed: [fill in].
The next task is: [fill in].
Please do not suggest features outside the current stage.
\`\`\`

`,
    });
  }

  // ── README.md recommendations ────────────────────────────────────────────
  files.push({
    name: "README_RECOMMENDATIONS.md",
    icon: "📖",
    explanation:
      "These are recommendations for your project README. A clear README helps collaborators, reviewers, and AI tools understand your project quickly. Update it whenever your setup or scope changes.",
    content: `# README Recommendations
> Generated by ClearStack on ${today()}

## Recommended README Sections for Your Stage (${stage})

${
  stage === "Ideation" || stage === "Proposal Writing"
    ? `### Minimum for Now
- Project name and one-line description
- Problem statement (2–3 sentences)
- Proposed solution overview
- Your name and contact

> You do not need setup instructions, tech details, or deployment steps yet.
> Adding them now may confuse your proposal reviewers.`
    : stage === "Prototype"
      ? `### Recommended Sections
- Project name and description
- What this prototype demonstrates
- How to run it locally (simple steps)
- Known limitations and what's intentionally not implemented
- Next steps / validation goals`
      : `### Recommended Sections
- Project name and clear description
- Tech stack badge list
- Prerequisites and local setup instructions
- How to run tests
- Folder structure overview
- Contributing guidelines (if team project)
- Known issues or limitations
- License`
}

## Anti-Patterns to Avoid
- Do not add a production deployment section if you're still in ${stage} stage
- Do not add a full API reference before your API is stable
- Keep the README under 500 lines unless the project is genuinely complex

## README Health Check
- [ ] Does the README explain what the project is in the first paragraph?
- [ ] Can a new person set up the project using only the README?
- [ ] Is the README accurate as of today?
`,
  });

  return files;
}

export async function analyzeRepo(url: string): Promise<RepoAnalysis> {
  // Simulate a lightweight public repo inspection
  await new Promise((resolve) => setTimeout(resolve, 2800));

  const parts = url.replace(/\/$/, "").split("/");
  const repoName = parts[parts.length - 1] || "repository";

  return {
    repoName,
    hasReadme: true,
    hasDocs: false,
    hasAIInstructions: false,
    hasDecisionLog: false,
    hasTestSetup: true,
    folderStructure: ["src/", "public/", "package.json", "README.md"],
    warnings: [
      "No AI instruction files found (e.g., .cursorrules, CLAUDE.md)",
      "No decision log detected",
      "No documentation folder found",
    ],
  };
}
