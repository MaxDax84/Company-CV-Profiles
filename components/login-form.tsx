"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const ACCENT = "#6366f1";
const inputClass =
  "w-full px-4 py-3 rounded-xl bg-background border border-white/10 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-all duration-200";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const claimToken = searchParams.get("claim");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (claimToken) {
      try {
        const res = await fetch("/api/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ claimToken }),
        });
        const claimed = await res.json();
        if (res.ok) {
          router.push(`/profile/${claimed.slug}`);
          return;
        }
      } catch {
        // fall through to the dashboard below
      }
    }
    router.push("/account");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="La tua password"
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-red-400 text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: ACCENT, color: "#000", boxShadow: `0 4px 24px ${ACCENT}50` }}
      >
        {loading ? "Accesso…" : "Accedi"}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        Non hai un account?{" "}
        <a href={claimToken ? `/signup?claim=${claimToken}` : "/signup"} className="text-primary hover:underline">
          Registrati gratis
        </a>
      </p>
    </form>
  );
}
