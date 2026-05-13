import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useSetup } from "../context/SetupContext";
import { analyzeRepo } from "../utils/generateSetup";

// ── Types ─────────────────────────────────────────────────────────────────
type StepType = "single" | "multi" | "text" | "review";

interface StepOption {
  label: string;
  value: string;
  description?: string;
}

interface Step {
  id: string;
  title: string;
  subtitle: string;
  type: StepType;
  field: string;
  options?: StepOption[];
  optional?: boolean;
  condition?: (data: Record<string, unknown>) => boolean;
}

// ── Steps definition ───────────────────────────────────────────────────────
const ALL_STEPS: Step[] = [
  {
    id: "start_type",
    title: "How would you like to begin?",
    subtitle: "Choose your starting point — we'll tailor the setup to your situation.",
    type: "single",
    field: "startType",
    options: [
      { label: "Starting a new project", value: "new", description: "Begin from scratch with a clean, focused setup" },
      { label: "I already have a project", value: "existing", description: "Review and improve an existing repository" },
    ],
  },
  {
    id: "project_types",
    title: "What are you building?",
    subtitle: "Select everything that applies. You can choose more than one.",
    type: "multi",
    field: "projectTypes",
    options: [
      { label: "Website", value: "Website" },
      { label: "Web App", value: "Web App" },
      { label: "Mobile App", value: "Mobile App" },
      { label: "Desktop App", value: "Desktop App" },
      { label: "API / Backend Service", value: "API/Backend Service" },
      { label: "AI Tool", value: "AI Tool" },
      { label: "Data Dashboard", value: "Data Dashboard" },
      { label: "Proposal Only", value: "Proposal Only" },
      { label: "Prototype or MVP", value: "Prototype or MVP" },
    ],
  },
  {
    id: "stage",
    title: "What stage are you in?",
    subtitle: "Your stage determines which setup files and guardrails are most relevant right now.",
    type: "single",
    field: "stage",
    options: [
      { label: "Ideation", value: "Ideation", description: "Exploring ideas, nothing concrete yet" },
      { label: "Proposal Writing", value: "Proposal Writing", description: "Documenting the project plan" },
      { label: "Planning", value: "Planning", description: "Breaking down features and architecture" },
      { label: "Prototype", value: "Prototype", description: "Building to validate a core idea" },
      { label: "MVP Development", value: "MVP Development", description: "Building the minimum viable product" },
      { label: "Testing", value: "Testing", description: "Verifying existing functionality" },
      { label: "Documentation", value: "Documentation", description: "Writing docs for the current state" },
      { label: "Maintenance", value: "Maintenance", description: "Fixing bugs and small updates" },
    ],
  },
  {
    id: "experience",
    title: "What is your experience level?",
    subtitle: "This helps us calibrate the complexity of your setup recommendations.",
    type: "single",
    field: "experience",
    options: [
      { label: "Beginner", value: "Beginner", description: "Learning the basics, first real project" },
      { label: "Intermediate", value: "Intermediate", description: "Comfortable with fundamentals, building real things" },
      { label: "Experienced", value: "Experienced", description: "Strong fundamentals, learning advanced patterns" },
    ],
  },
  {
    id: "stack",
    title: "What stack or tools do you already know?",
    subtitle: "Select the technologies you're planning to use. This informs your AI workflow rules.",
    type: "multi",
    field: "stack",
    options: [
      { label: "HTML / CSS / JavaScript", value: "HTML/CSS/JavaScript" },
      { label: "React", value: "React" },
      { label: "Vue", value: "Vue" },
      { label: "Python", value: "Python" },
      { label: "Node.js", value: "Node.js" },
      { label: "PHP", value: "PHP" },
      { label: "Supabase / Firebase", value: "Supabase/Firebase" },
      { label: "SQL", value: "SQL" },
      { label: "No stack selected yet", value: "No stack selected yet" },
    ],
  },
  {
    id: "ai_tools",
    title: "What AI tools are you using?",
    subtitle: "We'll generate tool-specific instruction snippets where applicable.",
    type: "multi",
    field: "aiTools",
    options: [
      { label: "ChatGPT", value: "ChatGPT" },
      { label: "Claude", value: "Claude" },
      { label: "Codex", value: "Codex" },
      { label: "Cursor", value: "Cursor" },
      { label: "GitHub Copilot", value: "GitHub Copilot" },
      { label: "Other tools", value: "Other tools" },
      { label: "Not sure yet", value: "Not sure yet" },
    ],
  },
  {
    id: "ai_help",
    title: "What do you want AI to help with?",
    subtitle: "Select the areas where AI assistance is most useful for this project.",
    type: "multi",
    field: "aiHelp",
    options: [
      { label: "Brainstorming", value: "Brainstorming" },
      { label: "Proposal Writing", value: "Proposal Writing" },
      { label: "UI Design", value: "UI Design" },
      { label: "Coding", value: "Coding" },
      { label: "Debugging", value: "Debugging" },
      { label: "Testing", value: "Testing" },
      { label: "Documentation", value: "Documentation" },
      { label: "Deployment", value: "Deployment" },
    ],
  },
  {
    id: "ai_avoid",
    title: "What should the AI avoid?",
    subtitle: "These become guardrails in your AI workflow file to prevent common AI pitfalls.",
    type: "multi",
    field: "aiAvoid",
    options: [
      { label: "Changing unrelated files", value: "Changing unrelated files" },
      { label: "Adding unnecessary features", value: "Adding unnecessary features" },
      { label: "Using unfamiliar frameworks", value: "Using unfamiliar frameworks" },
      { label: "Making assumptions", value: "Making assumptions" },
      { label: "Skipping tests", value: "Skipping tests" },
      { label: "Exposing secrets", value: "Exposing secrets" },
      { label: "Pushing to protected branches without permission", value: "Pushing to protected branches without permission" },
    ],
  },
  {
    id: "learning_support",
    title: "What learning support do you need?",
    subtitle: "These shape how your AI workflow file tells the AI to explain its outputs.",
    type: "multi",
    field: "learningSupport",
    options: [
      { label: "Explain generated code", value: "Explain generated code" },
      { label: "Break features into small steps", value: "Break features into small steps" },
      { label: "Identify what to learn first", value: "Identify what to learn first" },
      { label: "Review code before adding more features", value: "Review code before adding more features" },
      { label: "Help debug without giving the full answer immediately", value: "Help debug without giving the full answer immediately" },
    ],
  },
  {
    id: "documentation",
    title: "Documentation and tracking",
    subtitle: "These determine which additional template files are included in your setup package.",
    type: "single",
    field: "decisionTracking",
    options: [
      { label: "Yes, I need a decision log", value: "Yes", description: "Track why important choices were made" },
      { label: "No decision log needed", value: "No", description: "Skip this for now" },
      { label: "Not sure yet", value: "Not sure", description: "We'll include a lightweight template just in case" },
    ],
  },
  {
    id: "handoff",
    title: "Do you need a progress handoff document?",
    subtitle: "Useful for team projects or when resuming after a break. Helps AI tools understand where you left off.",
    type: "single",
    field: "progressHandoff",
    options: [
      { label: "Yes, include a handoff template", value: "Yes", description: "For team work or multi-session projects" },
      { label: "No handoff needed", value: "No", description: "Solo short-term project" },
      { label: "Not sure", value: "Not sure", description: "We'll include a minimal template" },
    ],
  },
  {
    id: "repo_url",
    title: "Share your repository URL",
    subtitle: "Optional. We'll do a lightweight review of your public repository structure and factor findings into your setup.",
    type: "text",
    field: "repoUrl",
    optional: true,
    condition: (data) => data.startType === "existing",
  },
];

// ── Component ─────────────────────────────────────────────────────────────
export function SetupPage() {
  const { data, updateData } = useSetup();
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [localText, setLocalText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [isAnalyzingRepo, setIsAnalyzingRepo] = useState(false);

  const visibleSteps = ALL_STEPS.filter(
    (s) => !s.condition || s.condition(data as unknown as Record<string, unknown>)
  );

  const currentStep = visibleSteps[stepIndex];
  const progress = ((stepIndex) / visibleSteps.length) * 100;
  const isLastStep = stepIndex === visibleSteps.length - 1;

  const getFieldValue = (field: string): string | string[] => {
    return (data as Record<string, unknown>)[field] as string | string[];
  };

  const isStepValid = (): boolean => {
    if (!currentStep) return false;
    if (currentStep.optional) return true;
    const val = getFieldValue(currentStep.field);
    if (currentStep.type === "single") return typeof val === "string" && val.length > 0;
    if (currentStep.type === "multi") return Array.isArray(val) && val.length > 0;
    if (currentStep.type === "text") return true; // optional text
    return true;
  };

  const handleSingleSelect = (value: string) => {
    updateData({ [currentStep.field]: value } as Parameters<typeof updateData>[0]);
  };

  const handleMultiToggle = (value: string) => {
    const current = (getFieldValue(currentStep.field) as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateData({ [currentStep.field]: updated } as Parameters<typeof updateData>[0]);
  };

  const generatingMessages = [
    "Analyzing your project context...",
    "Generating AI workflow rules...",
    "Building scope guardrails...",
    "Creating documentation templates...",
    "Packaging your setup files...",
  ];

  const handleNext = async () => {
    if (currentStep.type === "text") {
      updateData({ repoUrl: localText } as Parameters<typeof updateData>[0]);
    }

    if (isLastStep) {
      // Analyze repo if provided
      if (data.startType === "existing" && localText.trim()) {
        setIsAnalyzingRepo(true);
        try {
          const analysis = await analyzeRepo(localText.trim());
          updateData({ repoAnalysis: analysis });
        } catch {
          // silently skip
        }
        setIsAnalyzingRepo(false);
      }

      // Generate setup
      setIsGenerating(true);
      for (let i = 0; i < generatingMessages.length; i++) {
        setGeneratingStep(i);
        await new Promise((r) => setTimeout(r, 700));
      }
      updateData({ isGenerated: true });
      navigate("/dashboard");
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
    else navigate("/");
  };

  // Sync text field
  useEffect(() => {
    if (currentStep?.type === "text") {
      setLocalText((getFieldValue(currentStep.field) as string) || "");
    }
  }, [stepIndex]);

  if (isAnalyzingRepo) {
    return (
      <GeneratingScreen
        messages={[
          "Fetching repository structure...",
          "Checking for README...",
          "Looking for documentation files...",
          "Checking for AI instruction files...",
          "Finalizing repository review...",
        ]}
        currentStep={generatingStep}
        title="Reviewing your repository"
        subtitle="Performing a lightweight public structure review"
      />
    );
  }

  if (isGenerating) {
    return (
      <GeneratingScreen
        messages={generatingMessages}
        currentStep={generatingStep}
        title="Generating your setup package"
        subtitle="Building files tailored to your project and stage"
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "Inter, Arial, sans-serif" }}>
      {/* ── Minimal nav ── */}
      <header className="border-b border-[#e5e7eb] px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 no-underline"
          style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
        >
          <div className="w-7 h-7 rounded-[6px] bg-[#17171c] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
              <rect x="8" y="1" width="5" height="5" rx="1" fill="#ff7759" />
              <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5" />
              <rect x="8" y="8" width="5" height="5" rx="1" fill="white" />
            </svg>
          </div>
          <span className="text-[#17171c]" style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.3px" }}>
            ClearStack
          </span>
        </Link>
        <span className="text-[#93939f]" style={{ fontSize: "13px" }}>
          Step {stepIndex + 1} of {visibleSteps.length}
        </span>
      </header>

      {/* ── Progress ── */}
      <div className="w-full h-1 bg-[#f2f2f2]">
        <div
          className="h-1 bg-[#17171c] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Content ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          {/* Step label */}
          <div className="flex items-center gap-2 mb-6">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#17171c] text-white"
              style={{ fontSize: "11px", fontWeight: 700 }}
            >
              {stepIndex + 1}
            </span>
            <span className="text-[#93939f]" style={{ fontSize: "13px" }}>
              {stepIndex + 1} / {visibleSteps.length}
            </span>
          </div>

          {/* Question */}
          <h1
            className="text-[#17171c] mb-2"
            style={{
              fontFamily: "'Space Grotesk', Inter, sans-serif",
              fontSize: "clamp(22px, 3vw, 30px)",
              fontWeight: 600,
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
            }}
          >
            {currentStep?.title}
          </h1>
          <p className="text-[#75758a] mb-8" style={{ fontSize: "15px", lineHeight: 1.5 }}>
            {currentStep?.subtitle}
          </p>

          {/* Options */}
          {(currentStep?.type === "single" || currentStep?.type === "multi") && (
            <div className="flex flex-wrap gap-3 mb-8">
              {currentStep.options?.map((opt) => {
                const fieldVal = getFieldValue(currentStep.field);
                const isSelected =
                  currentStep.type === "single"
                    ? fieldVal === opt.value
                    : Array.isArray(fieldVal) && fieldVal.includes(opt.value);

                return (
                  <button
                    key={opt.value}
                    onClick={() =>
                      currentStep.type === "single"
                        ? handleSingleSelect(opt.value)
                        : handleMultiToggle(opt.value)
                    }
                    className="transition-all duration-150 cursor-pointer text-left"
                    style={{
                      padding: opt.description ? "12px 16px" : "10px 18px",
                      borderRadius: opt.description ? "12px" : "9999px",
                      border: isSelected ? "1.5px solid #17171c" : "1.5px solid #e5e7eb",
                      background: isSelected ? "#17171c" : "white",
                      color: isSelected ? "white" : "#212121",
                      fontSize: "14px",
                      fontWeight: isSelected ? 500 : 400,
                      width: opt.description ? "100%" : "auto",
                    }}
                  >
                    <div className="flex items-start gap-2">
                      {opt.description && (
                        <div
                          className="w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
                          style={{
                            borderColor: isSelected ? "#ff7759" : "#d9d9dd",
                            background: isSelected ? "#ff7759" : "transparent",
                          }}
                        >
                          {isSelected && (
                            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                              <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                      )}
                      <div>
                        <span style={{ fontWeight: opt.description ? 500 : 400 }}>{opt.label}</span>
                        {opt.description && (
                          <p
                            className="m-0 mt-0.5"
                            style={{
                              fontSize: "12px",
                              color: isSelected ? "rgba(255,255,255,0.7)" : "#93939f",
                              lineHeight: 1.4,
                            }}
                          >
                            {opt.description}
                          </p>
                        )}
                      </div>
                      {currentStep.type === "multi" && !opt.description && isSelected && (
                        <span className="ml-1">✓</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Text input */}
          {currentStep?.type === "text" && (
            <div className="mb-8">
              <input
                type="url"
                value={localText}
                onChange={(e) => setLocalText(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full border border-[#e5e7eb] rounded-lg px-4 py-3 outline-none focus:border-[#17171c] transition-colors text-[#212121] placeholder-[#93939f]"
                style={{ fontSize: "15px" }}
              />
              <p className="text-[#93939f] mt-2" style={{ fontSize: "13px" }}>
                Only public repositories. We inspect folder structure and file presence only — no code is read.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="text-[#75758a] bg-transparent border-none cursor-pointer hover:text-[#17171c] transition-colors"
              style={{ fontSize: "14px", padding: "10px 0" }}
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="text-white border-none cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: isStepValid() ? "#17171c" : "#17171c",
                fontSize: "14px",
                fontWeight: 500,
                padding: "12px 28px",
                borderRadius: "9999px",
              }}
            >
              {isLastStep ? "Generate my setup →" : currentStep?.optional ? "Skip →" : "Continue →"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Generating screen ──────────────────────────────────────────────────────
function GeneratingScreen({
  messages,
  currentStep,
  title,
  subtitle,
}: {
  messages: string[];
  currentStep: number;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className="min-h-screen bg-[#17171c] flex flex-col items-center justify-center px-6"
      style={{ fontFamily: "Inter, Arial, sans-serif" }}
    >
      {/* Animated logo */}
      <div className="mb-10">
        <div
          className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center"
          style={{ animation: "pulse 2s ease-in-out infinite" }}
        >
          <svg width="28" height="28" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
            <rect x="8" y="1" width="5" height="5" rx="1" fill="#ff7759" />
            <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.4" />
            <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.8" />
          </svg>
        </div>
      </div>

      <h1
        className="text-white text-center mb-2"
        style={{
          fontFamily: "'Space Grotesk', Inter, sans-serif",
          fontSize: "28px",
          fontWeight: 600,
          letterSpacing: "-0.5px",
        }}
      >
        {title}
      </h1>
      <p className="text-[#93939f] text-center mb-12" style={{ fontSize: "15px" }}>
        {subtitle}
      </p>

      {/* Progress steps */}
      <div className="w-full max-w-xs space-y-3">
        {messages.map((msg, i) => (
          <div key={msg} className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300"
              style={{
                background: i < currentStep ? "#003c33" : i === currentStep ? "#ff7759" : "rgba(255,255,255,0.1)",
              }}
            >
              {i < currentStep && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
              {i === currentStep && (
                <div
                  className="w-2 h-2 rounded-full bg-white"
                  style={{ animation: "pulse 1s ease-in-out infinite" }}
                />
              )}
            </div>
            <span
              className="transition-colors duration-300"
              style={{
                fontSize: "14px",
                color: i <= currentStep ? "white" : "rgba(255,255,255,0.3)",
              }}
            >
              {msg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}