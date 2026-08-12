"use client";

import { useState, type FormEvent } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const ACCENT = "#6366f1";
const inputClass =
  "w-full px-4 py-3 rounded-xl bg-background border border-white/10 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-all duration-200";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    // Always show the same success state regardless of whether the email
    // exists — standard practice, so this form can't be used to check
    // which addresses have an account.
    if (resetError) {
      setError(resetError.message);
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center text-sm text-muted-foreground">
        Se esiste un account con questa email, ti abbiamo inviato un link per reimpostare la password. Controlla la posta.
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

      {error && <p className="text-sm text-red-400 text-center">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: ACCENT, color: "#000", boxShadow: `0 4px 24px ${ACCENT}50` }}
      >
        {status === "loading" ? "Invio…" : "Invia link di recupero"}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        Ti sei ricordato la password?{" "}
        <a href="/login" className="text-primary hover:underline">
          Accedi
        </a>
      </p>
    </form>
  );
}
