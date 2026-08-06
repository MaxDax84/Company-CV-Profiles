"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const ACCENT = "#6366f1";
const inputClass =
  "w-full px-4 py-3 rounded-xl bg-background border border-white/10 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-all duration-200";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const claimToken = searchParams.get("claim");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "needsEmailConfirm">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setError(signUpError.message);
      setStatus("error");
      return;
    }

    if (!data.session) {
      // "Confirm email" is on in Supabase — no session yet, can't claim the
      // pending profile until the user verifies. See project plan notes.
      setStatus("needsEmailConfirm");
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
        // Signup worked even if claiming failed (e.g. expired preview) —
        // send them to the dashboard rather than stranding them on an error.
        setError(claimed.error ?? null);
      } catch {
        // Same reasoning — don't block on a network hiccup during claim.
      }
    }
    router.push("/account");
  }

  if (status === "needsEmailConfirm") {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center text-sm text-muted-foreground">
        Ti abbiamo inviato un'email di conferma — clicca il link per attivare l'account, poi torna qui per accedere.
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
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Password
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Almeno 8 caratteri"
          className={inputClass}
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: ACCENT, color: "#000", boxShadow: `0 4px 24px ${ACCENT}50` }}
      >
        {status === "loading" ? "Creazione account…" : "Crea account gratis"}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        Hai già un account?{" "}
        <a href={claimToken ? `/login?claim=${claimToken}` : "/login"} className="text-primary hover:underline">
          Accedi
        </a>
      </p>
    </form>
  );
}
