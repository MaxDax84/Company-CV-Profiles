"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import GoogleAuthButton from "@/components/google-auth-button";

const ACCENT = "#6366f1";
const inputClass =
  "w-full px-4 py-3 rounded-xl bg-background border border-foreground/10 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-all duration-200";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const claimToken = searchParams.get("claim");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // Seeded from ?error=oauth_failed (see app/auth/callback/route.ts) if the
  // user gets bounced back here after a failed Google sign-in — same error
  // state as a failed password login, just a different source.
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "oauth_failed"
      ? "Accesso con Google non riuscito. Riprova, o accedi con email e password."
      : null
  );
  const [claimFailed, setClaimFailed] = useState(false);

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
          router.push(`/${claimed.code}/${claimed.slug}`);
          return;
        }
        // Login succeeded even though claiming this specific CV failed
        // (e.g. expired preview, or the 4-CV limit) — stop and show why
        // instead of silently landing on the dashboard with no explanation.
        setError(claimed.error ?? "Non è stato possibile salvare il profilo nel tuo account.");
        setClaimFailed(true);
        setLoading(false);
        return;
      } catch {
        // Network hiccup, not a real rejection — don't strand them on it.
      }
    }
    router.push("/account");
  }

  if (claimFailed) {
    return (
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-6 text-center space-y-3">
        <p className="text-sm text-amber-700 font-semibold">Accesso effettuato</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <a
          href="/account"
          className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm"
          style={{ background: ACCENT, color: "#000" }}
        >
          Vai al tuo account →
        </a>
      </div>
    );
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
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Password
          </label>
          <a href="/forgot-password" className="text-xs text-primary hover:underline">
            Password dimenticata?
          </a>
        </div>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="La tua password"
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: ACCENT, color: "#000", boxShadow: `0 4px 24px ${ACCENT}50` }}
      >
        {loading ? "Accesso…" : "Accedi"}
      </button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground/50">
        <div className="flex-1 h-px bg-foreground/10" />
        oppure
        <div className="flex-1 h-px bg-foreground/10" />
      </div>

      <GoogleAuthButton claimToken={claimToken} />

      <p className="text-xs text-muted-foreground text-center">
        Non hai un account?{" "}
        <a href={claimToken ? `/signup?claim=${claimToken}` : "/signup"} className="text-primary hover:underline">
          Registrati gratis
        </a>
      </p>
    </form>
  );
}
