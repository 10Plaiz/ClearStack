import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { BrandLogo } from "../components/BrandLogo";
import { useSetup } from "../context/SetupContext";
import { analyzeRepo } from "../utils/generateSetup";
import { parseGitHubRepoUrl } from "../utils/githubApi";

type StepType = "single" | "multi";

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
  options: StepOption[];
}

const ALL_STEPS: Step[] = [
  {
    id: "start_type",
    title: "How would you like to begin?",
    subtitle: "Choose your starting point so the setup stays aligned with your current state.",
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
    subtitle: "Your stage determines which setup files and guardrails are relevant right now.",
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
    subtitle: "This calibrates the complexity of the setup recommendations.",
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
    subtitle: "We will generate tool-specific instruction snippets where applicable.",
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
    subtitle: "These become guardrails in your AI workflow file.",
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
      { label: "Not sure yet", value: "Not sure", description: "Include a lightweight template just in case" },
    ],
  },
  {
    id: "handoff",
    title: "Do you need a progress handoff document?",
    subtitle: "Useful for team projects or multi-session work.",
    type: "single",
    field: "progressHandoff",
    options: [
      { label: "Yes, include a handoff template", value: "Yes", description: "For team work or multi-session projects" },
      { label: "No handoff needed", value: "No", description: "Solo short-term project" },
      { label: "Not sure", value: "Not sure", description: "Include a minimal template" },
    ],
  },
];

function isAnalysisCurrent(currentUrl: string, analyzedUrl: string | undefined): boolean {
  const parsedCurrent = parseGitHubRepoUrl(currentUrl);
  const parsedAnalyzed = analyzedUrl ? parseGitHubRepoUrl(analyzedUrl) : null;

  if (!parsedCurrent || !parsedAnalyzed) {
    return false;
  }

  return parsedCurrent.normalizedUrl.toLowerCase() === parsedAnalyzed.normalizedUrl.toLowerCase();
}

export function SetupPage() {
  const { data, updateData } = useSetup();
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const [repoDraft, setRepoDraft] = useState(data.repoUrl);
  const [repoError, setRepoError] = useState<string | null>(null);
  const [repoStatus, setRepoStatus] = useState<string | null>(
    data.repoAnalysis ? `Reviewed ${data.repoAnalysis.fullName}` : null
  );
  const [isReviewingRepo, setIsReviewingRepo] = useState(false);
  const [isAnalyzingRepo, setIsAnalyzingRepo] = useState(false);
  const [repoProgressStep, setRepoProgressStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgressStep, setGenerationProgressStep] = useState(0);

  const visibleSteps = useMemo(() => ALL_STEPS, []);
  const currentStep = visibleSteps[stepIndex];
  const progress = ((stepIndex + 1) / visibleSteps.length) * 100;
  const isLastStep = stepIndex === visibleSteps.length - 1;
  const repoReviewMessages = [
    "Validating the repository URL...",
    "Fetching repository metadata...",
    "Scanning the default branch tree...",
    "Matching setup and documentation files...",
    "Saving repository signals for the setup flow...",
  ];
  const generatingMessages = [
    "Analyzing your project context...",
    "Generating AI workflow rules...",
    "Building scope guardrails...",
    "Creating documentation templates...",
    "Packaging your setup files...",
  ];

  const repoAnalysisIsCurrent = isAnalysisCurrent(repoDraft, data.repoAnalysis?.repoUrl);

  useEffect(() => {
    if (!isAnalyzingRepo) {
      return;
    }

    setRepoProgressStep(0);
    const timer = window.setInterval(() => {
      setRepoProgressStep((previous) => Math.min(previous + 1, repoReviewMessages.length - 1));
    }, 650);

    return () => window.clearInterval(timer);
  }, [isAnalyzingRepo, repoReviewMessages.length]);

  useEffect(() => {
    if (!data.repoAnalysis) {
      return;
    }

    if (repoAnalysisIsCurrent) {
      setRepoStatus(`Reviewed ${data.repoAnalysis.fullName}`);
      setRepoError(null);
    }
  }, [data.repoAnalysis, repoAnalysisIsCurrent]);

  const getFieldValue = (field: string): string | string[] => {
    return (data as Record<string, unknown>)[field] as string | string[];
  };

  const isStepValid = (): boolean => {
    const value = getFieldValue(currentStep.field);

    if (currentStep.type === "single") {
      return typeof value === "string" && value.length > 0;
    }

    return Array.isArray(value) && value.length > 0;
  };

  const handleSingleSelect = (value: string) => {
    updateData({ [currentStep.field]: value } as Parameters<typeof updateData>[0]);
  };

  const handleMultiToggle = (value: string) => {
    const current = (getFieldValue(currentStep.field) as string[]) || [];
    const updated = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    updateData({ [currentStep.field]: updated } as Parameters<typeof updateData>[0]);
  };

  const clearRepository = () => {
    setRepoDraft("");
    setRepoError(null);
    setRepoStatus(null);
    updateData({ repoUrl: "", repoAnalysis: null });
  };

  const reviewRepository = async (fullscreen = false) => {
    const trimmedUrl = repoDraft.trim();

    updateData({ repoUrl: trimmedUrl });

    if (!trimmedUrl) {
      if (!fullscreen) {
        clearRepository();
      }
      return null;
    }

    if (!parseGitHubRepoUrl(trimmedUrl)) {
      const message = "Enter a full GitHub repository URL, for example https://github.com/owner/repo.";
      setRepoError(message);
      setRepoStatus(null);
      if (fullscreen) {
        throw new Error(message);
      }
      return null;
    }

    setRepoError(null);
    setRepoStatus(null);
    setIsReviewingRepo(true);
    if (fullscreen) {
      setIsAnalyzingRepo(true);
    }

    try {
      const analysis = await analyzeRepo(trimmedUrl);
      setRepoDraft(analysis.repoUrl);
      setRepoStatus(`Reviewed ${analysis.fullName}`);
      updateData({ repoUrl: analysis.repoUrl, repoAnalysis: analysis });
      return analysis;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Repository review failed.";
      setRepoError(message);
      updateData({ repoAnalysis: null });
      if (fullscreen) {
        throw error;
      }
      return null;
    } finally {
      setIsReviewingRepo(false);
      if (fullscreen) {
        setIsAnalyzingRepo(false);
      }
    }
  };

  const handleNext = async () => {
    if (!isLastStep) {
      setStepIndex((previous) => previous + 1);
      return;
    }

    if (repoDraft.trim() && !repoAnalysisIsCurrent) {
      try {
        await reviewRepository(true);
      } catch {
        return;
      }
    }

    setIsGenerating(true);

    for (let index = 0; index < generatingMessages.length; index += 1) {
      setGenerationProgressStep(index);
      await new Promise((resolve) => window.setTimeout(resolve, 700));
    }

    updateData({ isGenerated: true });
    navigate("/dashboard");
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((previous) => previous - 1);
      return;
    }

    navigate("/");
  };

  if (isAnalyzingRepo) {
    return (
      <GeneratingScreen
        messages={repoReviewMessages}
        currentStep={repoProgressStep}
        title="Reviewing your repository"
        subtitle="Running a shallow public GitHub review before generating the setup package"
      />
    );
  }

  if (isGenerating) {
    return (
      <GeneratingScreen
        messages={generatingMessages}
        currentStep={generationProgressStep}
        title="Generating your setup package"
        subtitle="Building files tailored to your project, stage, and repository signals"
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "Inter, Arial, sans-serif" }}>
      <header className="border-b border-[#e5e7eb] px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="no-underline"
          style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
        >
          <BrandLogo className="block h-8 w-auto" />
        </Link>
        <span className="text-[#93939f]" style={{ fontSize: "13px" }}>
          Step {stepIndex + 1} of {visibleSteps.length}
        </span>
      </header>

      <div className="w-full h-1 bg-[#f2f2f2]">
        <div className="h-1 bg-[#17171c] transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">


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

          <h1
            className="text-[#17171c] mb-2"
            style={{
              fontFamily: "'Space Grotesk', Inter, sans-serif",
              fontSize: "clamp(22px, 3vw, 30px)",
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            {currentStep.title}
          </h1>
          <p className="text-[#75758a] mb-8" style={{ fontSize: "15px", lineHeight: 1.5 }}>
            {currentStep.subtitle}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {currentStep.options.map((option) => {
              const fieldValue = getFieldValue(currentStep.field);
              const isSelected =
                currentStep.type === "single"
                  ? fieldValue === option.value
                  : Array.isArray(fieldValue) && fieldValue.includes(option.value);

              return (
                <div key={option.value} style={{ width: option.description ? "100%" : "auto" }}>
                  <button
                    onClick={() =>
                      currentStep.type === "single" ? handleSingleSelect(option.value) : handleMultiToggle(option.value)
                    }
                    className="cursor-pointer text-left transition-all duration-150 w-full"
                    style={{
                      padding: option.description ? "12px 16px" : "10px 18px",
                      borderRadius: option.description ? "12px" : "9999px",
                      border: isSelected ? "1.5px solid #17171c" : "1.5px solid #e5e7eb",
                      background: isSelected ? "#17171c" : "#ffffff",
                      color: isSelected ? "#ffffff" : "#212121",
                      fontSize: "14px",
                      fontWeight: isSelected ? 500 : 400,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      {option.description ? (
                        <div
                          className="w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0"
                          style={{
                            borderColor: isSelected ? "#ff7759" : "#d9d9dd",
                            background: isSelected ? "#ff7759" : "transparent",
                          }}
                        >
                          {isSelected ? (
                            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                              <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          ) : null}
                        </div>
                      ) : null}

                      <div>
                        <span style={{ fontWeight: option.description ? 500 : 400 }}>{option.label}</span>
                        {option.description ? (
                          <p
                            className="m-0 mt-0.5"
                            style={{
                              fontSize: "12px",
                              color: isSelected ? "rgba(255,255,255,0.7)" : "#93939f",
                              lineHeight: 1.4,
                            }}
                          >
                            {option.description}
                          </p>
                        ) : null}
                      </div>

                      {currentStep.type === "multi" && !option.description && isSelected ? (
                        <span className="ml-1">✓</span>
                      ) : null}
                    </div>
                  </button>

                  {currentStep.id === "start_type" && option.value === "existing" && isSelected && (
                    <div className="mt-4 rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-4 text-left">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="m-0 text-[#17171c]" style={{ fontSize: "14px", fontWeight: 600 }}>
                            Public GitHub repository
                          </p>
                          <p className="m-0 mt-1 text-[#75758a]" style={{ fontSize: "13px", lineHeight: 1.5 }}>
                            Paste a repository link to do a shallow public review using the GitHub API.
                          </p>
                        </div>
                        {data.repoAnalysis && repoAnalysisIsCurrent ? (
                          <span
                            className="inline-flex items-center gap-2 rounded-full border px-3 py-1"
                            style={{
                              fontSize: "12px",
                              fontWeight: 500,
                              borderColor: "#cfe9e1",
                              background: "#ecf8f4",
                              color: "#0f5b4b",
                            }}
                          >
                            <span
                              className="block h-2 w-2 rounded-full"
                              style={{ background: "#0f5b4b" }}
                            />
                            Repo reviewed
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <input
                          type="url"
                          value={repoDraft}
                          onChange={(event) => {
                            setRepoDraft(event.target.value);
                            updateData({ repoUrl: event.target.value });
                            if (repoError) {
                              setRepoError(null);
                            }
                            if (repoStatus && !isAnalysisCurrent(event.target.value, data.repoAnalysis?.repoUrl)) {
                              setRepoStatus(null);
                            }
                          }}
                          placeholder="https://github.com/owner/repository"
                          className="w-full rounded-xl border border-[#d9d9dd] px-4 py-3 outline-none transition-colors focus:border-[#17171c] text-[#212121] placeholder-[#93939f]"
                          style={{ fontSize: "14px" }}
                        />
                        <button
                          onClick={() => {
                            void reviewRepository(false);
                          }}
                          disabled={isReviewingRepo}
                          className="rounded-xl border-none px-5 py-3 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            background: "#17171c",
                            minWidth: "138px",
                          }}
                        >
                          {isReviewingRepo ? "Reviewing..." : repoAnalysisIsCurrent ? "Refresh review" : "Review repo"}
                        </button>
                      </div>

                      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="m-0 text-[#93939f]" style={{ fontSize: "12px", lineHeight: 1.5 }}>
                          Public repos only. This review validates the repository, reads metadata, scans the default branch tree, and tracks setup files.
                        </p>
                        {repoDraft ? (
                          <button
                            onClick={clearRepository}
                            className="border-none bg-transparent p-0 text-left text-[#75758a] transition-colors hover:text-[#17171c]"
                            style={{ fontSize: "12px", fontWeight: 500 }}
                          >
                            Clear repository
                          </button>
                        ) : null}
                      </div>

                      {repoError ? (
                        <p className="m-0 mt-3 text-[#c33f2f]" style={{ fontSize: "12px", lineHeight: 1.5 }}>
                          {repoError}
                        </p>
                      ) : null}

                      {repoStatus ? (
                        <p className="m-0 mt-3 text-[#0f5b4b]" style={{ fontSize: "12px", lineHeight: 1.5 }}>
                          {repoStatus}
                        </p>
                      ) : null}

                      {data.repoAnalysis && repoAnalysisIsCurrent ? (
                        <div className="mt-4 rounded-xl border border-[#e5e7eb] bg-white p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <a
                                href={data.repoAnalysis.repoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#17171c] no-underline"
                                style={{ fontSize: "14px", fontWeight: 600 }}
                              >
                                {data.repoAnalysis.fullName}
                              </a>
                              <p className="m-0 mt-1 text-[#75758a]" style={{ fontSize: "12px" }}>
                                Default branch: {data.repoAnalysis.defaultBranch} · Tree scan: {data.repoAnalysis.treeScanStatus}
                              </p>
                            </div>
                            <span className="text-[#93939f]" style={{ fontSize: "12px" }}>
                              {data.repoAnalysis.matchedFiles.length} matched setup files
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <RepoSignal label="README" present={data.repoAnalysis.hasReadme} />
                            <RepoSignal label="Docs" present={data.repoAnalysis.hasDocs} />
                            <RepoSignal label="AI instructions" present={data.repoAnalysis.hasAIInstructions} />
                            <RepoSignal label="Decision log" present={data.repoAnalysis.hasDecisionLog} />
                            <RepoSignal label="Tests" present={data.repoAnalysis.hasTestSetup} />
                          </div>

                          {data.repoAnalysis.warnings.length > 0 ? (
                            <div className="mt-4 rounded-xl bg-[#fff6f3] px-3 py-3">
                              <p className="m-0 text-[#17171c]" style={{ fontSize: "12px", fontWeight: 600 }}>
                                Review warnings
                              </p>
                              <div className="mt-2 space-y-1">
                                {data.repoAnalysis.warnings.slice(0, 3).map((warning) => (
                                  <p key={warning} className="m-0 text-[#8b4a37]" style={{ fontSize: "12px", lineHeight: 1.5 }}>
                                    {warning}
                                  </p>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="text-[#75758a] bg-transparent border-none cursor-pointer hover:text-[#17171c] transition-colors"
              style={{ fontSize: "14px", padding: "10px 0" }}
            >
              Back
            </button>
            <button
              onClick={() => {
                void handleNext();
              }}
              disabled={!isStepValid()}
              className="text-white border-none cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "#17171c",
                fontSize: "14px",
                fontWeight: 500,
                padding: "12px 28px",
                borderRadius: "9999px",
              }}
            >
              {isLastStep ? "Generate my setup" : "Continue"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function RepoSignal({ label, present }: { label: string; present: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1"
      style={{
        fontSize: "11px",
        border: `1px solid ${present ? "rgba(10,120,98,0.16)" : "rgba(195,63,47,0.16)"}`,
        background: present ? "#edf8f5" : "#fff3f1",
        color: present ? "#0f5b4b" : "#a23b2e",
      }}
    >
      {present ? "Yes" : "No"} {label}
    </span>
  );
}

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
    <div className="min-h-screen bg-[#17171c] flex flex-col items-center justify-center px-6" style={{ fontFamily: "Inter, Arial, sans-serif" }}>
      <div className="mb-10">
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center" style={{ animation: "pulse 2s ease-in-out infinite" }}>
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
        }}
      >
        {title}
      </h1>
      <p className="text-[#93939f] text-center mb-12" style={{ fontSize: "15px" }}>
        {subtitle}
      </p>

      <div className="w-full max-w-xs space-y-3">
        {messages.map((message, index) => (
          <div key={message} className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300"
              style={{
                background:
                  index < currentStep ? "#003c33" : index === currentStep ? "#ff7759" : "rgba(255,255,255,0.1)",
              }}
            >
              {index < currentStep ? (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) : null}
              {index === currentStep ? (
                <div className="w-2 h-2 rounded-full bg-white" style={{ animation: "pulse 1s ease-in-out infinite" }} />
              ) : null}
            </div>
            <span
              style={{
                fontSize: "14px",
                color: index <= currentStep ? "#ffffff" : "rgba(255,255,255,0.3)",
              }}
            >
              {message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
