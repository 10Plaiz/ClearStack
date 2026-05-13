import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthShell } from "../components/AuthShell";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSupabaseConfigured } = useAuth();
  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo || "/setup";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    setMessage("Signed in. Redirecting...");
    navigate(redirectTo, { replace: true });
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to continue setup."
      subtitle="Use the email and password you created for ClearStack. Email verification is handled by Supabase."
    >
      {!isSupabaseConfigured ? <AuthNotice type="error" text="Supabase env values are missing. Add them to .env.local before testing auth." /> : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <AuthField label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />

        {error ? <AuthNotice type="error" text={error} /> : null}
        {message ? <AuthNotice type="success" text={message} /> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full border-none text-white cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "#17171c", borderRadius: "9999px", padding: "12px 18px", fontSize: "14px", fontWeight: 600 }}
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="mt-5 flex flex-col gap-2 text-center" style={{ fontSize: "13px" }}>
        <Link to="/signup" className="text-[#17171c]">
          Need an account? Sign up
        </Link>
        <Link to="/verify-email" className="text-[#75758a]">
          Resend verification email
        </Link>
      </div>
    </AuthShell>
  );
}

function AuthField({
  label,
  type,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
}) {
  return (
    <label className="block">
      <span className="block text-[#212121] mb-2" style={{ fontSize: "13px", fontWeight: 600 }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-[#d9d9dd] px-4 py-3 outline-none transition-colors focus:border-[#17171c] text-[#212121] placeholder-[#93939f]"
        style={{ fontSize: "14px" }}
      />
    </label>
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

