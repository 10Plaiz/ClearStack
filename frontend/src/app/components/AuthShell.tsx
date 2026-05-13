import { Link } from "react-router";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthShell({ eyebrow, title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[#f8f8f7] flex flex-col" style={{ fontFamily: "Inter, Arial, sans-serif" }}>
      <header className="bg-white border-b border-[#e5e7eb] px-6 h-16 flex items-center">
        <Link to="/" className="flex items-center gap-2 no-underline" style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
          <div className="w-7 h-7 rounded-[6px] bg-[#17171c] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
              <rect x="8" y="1" width="5" height="5" rx="1" fill="#ff7759" />
              <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5" />
              <rect x="8" y="8" width="5" height="5" rx="1" fill="white" />
            </svg>
          </div>
          <span className="text-[#17171c]" style={{ fontSize: "16px", fontWeight: 600 }}>
            ClearStack
          </span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <section className="w-full max-w-md">
          <div className="mb-6">
            <span className="text-[#ff7759] block mb-3" style={{ fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
              {eyebrow}
            </span>
            <h1
              className="text-[#17171c] m-0"
              style={{
                fontFamily: "'Space Grotesk', Inter, sans-serif",
                fontSize: "clamp(32px, 5vw, 44px)",
                fontWeight: 600,
                letterSpacing: "-1px",
                lineHeight: 1.05,
              }}
            >
              {title}
            </h1>
            <p className="text-[#75758a] mt-4 mb-0" style={{ fontSize: "15px", lineHeight: 1.6 }}>
              {subtitle}
            </p>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">{children}</div>
        </section>
      </main>
    </div>
  );
}

