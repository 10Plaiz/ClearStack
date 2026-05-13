import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const HERO_IMG =
  "https://images.unsplash.com/photo-1699495592088-f63b5d1b1e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGNvZGluZyUyMGxhcHRvcCUyMGNvbGxhYm9yYXRpdmUlMjBsZWFybmluZ3xlbnwxfHx8fDE3Nzg0OTY3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#17171c" strokeWidth="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#17171c" strokeWidth="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#17171c" strokeWidth="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#17171c" strokeWidth="1.5" fill="#ff7759" fillOpacity="0.3" />
      </svg>
    ),
    label: "Structured Onboarding",
    title: "Questions that actually understand your project",
    body:
      "A structured workflow that collects your project type, stage, experience level, and goals — then uses that context to generate guidance that fits your situation.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L21 7.5V16.5L12 21L3 16.5V7.5L12 3Z" stroke="#17171c" strokeWidth="1.5" />
        <path d="M12 8V12L15 14" stroke="#17171c" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: "Smart Setup Generation",
    title: "Project-specific AI guardrails and files",
    body:
      "Generates a tailored setup package: project context files, AI workflow rules, decision log templates, and progress handoff checklists — all calibrated to your current stage.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#17171c" strokeWidth="1.5" />
      </svg>
    ),
    label: "Project-Aware Chat",
    title: "A guide, not a code machine",
    body:
      "Ask questions based on your generated context. The assistant helps with scope, documentation, AI prompt strategy, and learning checkpoints — without writing code for you.",
  },
];

const steps = [
  {
    number: "01",
    title: "Answer structured questions",
    body: "Tell ClearStack what you're building, your current stage, your experience level, and how you plan to use AI tools. Takes about 3 minutes.",
  },
  {
    number: "02",
    title: "Get a custom setup package",
    body: "Receive project context files, AI workflow rules, guardrails, decision log templates, and stage-specific recommendations — all explained in plain language.",
  },
  {
    number: "03",
    title: "Build with clarity",
    body: "Use the setup files with your AI tools to stay on track. Ask the project-aware chat when you're unsure about scope, prompting, or learning checkpoints.",
  },
];

const principles = [
  { label: "Requirement gathering", color: "#003c33", text: "white" },
  { label: "Feature prioritization", color: "#071829", text: "white" },
  { label: "Incremental development", color: "#17171c", text: "white" },
  { label: "Code explanations", color: "#ff7759", text: "#17171c" },
  { label: "Learning checkpoints", color: "#eeece7", text: "#17171c" },
  { label: "Scope guardrails", color: "#f1f5ff", text: "#1863dc" },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "Inter, Arial, sans-serif" }}>
      <Navbar />

      {/* ── ANNOUNCEMENT BAR ─────────────────────────────────── */}
      <div className="bg-[#17171c] text-white text-center py-2.5 px-4">
        <span style={{ fontSize: "13px" }}>
          ClearStack is designed for students and early-stage developers.{" "}
          <a
            href="#how-it-works"
            className="underline text-[#ff7759] cursor-pointer"
            style={{ fontSize: "13px" }}
          >
            See how it works →
          </a>
        </span>
      </div>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        {/* Eyebrow */}
        <div className="flex justify-center mb-6">
          <span
            className="inline-flex items-center gap-1.5 border border-[#d9d9dd] rounded-full px-4 py-1.5 text-[#212121]"
            style={{ fontSize: "12px", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 500 }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#ff7759] inline-block"
            />
            Guided AI Setup Workflow
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-center mx-auto"
          style={{
            fontFamily: "'Space Grotesk', Inter, sans-serif",
            fontSize: "clamp(40px, 7vw, 76px)",
            fontWeight: 600,
            lineHeight: 1.0,
            letterSpacing: "-2px",
            color: "#17171c",
            maxWidth: "840px",
            margin: "0 auto 24px",
          }}
        >
          Build software with
          <br />
          clarity, not confusion.
        </h1>

        {/* Subtext */}
        <p
          className="text-center mx-auto text-[#75758a]"
          style={{
            fontSize: "clamp(16px, 2vw, 19px)",
            lineHeight: 1.6,
            maxWidth: "560px",
            margin: "0 auto 40px",
          }}
        >
          ClearStack helps students and early developers set up AI-assisted
          projects correctly — with guardrails, context files, and a guide that
          actually knows your project.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => navigate("/setup")}
            className="bg-[#17171c] text-white border-none cursor-pointer hover:bg-[#2a2a30] transition-colors"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              padding: "14px 32px",
              borderRadius: "9999px",
              minWidth: "180px",
            }}
          >
            Start your setup
          </button>
          <a
            href="#how-it-works"
            className="text-[#17171c] no-underline flex items-center gap-1.5 hover:gap-2.5 transition-all"
            style={{ fontSize: "15px", borderBottom: "1px solid #17171c", paddingBottom: "1px" }}
          >
            See how it works
          </a>
        </div>

        {/* Hero media — two-card composition */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {/* Product mockup card */}
          <div
            className="md:col-span-3 bg-[#17171c] overflow-hidden"
            style={{ borderRadius: "16px", padding: "24px" }}
          >
            {/* Console header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span
                className="text-[#93939f]"
                style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                Project Setup — Step 2 of 7
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mb-6">
              <div className="h-1 bg-[#ff7759] rounded-full" style={{ width: "28%" }} />
            </div>

            {/* Question */}
            <p
              className="text-white mb-1"
              style={{ fontSize: "13px", color: "#93939f", letterSpacing: "0.05em", textTransform: "uppercase" }}
            >
              What are you building?
            </p>
            <p className="text-white mb-5" style={{ fontSize: "18px", fontWeight: 600, letterSpacing: "-0.3px" }}>
              Select all that apply
            </p>

            {/* Chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["Web App", "Mobile App", "API / Backend", "AI Tool", "Prototype or MVP", "Data Dashboard"].map(
                (item, i) => (
                  <span
                    key={item}
                    className="rounded-full border px-3 py-1"
                    style={{
                      fontSize: "13px",
                      borderColor: i === 0 || i === 4 ? "#ff7759" : "rgba(255,255,255,0.15)",
                      color: i === 0 || i === 4 ? "#ff7759" : "rgba(255,255,255,0.6)",
                      backgroundColor: i === 0 || i === 4 ? "rgba(255,119,89,0.12)" : "transparent",
                    }}
                  >
                    {i === 0 || i === 4 ? "✓ " : ""}{item}
                  </span>
                )
              )}
            </div>

            {/* Continue button */}
            <button
              className="w-full border-none text-[#17171c] cursor-pointer"
              style={{
                background: "#ff7759",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Continue →
            </button>
          </div>

          {/* Photo card */}
          <div
            className="md:col-span-2 overflow-hidden relative"
            style={{ borderRadius: "16px", minHeight: "280px" }}
          >
            <ImageWithFallback
              src={HERO_IMG}
              alt="Students collaborating on a software project"
              className="w-full h-full object-cover"
              style={{ minHeight: "280px" }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 p-4"
              style={{
                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
              }}
            >
              <p className="text-white m-0" style={{ fontSize: "13px", fontWeight: 500 }}>
                Designed for students and early developers
              </p>
              <p className="text-white/70 m-0" style={{ fontSize: "12px" }}>
                who want to use AI tools responsibly
              </p>
            </div>
          </div>
        </div>
      </section>

{/* ── PRINCIPLES STRIP ──────────────────────────────────── */}
      <section className="border-y border-[#e5e7eb] py-6 overflow-hidden">
        {/* Added 'justify-center' to the className below */}
        <div 
          className="flex justify-center gap-3 overflow-x-auto px-6 pb-1 scrollbar-none" 
          style={{ scrollbarWidth: "none" }}
        >
          {principles.map((p) => (
            <span
              key={p.label}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0"
              style={{
                background: p.color,
                color: p.text,
                fontSize: "13px",
                fontWeight: 500,
                border: "1px solid transparent",
              }}
            >
              {p.label}
            </span>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-14">
          <span
            className="text-[#ff7759] block mb-3"
            style={{ fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}
          >
            How it works
          </span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', Inter, sans-serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 600,
              letterSpacing: "-1px",
              color: "#17171c",
              lineHeight: 1.1,
              maxWidth: "480px",
            }}
          >
            From blank page to structured project in minutes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="p-8 border-l border-[#e5e7eb] first:border-l-0 md:first:border-l-0"
              style={{ borderLeft: i === 0 ? "none" : "1px solid #e5e7eb" }}
            >
              <div
                className="text-[#d9d9dd] mb-6"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "48px",
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-2px",
                }}
              >
                {step.number}
              </div>
              <h3
                className="text-[#17171c] mb-3"
                style={{ fontSize: "20px", fontWeight: 600, letterSpacing: "-0.3px" }}
              >
                {step.title}
              </h3>
              <p className="text-[#75758a] m-0" style={{ fontSize: "15px", lineHeight: 1.6 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section id="features" className="bg-[#eeece7] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <span
              className="text-[#75758a] block mb-3"
              style={{ fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}
            >
              Features
            </span>
            <h2
              style={{
                fontFamily: "'Space Grotesk', Inter, sans-serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 600,
                letterSpacing: "-1px",
                color: "#17171c",
                lineHeight: 1.1,
                maxWidth: "520px",
              }}
            >
              Built to reduce overdependence on AI, not increase it
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white p-8"
                style={{ borderRadius: "16px" }}
              >
                <div className="mb-5">{f.icon}</div>
                <span
                  className="text-[#ff7759] block mb-2"
                  style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}
                >
                  {f.label}
                </span>
                <h3
                  className="text-[#17171c] mb-3"
                  style={{ fontSize: "20px", fontWeight: 600, letterSpacing: "-0.3px", lineHeight: 1.2 }}
                >
                  {f.title}
                </h3>
                <p className="text-[#75758a] m-0" style={{ fontSize: "15px", lineHeight: 1.6 }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR EDUCATORS ─────────────────────────────────────── */}
      <section id="for-educators" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span
              className="text-[#1863dc] block mb-4"
              style={{ fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}
            >
              For educators
            </span>
            <h2
              style={{
                fontFamily: "'Space Grotesk', Inter, sans-serif",
                fontSize: "clamp(28px, 3.5vw, 40px)",
                fontWeight: 600,
                letterSpacing: "-1px",
                color: "#17171c",
                lineHeight: 1.15,
                marginBottom: "20px",
              }}
            >
              Help students build the habit of structured thinking
            </h2>
            <p className="text-[#75758a] mb-8" style={{ fontSize: "16px", lineHeight: 1.7 }}>
              ClearStack replaces autonomous code generation with a workflow that emphasizes
              requirement gathering, incremental development, and detailed explanations. Students
              arrive at coding sessions with a plan, not just a prompt.
            </p>
            <div className="space-y-4">
              {[
                "Structured requirement gathering before any code",
                "Stage-specific guardrails that prevent premature complexity",
                "Decision logs that build accountability and reflection",
                "Learning checkpoints at every AI interaction",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full bg-[#003c33] flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="text-[#212121]" style={{ fontSize: "15px" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mockup — generated files panel */}
          <div
            className="bg-[#f8f8f7] border border-[#e5e7eb] overflow-hidden"
            style={{ borderRadius: "16px" }}
          >
            <div className="border-b border-[#e5e7eb] px-5 py-3 flex items-center gap-3">
              <span
                className="text-[#17171c]"
                style={{ fontSize: "13px", fontWeight: 600 }}
              >
                Generated Setup Package
              </span>
              <span
                className="ml-auto bg-[#003c33] text-white rounded-full px-2.5 py-0.5"
                style={{ fontSize: "11px" }}
              >
                4 files
              </span>
            </div>
            <div className="p-5 space-y-3">
              {[
                { name: "PROJECT_CONTEXT.md", desc: "Project type, stage, stack, scope boundaries" },
                { name: "AI_WORKFLOW.md", desc: "Rules for what AI should and should not do" },
                { name: "DECISIONS.md", desc: "Template for logging architectural decisions" },
                { name: "PROGRESS_HANDOFF.md", desc: "Stage-specific checklist for session continuity" },
              ].map((file) => (
                <div
                  key={file.name}
                  className="bg-white border border-[#e5e7eb] rounded-lg p-4 flex items-start gap-3"
                >
                  <span style={{ fontSize: "18px" }}>📄</span>
                  <div>
                    <p
                      className="text-[#17171c] m-0 mb-0.5"
                      style={{ fontSize: "13px", fontWeight: 600, fontFamily: "monospace" }}
                    >
                      {file.name}
                    </p>
                    <p className="text-[#93939f] m-0" style={{ fontSize: "12px" }}>
                      {file.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ──────────────────────────────────────────── */}
      <section className="bg-[#003c33] py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            style={{
              fontFamily: "'Space Grotesk', Inter, sans-serif",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 600,
              letterSpacing: "-1.5px",
              color: "white",
              lineHeight: 1.05,
              marginBottom: "20px",
            }}
          >
            Ready to build the right way?
          </h2>
          <p
            className="text-white/70 mb-10"
            style={{ fontSize: "18px", lineHeight: 1.6 }}
          >
            Answer a few structured questions and get a tailored setup package
            for your project in under 5 minutes.
          </p>
          <button
            onClick={() => navigate("/setup")}
            className="bg-white text-[#17171c] border-none cursor-pointer hover:bg-[#f0f0f0] transition-colors"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              padding: "14px 36px",
              borderRadius: "9999px",
            }}
          >
            Start your free setup →
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
