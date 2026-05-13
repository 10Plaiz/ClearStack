import { FormEvent, useState } from "react";
import { Link } from "react-router";
import { AuthShell } from "../components/AuthShell";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";

export function SignupPage() {
  const { isSupabaseConfigured } = useAuth();
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
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    setIsSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setMessage("Account created. Check your email to verify your account before logging in.");
  };

  return (
    <AuthShell
      eyebrow="Create account"
      title="Start with a verified account."
      subtitle="ClearStack uses email and password signups only. No OAuth is included in this prototype."
    >
      {!isSupabaseConfigured ? <AuthNotice type="error" text="Supabase env values are missing. Add them to .env.local before testing auth." /> : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <AuthField label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" />

        {error ? <AuthNotice type="error" text={error} /> : null}
        {message ? <AuthNotice type="success" text={message} /> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full border-none text-white cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "#17171c", borderRadius: "9999px", padding: "12px 18px", fontSize: "14px", fontWeight: 600 }}
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="mt-5 flex flex-col gap-2 text-center" style={{ fontSize: "13px" }}>
        <Link to="/login" className="text-[#17171c]">
          Already have an account? Log in
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
        minLength={6}
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

