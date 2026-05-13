import type { SetupData } from "../context/SetupContext";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "Do I need a decision log for this project?",
  "Is this prompt too broad?",
  "What should I tell my AI tool before coding?",
  "Which files should I create first?",
  "What should I remove from my AI instructions?",
  "Should I build this feature now or later?",
  "What is a learning checkpoint?",
  "How do I hand off progress to a teammate?",
];

export function getSuggestions(): string[] {
  return SUGGESTIONS;
}

interface ChatApiResponse {
  reply?: string;
  message?: string;
  content?: string;
  text?: string;
}

interface ChatTransportRequest {
  message: string;
  history: Array<Pick<ChatMessage, "role" | "content">>;
  setup: SetupData;
}

const chatApiUrl = import.meta.env.VITE_CHAT_API_URL?.trim().replace(/\/+$/, "");

function buildChatRequest(message: string, context: SetupData, history: ChatMessage[]): ChatTransportRequest {
  return {
    message: message.trim(),
    history: history.map(({ role, content }) => ({ role, content })),
    setup: context,
  };
}

function extractChatReply(payload: ChatApiResponse): string | null {
  const candidates = [payload.reply, payload.message, payload.content, payload.text];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
}

async function requestRemoteChatResponse(
  message: string,
  context: SetupData,
  history: ChatMessage[]
): Promise<string | null> {
  if (!chatApiUrl) {
    return null;
  }

  try {
    const response = await fetch(chatApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildChatRequest(message, context, history)),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ChatApiResponse;
    return extractChatReply(payload);
  } catch {
    return null;
  }
}

export async function getChatResponse(
  message: string,
  context: SetupData,
  history: ChatMessage[]
): Promise<string> {
  const remoteResponse = await requestRemoteChatResponse(message, context, history);
  if (remoteResponse) {
    return remoteResponse;
  }

  // Simulate network delay
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

  const q = message.toLowerCase();
  const stage = context.stage || "MVP Development";
  const experience = context.experience || "Intermediate";
  const projectType = context.projectTypes[0] || "project";
  const stack = context.stack.join(", ") || "your chosen stack";

  // ── Decision log ──────────────────────────────────────────────────────
  if (q.includes("decision log") || (q.includes("decisions") && (q.includes("file") || q.includes("need") || q.includes("track")))) {
    if (context.decisionTracking === "Yes") {
      return `Based on your setup, you indicated that **your team needs decision tracking**. A \`DECISIONS.md\` template has been included in your setup package.\n\nFor a ${stage} stage ${projectType}, the most important decisions to log are: technology choices, architectural patterns, and anything your team debated before deciding. Even a one-line explanation like "we chose ${context.stack[0] || "React"} because we already know it" prevents future re-debates.\n\nAI tools also benefit from this context — if you paste the relevant entries into a new session, the assistant avoids suggesting alternatives you've already ruled out.`;
    }
    if (context.decisionTracking === "No") {
      return `You indicated you don't need decision tracking right now, which is reasonable for a solo **${experience}-level** ${projectType} in **${stage}** stage.\n\nHowever, consider creating a simple \`DECISIONS.md\` if:\n- The project spans more than two weeks\n- You're using AI tools that might suggest conflicting approaches across sessions\n- You might hand the project to someone else\n\nThe overhead is low — a single-paragraph entry per major decision is enough.`;
    }
    return `A decision log captures the *why* behind important choices — technology picks, architecture patterns, scope changes. It's most valuable when:\n- Working in a team (prevents re-debating resolved questions)\n- Using AI tools across multiple sessions (prevents the AI from suggesting approaches you've already rejected)\n- Returning to the project after a break\n\nFor a **${stage}** stage ${projectType}, I'd recommend at least logging your technology stack choice and any major scope decisions. You don't need a formal process — even brief notes in a \`DECISIONS.md\` file are enough.`;
  }

  // ── Prompt quality ────────────────────────────────────────────────────
  if (q.includes("prompt") || q.includes("too broad") || q.includes("asking ai") || q.includes("tell my ai")) {
    return `A good prompt for your **${projectType}** at **${stage}** stage should include four things:\n\n1. **Context** — "I'm building a ${projectType} using ${stack}."\n2. **Current task** — Be specific about the single thing you want help with.\n3. **What you've tried** — Mention any approaches you've already attempted.\n4. **Expected output** — Describe what a successful response looks like.\n\n**Example for a ${experience} developer:**\n> "I have a ${projectType} in ${stack}. I'm trying to [specific task]. I've already tried [approach]. Please [specific action] and explain each step before writing code."\n\n**Common mistakes:** Asking for entire features at once, leaving out your stack, or not specifying your experience level. These cause the AI to make assumptions that might not match your project.`;
  }

  // ── Files to create first ─────────────────────────────────────────────
  if (q.includes("which files") || q.includes("file first") || q.includes("create first") || q.includes("start with")) {
    const stageFiles: Record<string, string> = {
      Ideation: `For **Ideation** stage, focus on:\n1. \`README.md\` — One paragraph describing the problem and your proposed solution\n2. \`PROJECT_CONTEXT.md\` (from your setup package) — Keeps you and your AI focused\n\nDo **not** create folder structures, configuration files, or database schemas yet. Adding those now signals to your AI that you're ready to code, which can push it toward premature implementation.`,
      "Proposal Writing": `For **Proposal Writing** stage, you need:\n1. \`README.md\` — Project overview, problem, solution summary\n2. \`PROJECT_CONTEXT.md\` — From your setup package\n3. \`DECISIONS.md\` — Log technology choices as you make them\n\nAvoid creating actual code files. Your AI should be helping you write documentation, not implementation.`,
      Prototype: `For **Prototype** stage:\n1. \`PROJECT_CONTEXT.md\` + \`AI_WORKFLOW.md\` — From your setup package, at the root\n2. Your framework's entry point (e.g., \`index.html\`, \`App.tsx\`)\n3. One component or screen at a time\n\nDo not set up a full folder structure yet. Prototypes are meant to be thrown away — organized architecture comes at MVP stage.`,
      "MVP Development": `For **MVP Development** with **${stack}**:\n1. \`PROJECT_CONTEXT.md\` + \`AI_WORKFLOW.md\` at the root\n2. Standard framework structure for ${stack}\n3. \`DECISIONS.md\` for tracking choices\n4. \`PROGRESS_HANDOFF.md\` for session continuity\n\nStart with the data layer or core component, not the UI shell. Build the thing that proves the MVP is possible first.`,
    };
    return stageFiles[stage] || `For your current **${stage}** stage, begin with:\n1. \`PROJECT_CONTEXT.md\` and \`AI_WORKFLOW.md\` from your setup package — place these at your project root\n2. Your framework's standard entry point\n3. Add \`DECISIONS.md\` as you make significant choices\n\nLet your stage guide your file structure. Don't create infrastructure you don't need yet.`;
  }

  // ── What to remove from AI instructions ───────────────────────────────
  if (q.includes("remove") || q.includes("unnecessary") || q.includes("trim") || q.includes("too much")) {
    return `For a **${stage}** stage ${projectType}, you can safely remove or defer:\n\n- **Deployment checklists** — You're not deploying yet\n- **Security audit rules** — Premature for ${stage} stage\n- **Performance optimization guidelines** — Only relevant post-MVP\n- **CI/CD pipeline instructions** — Not needed until you have a stable build\n\n**Keep:**\n- Rules about what the AI should avoid (scope guardrails)\n- Your tech stack and experience level\n- Stage-specific focus (what to build and what NOT to build)\n\nOver-specifying AI instructions can backfire — the assistant may follow rules literally and miss your actual intent. Keep instructions short, specific, and current to your stage.`;
  }

  // ── Feature prioritization ────────────────────────────────────────────
  if (q.includes("build this feature") || q.includes("now or later") || q.includes("priorit") || q.includes("feature")) {
    return `To decide whether to build a feature **now or later**, apply this filter:\n\n1. **Is it on your MVP list?** If no, it goes in a backlog — not in the code.\n2. **Does the core flow break without it?** If no, defer it.\n3. **Will the AI use it to justify building more?** Over-architecting is the most common student mistake.\n\nFor your **${stage}** stage ${projectType}, ask yourself:\n> "If I showed this to someone today without this feature, would they understand the core idea?"\n\nIf yes, the feature can wait. If no, it's worth building now. Your setup package includes stage-specific scope guidance in \`PROJECT_CONTEXT.md\`.`;
  }

  // ── Learning checkpoint ───────────────────────────────────────────────
  if (q.includes("learning checkpoint") || q.includes("learn") || q.includes("understand")) {
    return `A **learning checkpoint** is a pause you take after the AI generates code — before asking for the next thing.\n\nThe rule: **don't move forward until you can explain what was just written.**\n\nHere's a quick checkpoint process:\n1. Read the code and identify what each part does\n2. Delete it and try to write it yourself (even roughly)\n3. Ask the AI to explain anything you don't recognize\n4. Only then ask for the next step\n\nFor **${experience}** developers, checkpoints help you avoid the "copy-paste trap" — where the codebase grows but your understanding doesn't. This is one of the main risks of AI-assisted development.\n\n${context.learningSupport.includes("Explain generated code") ? "You've already indicated you want the AI to explain generated code — great. Make this a non-negotiable habit for every session." : ""}`;
  }

  // ── Progress handoff ─────────────────────────────────────────────────
  if (q.includes("handoff") || q.includes("hand off") || q.includes("teammate") || q.includes("resume") || q.includes("session")) {
    return `Your \`PROGRESS_HANDOFF.md\` file is designed for exactly this. Before ending a session or handing off to a teammate:\n\n1. Update "Current Status" — what you're working on and what's blocking\n2. Check off completed items in the Stage Checklist\n3. Add any open questions\n4. Copy the **Context for Next Session** block and paste it into the next AI session as your opening message\n\nThis prevents the most common AI session problem: the assistant doesn't know where you left off and either repeats work or suggests features you've already decided against.\n\nFor **${stage}** stage, the most important thing to hand off is: what's done, what's decided, and what the next concrete step is.`;
  }

  // ── AI instructions / setup files ────────────────────────────────────
  if (q.includes("setup file") || q.includes("ai_workflow") || q.includes("project_context") || q.includes("cursorrules") || q.includes("claude.md")) {
    return `Your generated setup files serve different purposes:\n\n- **\`PROJECT_CONTEXT.md\`** — Paste into any new AI session as background context. Keeps the assistant from making assumptions about your stack or goals.\n- **\`AI_WORKFLOW.md\`** — Use this as your AI tool's instruction file. In Cursor, name it \`.cursorrules\`. For Claude, paste it as a system prompt. For ChatGPT, add it to custom instructions.\n- **\`DECISIONS.md\`** — Update as you make architectural choices. Reference it when the AI suggests alternatives you've already rejected.\n- **\`PROGRESS_HANDOFF.md\`** — Use between sessions. Always update before closing your editor.\n\nFor **${aiToolInstructions(context)}** specifically, the most useful file is \`AI_WORKFLOW.md\`.`;
  }

  // ── Scope creep ───────────────────────────────────────────────────────
  if (q.includes("scope") || q.includes("too much") || q.includes("creep") || q.includes("distract")) {
    return `Scope creep is the #1 reason student projects fail — and AI tools make it worse because they're always ready to generate more.\n\nFor your **${stage}** stage ${projectType}, here are red flags:\n- You're building features not on your original list\n- The AI suggested something "while you're at it"\n- You've been building for hours but the core demo doesn't work yet\n\n**How to push back:**\nIn your AI prompt, explicitly say: *"Do not suggest additional features. Only implement what I describe."*\n\nYour \`AI_WORKFLOW.md\` already includes a rule against **${context.aiAvoid.includes("Adding unnecessary features") ? "adding unnecessary features" : "scope expansion"}**. Remind the AI of this rule if it starts offering extras.`;
  }

  // ── GitHub / repo ─────────────────────────────────────────────────────
  if (q.includes("github") || q.includes("repository") || q.includes("repo") || q.includes("git")) {
    if (context.repoAnalysis) {
      return `Your current repository review is based on **${context.repoAnalysis.fullName}** on branch **${context.repoAnalysis.defaultBranch}**.\n\nWhat ClearStack found:\n- README present: ${context.repoAnalysis.hasReadme ? "Yes" : "No"}\n- Docs folder present: ${context.repoAnalysis.hasDocs ? "Yes" : "No"}\n- AI instruction files present: ${context.repoAnalysis.hasAIInstructions ? "Yes" : "No"}\n- Decision log present: ${context.repoAnalysis.hasDecisionLog ? "Yes" : "No"}\n- Test setup detected: ${context.repoAnalysis.hasTestSetup ? "Yes" : "No"}\n\nThe shallow review matched **${context.repoAnalysis.matchedFiles.length}** setup-related files. The biggest gaps right now are: ${context.repoAnalysis.missingSignals.join(", ") || "none"}.\n\nUse the generated \`REPOSITORY_REVIEW.md\` file as the stable handoff summary for future sessions.`;
    }

    return `For a **${stage}** stage ${projectType}, here's the minimum GitHub setup you need:\n\n${stage === "Ideation" || stage === "Proposal Writing" ? "- A private repo with your README and context files\n- No code yet — the repo is for documentation\n- Commit your setup package files (PROJECT_CONTEXT.md, AI_WORKFLOW.md)" : "- Main branch is protected (no direct pushes)\n- At least one descriptive commit per session\n- README kept up to date with setup steps\n- .gitignore configured for your stack (${stack})\n- Secrets never committed (no API keys in code)"}\n\n${context.aiAvoid.includes("Pushing to protected branches without permission") ? "Your setup already includes a rule against pushing to protected branches without permission — make sure your AI tool respects this." : ""}`;
  }

  // ── Generic fallback ──────────────────────────────────────────────────
  const fallbacks = [
    `That's a good question for your **${stage}** stage. Based on your setup, the most important thing to focus on right now is: ${stageAdviceShort(stage)} If your question is about a specific feature or file, try to describe the specific decision you're trying to make — I can give more targeted guidance.`,
    `For a **${experience}** developer working on a **${projectType}**, the safest rule is: solve the smallest possible problem that proves your idea. If your question is about whether to add something, the answer at **${stage}** stage is usually "not yet." \n\nCan you describe the specific tradeoff you're weighing?`,
    `Based on your project context, I'd recommend checking your \`PROJECT_CONTEXT.md\` for scope guidance and your \`AI_WORKFLOW.md\` for rules about what to build and avoid. If you have a specific concern about scope, AI prompting, or learning strategy, I can give more specific advice.`,
  ];

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function stageAdviceShort(stage: string): string {
  const map: Record<string, string> = {
    Ideation: "define the problem before exploring solutions.",
    "Proposal Writing": "document the idea clearly before touching code.",
    Planning: "set priorities before starting implementation.",
    Prototype: "validate the core idea before adding features.",
    "MVP Development": "build only what's on the MVP list.",
    Testing: "write tests before adding new features.",
    Documentation: "document the system as it exists.",
    Maintenance: "fix bugs before adding anything new.",
  };
  return map[stage] || "stay focused on your current stage goals.";
}

function aiToolInstructions(context: SetupData): string {
  if (context.aiTools.includes("Cursor")) return "Cursor";
  if (context.aiTools.includes("Claude")) return "Claude";
  if (context.aiTools.includes("GitHub Copilot")) return "GitHub Copilot";
  if (context.aiTools.includes("ChatGPT")) return "ChatGPT";
  return "your AI tool";
}
