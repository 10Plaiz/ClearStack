import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-[#17171c] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div
              className="flex items-center gap-2.5 mb-4"
              style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
            >
              <div className="w-7 h-7 rounded-[6px] bg-white/10 flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
                  <rect x="8" y="1" width="5" height="5" rx="1" fill="#ff7759" />
                  <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.4" />
                  <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.7" />
                </svg>
              </div>
              <span style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.3px" }}>
                ClearStack
              </span>
            </div>
            <p
              className="text-[#93939f] leading-relaxed"
              style={{ fontSize: "14px" }}
            >
              A guided AI assistant for project setup and safety checks, not a fully autonomous
              coding agent.
            </p>
          </div>

          {/* Product */}
          <div>
            <p
              className="text-white mb-4"
              style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              Product
            </p>
            <ul className="space-y-3 list-none p-0 m-0">
              {["How it works", "Features", "Setup Wizard", "Project Chat"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[#93939f] no-underline hover:text-white transition-colors"
                    style={{ fontSize: "14px" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Educators */}
          <div>
            <p
              className="text-white mb-4"
              style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              Educators
            </p>
            <ul className="space-y-3 list-none p-0 m-0">
              {["Classroom guide", "Assessment tools", "Curriculum integration", "Research"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-[#93939f] no-underline hover:text-white transition-colors"
                      style={{ fontSize: "14px" }}
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p
              className="text-white mb-4"
              style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              Resources
            </p>
            <ul className="space-y-3 list-none p-0 m-0">
              {["Documentation", "Templates", "Best practices", "Support"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[#93939f] no-underline hover:text-white transition-colors"
                    style={{ fontSize: "14px" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#93939f]" style={{ fontSize: "13px" }}>
            © 2025 ClearStack. A guided setup tool for students and developers.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[#93939f] no-underline hover:text-white transition-colors"
                style={{ fontSize: "13px" }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
