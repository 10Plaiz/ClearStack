import { Link, useNavigate } from "react-router";

interface NavbarProps {
  minimal?: boolean;
}

export function Navbar({ minimal = false }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <header className="w-full border-b border-[#e5e7eb] bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 no-underline"
          style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
        >
          <div className="w-7 h-7 rounded-[6px] bg-[#17171c] flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
              <rect x="8" y="1" width="5" height="5" rx="1" fill="#ff7759" />
              <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5" />
              <rect x="8" y="8" width="5" height="5" rx="1" fill="white" />
            </svg>
          </div>
          <span
            className="text-[#17171c]"
            style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.3px" }}
          >
            ClearStack
          </span>
        </Link>

        {!minimal && (
          <>
            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#how-it-works"
                className="text-[#212121] no-underline hover:text-[#17171c] transition-colors"
                style={{ fontSize: "14px", fontWeight: 400 }}
              >
                How it works
              </a>
              <a
                href="#features"
                className="text-[#212121] no-underline hover:text-[#17171c] transition-colors"
                style={{ fontSize: "14px", fontWeight: 400 }}
              >
                Features
              </a>
              <a
                href="#for-educators"
                className="text-[#212121] no-underline hover:text-[#17171c] transition-colors"
                style={{ fontSize: "14px", fontWeight: 400 }}
              >
                For educators
              </a>
            </nav>

            {/* CTA */}
            <button
              onClick={() => navigate("/setup")}
              className="hidden md:flex items-center gap-2 bg-[#17171c] text-white border-none cursor-pointer hover:bg-[#2a2a30] transition-colors"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                padding: "10px 22px",
                borderRadius: "9999px",
              }}
            >
              Start Setup
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => navigate("/setup")}
              className="md:hidden bg-[#17171c] text-white border-none cursor-pointer"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                padding: "8px 16px",
                borderRadius: "9999px",
              }}
            >
              Start
            </button>
          </>
        )}
      </div>
    </header>
  );
}
