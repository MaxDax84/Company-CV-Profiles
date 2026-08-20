"use client";

import { useState, type FormEvent } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useLanguage } from "@/components/language-provider";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-background border border-foreground/10 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-all duration-200";

export default function ForgotPasswordForm() {
  const { lang } = useLanguage();
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
        {lang === "en"
          ? "If an account exists with this email, we've sent a password reset link. Check your inbox."
          : "Se esiste un account con questa email, ti abbiamo inviato un link per reimpostare la password. Controlla la posta."}
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
          placeholder={lang === "en" ? "you@email.com" : "tu@email.com"}
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "0 4px 24px color-mix(in srgb, var(--primary) 31%, transparent)" }}
      >
        {status === "loading" ? (lang === "en" ? "Sending…" : "Invio…") : (lang === "en" ? "Send recovery link" : "Invia link di recupero")}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        {lang === "en" ? "Remembered your password?" : "Ti sei ricordato la password?"}{" "}
        <a href="/login" className="text-primary hover:underline">
          {lang === "en" ? "Log in" : "Accedi"}
        </a>
      </p>
    </form>
  );
}
