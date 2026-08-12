"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const ACCENT = "#6366f1";
const inputClass =
  "w-full px-4 py-3 rounded-xl bg-background border border-white/10 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-all duration-200";

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const claimToken = searchParams.get("claim");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "needsEmailConfirm">("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Eases toward ~90% while the real work (signup + claim) is in flight —
  // we don't have granular progress from either step, so this just gives
  // continuous visual feedback instead of a static "loading" label. Jumps
  // to 100% right before navigating away, so the bar visibly completes.
  useEffect(() => {
    if (status !== "loading") return;
    setProgress(10);
    const id = setInterval(() => {
      setProgress(p => (p < 88 ? p + (88 - p) * 0.15 : p));
    }, 200);
    return () => clearInterval(id);
  }, [status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setError(signUpError.message);
      setStatus("error");
      setProgress(0);
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
          setProgress(100);
          await delay(300);
          router.push(`/${claimed.code}/${claimed.slug}`);
          return;
        }
        // Signup worked even if claiming failed (e.g. expired preview) —
        // send them to the dashboard rather than stranding them on an error.
        setError(claimed.error ?? null);
      } catch {
        // Same reasoning — don't block on a network hiccup during claim.
      }
    }
    setProgress(100);
    await delay(300);
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
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:cursor-not-allowed relative overflow-hidden"
        style={{ background: ACCENT, color: "#000", boxShadow: `0 4px 24px ${ACCENT}50` }}
      >
        {status === "loading" && (
          <span
            className="absolute inset-y-0 left-0 bg-black/15 transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        )}
        <span className="relative">
          {status === "loading" ? "Creazione account…" : "Crea account gratis"}
        </span>
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
