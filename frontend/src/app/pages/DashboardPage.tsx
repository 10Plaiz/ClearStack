import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useSetup } from "../context/SetupContext";
import { generateSetupFiles, type GeneratedFile } from "../utils/generateSetup";
import { getChatResponse, getSuggestions, type ChatMessage } from "../utils/chatResponses";

export function DashboardPage() {
  const { data, resetData } = useSetup();
  const navigate = useNavigate();

  // Redirect if setup not done
  useEffect(() => {
    if (!data.isGenerated && !data.projectTypes.length) {
      navigate("/setup");
    }
  }, []);

  const files = generateSetupFiles(data);

  return (
    <div
      className="min-h-screen bg-[#f8f8f7] flex flex-col"
      style={{ fontFamily: "Inter, Arial, sans-serif" }}
    >
      {/* ── Header ── */}
      <header className="bg-white border-b border-[#e5e7eb] px-6 h-14 flex items-center gap-4 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 no-underline" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <div className="w-6 h-6 rounded-[5px] bg-[#17171c] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
              <rect x="8" y="1" width="5" height="5" rx="1" fill="#ff7759" />
              <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5" />
              <rect x="8" y="8" width="5" height="5" rx="1" fill="white" />
            </svg>
          </div>
          <span className="text-[#17171c]" style={{ fontSize: "15px", fontWeight: 600, letterSpacing: "-0.3px" }}>
            ClearStack
          </span>
        </Link>

        {/* Project summary chip */}
        <div className="flex items-center gap-2 ml-4">
          {data.projectTypes.slice(0, 1).map((t) => (
            <span
              key={t}
              className="bg-[#eeece7] text-[#212121] rounded-full px-3 py-1"
              style={{ fontSize: "12px", fontWeight: 500 }}
            >
              {t}
            </span>
          ))}
          {data.stage && (
            <span
              className="border border-[#e5e7eb] text-[#75758a] rounded-full px-3 py-1"
              style={{ fontSize: "12px" }}
            >
              {data.stage}
            </span>
          )}
          {data.experience && (
            <span
              className="text-[#93939f]"
              style={{ fontSize: "12px" }}
            >
              · {data.experience}
            </span>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => {
              resetData();
              navigate("/setup");
            }}
            className="text-[#75758a] bg-transparent border border-[#e5e7eb] cursor-pointer hover:border-[#17171c] hover:text-[#17171c] transition-colors rounded-full"
            style={{ fontSize: "13px", padding: "6px 14px" }}
          >
            New setup
          </button>
        </div>
      </header>

      {/* ── Repo analysis banner (if available) ── */}
      {data.repoAnalysis && (
        <div className="bg-[#071829] text-white px-6 py-3 flex items-center gap-4 flex-wrap">
          <span style={{ fontSize: "13px", fontWeight: 500 }}>
            Repository review: <span className="text-[#ff7759]">{data.repoAnalysis.repoName}</span>
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            <RepoTag label="README" present={data.repoAnalysis.hasReadme} />
            <RepoTag label="Docs folder" present={data.repoAnalysis.hasDocs} />
            <RepoTag label="AI instructions" present={data.repoAnalysis.hasAIInstructions} />
            <RepoTag label="Decision log" present={data.repoAnalysis.hasDecisionLog} />
            <RepoTag label="Tests" present={data.repoAnalysis.hasTestSetup} />
          </div>
          {data.repoAnalysis.warnings.length > 0 && (
            <span className="text-[#ff7759]" style={{ fontSize: "12px" }}>
              ⚠ {data.repoAnalysis.warnings.length} gap{data.repoAnalysis.warnings.length > 1 ? "s" : ""} found — addressed in your setup files
            </span>
          )}
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ── LEFT: Setup package ── */}
        <SetupPackagePanel files={files} />

        {/* ── RIGHT: Chat ── */}
        <ChatPanel />
      </div>
    </div>
  );
}

// ── Repo tag ──────────────────────────────────────────────────────────────
function RepoTag({ label, present }: { label: string; present: boolean }) {
  return (
    <span
      className="flex items-center gap-1 rounded-full px-2.5 py-0.5"
      style={{
        fontSize: "11px",
        background: present ? "rgba(0,60,51,0.5)" : "rgba(255,119,89,0.2)",
        color: present ? "#7de8cc" : "#ff9980",
        border: `1px solid ${present ? "rgba(0,200,130,0.3)" : "rgba(255,119,89,0.3)"}`,
      }}
    >
      {present ? "✓" : "✗"} {label}
    </span>
  );
}

// ── Setup package panel ───────────────────────────────────────────────────
function SetupPackagePanel({ files }: { files: GeneratedFile[] }) {
  const [activeFile, setActiveFile] = useState(0);
  const [activeTab, setActiveTab] = useState<"content" | "explanation">("explanation");
  const [copied, setCopied] = useState(false);

  const file = files[activeFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    files.forEach((f) => {
      const blob = new Blob([f.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = f.name;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="flex-1 lg:max-w-[55%] flex flex-col bg-white border-r border-[#e5e7eb] overflow-hidden">
      {/* Panel header */}
      <div className="px-5 pt-5 pb-0 border-b border-[#e5e7eb]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="text-[#17171c] m-0"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "17px", fontWeight: 600 }}
            >
              Your Setup Package
            </h2>
            <p className="text-[#93939f] m-0 mt-0.5" style={{ fontSize: "13px" }}>
              {files.length} files generated for your project
            </p>
          </div>
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-1.5 bg-[#17171c] text-white border-none cursor-pointer hover:bg-[#2a2a30] transition-colors rounded-full"
            style={{ fontSize: "12px", fontWeight: 500, padding: "8px 14px" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1V8M6 8L3.5 5.5M6 8L8.5 5.5M1 10H11" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Download all
          </button>
        </div>

        {/* File tabs */}
        <div className="flex gap-1 overflow-x-auto pb-px" style={{ scrollbarWidth: "none" }}>
          {files.map((f, i) => (
            <button
              key={f.name}
              onClick={() => { setActiveFile(i); setActiveTab("explanation"); }}
              className="flex items-center gap-1.5 whitespace-nowrap border-none cursor-pointer transition-colors flex-shrink-0"
              style={{
                fontSize: "12px",
                fontWeight: activeFile === i ? 600 : 400,
                padding: "8px 12px",
                borderRadius: "6px 6px 0 0",
                background: activeFile === i ? "white" : "transparent",
                color: activeFile === i ? "#17171c" : "#75758a",
                borderBottom: activeFile === i ? "2px solid #17171c" : "2px solid transparent",
              }}
            >
              <span style={{ fontSize: "14px" }}>{f.icon}</span>
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content / Explanation tabs */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-[#f2f2f2] bg-[#fafafa]">
        <button
          onClick={() => setActiveTab("explanation")}
          className="border-none bg-transparent cursor-pointer transition-colors"
          style={{
            fontSize: "13px",
            fontWeight: activeTab === "explanation" ? 600 : 400,
            color: activeTab === "explanation" ? "#17171c" : "#75758a",
            borderBottom: activeTab === "explanation" ? "1.5px solid #17171c" : "1.5px solid transparent",
            padding: "2px 0",
          }}
        >
          Explanation
        </button>
        <button
          onClick={() => setActiveTab("content")}
          className="border-none bg-transparent cursor-pointer transition-colors"
          style={{
            fontSize: "13px",
            fontWeight: activeTab === "content" ? 600 : 400,
            color: activeTab === "content" ? "#17171c" : "#75758a",
            borderBottom: activeTab === "content" ? "1.5px solid #17171c" : "1.5px solid transparent",
            padding: "2px 0",
          }}
        >
          File content
        </button>
        <button
          onClick={handleCopy}
          className="ml-auto flex items-center gap-1.5 border border-[#e5e7eb] bg-white rounded-full cursor-pointer hover:border-[#17171c] transition-colors"
          style={{ fontSize: "12px", color: "#75758a", padding: "5px 12px" }}
        >
          {copied ? "✓ Copied" : "Copy file"}
        </button>
      </div>

      {/* File content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "explanation" ? (
          <div className="p-6">
            <div
              className="bg-[#f1f5ff] border border-[#dce6fd] rounded-xl p-5 mb-6"
              style={{ borderLeft: "3px solid #1863dc" }}
            >
              <p
                className="text-[#1863dc] m-0"
                style={{ fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}
              >
                Why this file matters
              </p>
              <p className="text-[#212121] m-0" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                {file.explanation}
              </p>
            </div>

            {/* File content preview */}
            <div
              className="bg-[#f8f8f7] border border-[#e5e7eb] rounded-xl overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e5e7eb]">
                <span style={{ fontSize: "14px" }}>{file.icon}</span>
                <span
                  className="text-[#17171c]"
                  style={{ fontSize: "13px", fontWeight: 600, fontFamily: "monospace" }}
                >
                  {file.name}
                </span>
              </div>
              <pre
                className="overflow-x-auto text-[#212121] m-0"
                style={{
                  fontSize: "12px",
                  lineHeight: 1.7,
                  padding: "16px",
                  fontFamily: "monospace",
                  maxHeight: "340px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {file.content.slice(0, 800)}
                {file.content.length > 800 && (
                  <span className="text-[#93939f]">
                    {"\n"}... {file.content.length - 800} more characters. Click "File content" to see all.
                  </span>
                )}
              </pre>
            </div>
          </div>
        ) : (
          <pre
            className="overflow-auto m-0 text-[#212121]"
            style={{
              fontSize: "12.5px",
              lineHeight: 1.7,
              padding: "24px",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              background: "white",
            }}
          >
            {file.content}
          </pre>
        )}
      </div>
    </div>
  );
}

// ── Chat panel ────────────────────────────────────────────────────────────
function ChatPanel() {
  const { data } = useSetup();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Your setup package is ready. I'm familiar with your project — a **${data.projectTypes[0] || "project"}** in **${data.stage || "development"}** stage, built with **${data.stack.join(", ") || "your chosen stack"}**.\n\nAsk me anything about your setup files, AI workflow, scope decisions, or learning strategy. I won't write code for you — but I can help you understand what to build, when, and how to use AI tools responsibly.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await getChatResponse(text.trim(), data, messages);
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const suggestions = getSuggestions();

  return (
    <div className="flex-1 flex flex-col bg-[#fafafa] min-h-0">
      {/* Chat header */}
      <div className="px-5 py-4 border-b border-[#e5e7eb] bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#17171c] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
              <rect x="8" y="1" width="5" height="5" rx="1" fill="#ff7759" />
              <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5" />
              <rect x="8" y="8" width="5" height="5" rx="1" fill="white" />
            </svg>
          </div>
          <div>
            <p className="m-0 text-[#17171c]" style={{ fontSize: "14px", fontWeight: 600 }}>
              Project-Aware Assistant
            </p>
            <p className="m-0 text-[#93939f]" style={{ fontSize: "12px" }}>
              Scope · Setup · Learning — not a code generator
            </p>
          </div>
          <div
            className="ml-auto w-2 h-2 rounded-full bg-[#28c840]"
            title="Online"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 min-h-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-[#17171c] flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
                  <rect x="8" y="1" width="5" height="5" rx="1" fill="#ff7759" />
                  <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5" />
                  <rect x="8" y="8" width="5" height="5" rx="1" fill="white" />
                </svg>
              </div>
            )}
            <div
              className="max-w-[85%] rounded-2xl"
              style={{
                padding: "10px 14px",
                background: msg.role === "user" ? "#17171c" : "white",
                color: msg.role === "user" ? "white" : "#212121",
                border: msg.role === "assistant" ? "1px solid #e5e7eb" : "none",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
              }}
            >
              <MarkdownText
                content={msg.content}
                isUser={msg.role === "user"}
              />
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-[#17171c] flex items-center justify-center flex-shrink-0 mr-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-[#ff7759]" />
            </div>
            <div
              className="bg-white border border-[#e5e7eb] rounded-2xl px-4 py-3 flex items-center gap-1"
              style={{ borderRadius: "4px 18px 18px 18px" }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#93939f] bounce-dot"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-5 pb-3">
          <p className="text-[#93939f] mb-2" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
            Suggested questions
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 4).map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="border border-[#e5e7eb] bg-white rounded-full text-[#212121] cursor-pointer hover:border-[#17171c] transition-colors text-left"
                style={{ fontSize: "12px", padding: "6px 12px" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-5 pb-5 pt-2">
        <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden focus-within:border-[#17171c] transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about scope, setup files, AI prompting, learning checkpoints..."
            rows={1}
            className="w-full resize-none outline-none border-none bg-transparent text-[#212121] placeholder-[#93939f]"
            style={{
              fontSize: "14px",
              padding: "12px 16px 4px",
              maxHeight: "120px",
              lineHeight: 1.5,
            }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 120) + "px";
            }}
          />
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <span className="text-[#93939f]" style={{ fontSize: "11px" }}>
              Press Enter to send · Shift+Enter for new line
            </span>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="flex items-center justify-center w-7 h-7 rounded-full border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{ background: input.trim() ? "#17171c" : "#e5e7eb" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 6H11M11 6L7 2M11 6L7 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Simple markdown renderer ───────────────────────────────────────────────
function MarkdownText({ content, isUser }: { content: string; isUser: boolean }) {
  const lines = content.split("\n");

  return (
    <div style={{ fontSize: "14px", lineHeight: 1.6 }}>
      {lines.map((line, i) => {
        // Code spans
        const parts = line.split(/(`[^`]+`)/g);
        const rendered = parts.map((part, j) => {
          if (part.startsWith("`") && part.endsWith("`")) {
            return (
              <code
                key={j}
                className="rounded px-1"
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  background: isUser ? "rgba(255,255,255,0.15)" : "#f0f0f0",
                  color: isUser ? "white" : "#17171c",
                }}
              >
                {part.slice(1, -1)}
              </code>
            );
          }
          // Bold
          const boldSplit = part.split(/(\*\*[^*]+\*\*)/g);
          return boldSplit.map((b, k) => {
            if (b.startsWith("**") && b.endsWith("**")) {
              return (
                <strong key={k} style={{ fontWeight: 600 }}>
                  {b.slice(2, -2)}
                </strong>
              );
            }
            return b;
          });
        });

        if (line.startsWith("- ")) {
          return (
            <div key={i} className="flex items-start gap-2" style={{ marginTop: i > 0 ? "4px" : 0 }}>
              <span style={{ color: isUser ? "rgba(255,255,255,0.6)" : "#93939f", flexShrink: 0, marginTop: "2px" }}>
                •
              </span>
              <span>{rendered}</span>
            </div>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <p key={i} style={{ fontWeight: 700, margin: i > 0 ? "12px 0 4px" : "0 0 4px" }}>
              {line.slice(4)}
            </p>
          );
        }
        if (line === "") {
          return <div key={i} style={{ height: "8px" }} />;
        }
        return (
          <span key={i} style={{ display: "block" }}>
            {rendered}
          </span>
        );
      })}
    </div>
  );
}