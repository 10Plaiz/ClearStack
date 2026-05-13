import { FormEvent, useState } from "react";
import { Link } from "react-router";
import { AuthShell } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../utils/supabaseClient";

export function VerifyEmailPage() {
  const { isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!supabase) {
      setError("Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      return;
    }

    setIsSubmitting(true);
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    setIsSubmitting(false);

    if (resendError) {
      setError(resendError.message);
      return;
    }

    setMessage("Verification email sent. Check your inbox before logging in.");
  };

  return (
    <AuthShell
      eyebrow="Verify email"
      title="Resend your verification email."
      subtitle="Use this if the first Supabase confirmation email expired or did not arrive."
    >
      {!isSupabaseConfigured ? <AuthNotice type="error" text="Supabase env values are missing. Add them to .env.local before testing auth." /> : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="block text-[#212121] mb-2" style={{ fontSize: "13px", fontWeight: 600 }}>
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-xl border border-[#d9d9dd] px-4 py-3 outline-none transition-colors focus:border-[#17171c] text-[#212121] placeholder-[#93939f]"
            style={{ fontSize: "14px" }}
          />
        </label>

        {error ? <AuthNotice type="error" text={error} /> : null}
        {message ? <AuthNotice type="success" text={message} /> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full border-none text-white cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "#17171c", borderRadius: "9999px", padding: "12px 18px", fontSize: "14px", fontWeight: 600 }}
        >
          {isSubmitting ? "Sending..." : "Resend verification"}
        </button>
      </form>

      <div className="mt-5 flex flex-col gap-2 text-center" style={{ fontSize: "13px" }}>
        <Link to="/login" className="text-[#17171c]">
          Back to login
        </Link>
        <Link to="/signup" className="text-[#75758a]">
          Create a new account
        </Link>
      </div>
    </AuthShell>
  );
}

function AuthNotice({ type, text }: { type: "error" | "success"; text: string }) {
  const isError = type === "error";
  return (
    <p
      className="rounded-xl px-3 py-3 m-0"
      style={{
        fontSize: "12px",
        lineHeight: 1.5,
        background: isError ? "#fff3f1" : "#ecf8f4",
        color: isError ? "#a23b2e" : "#0f5b4b",
      }}
    >
      {text}
    </p>
  );
}

