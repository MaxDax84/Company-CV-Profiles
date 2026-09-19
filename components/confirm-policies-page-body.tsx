"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import { useLanguage } from "@/components/language-provider";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { SIGNUP_POLICIES } from "@/lib/log-policy-acceptance";

interface Props {
  userId: string;
  next: string;
}

// The same two declarations as components/signup-form.tsx, shown once to
// a new Google account that skipped them (see app/auth/confirm-policies/
// page.tsx). "Continue" writes the signup acceptance record through the
// same /api/policy-acceptance-log route the password form uses, then lands
// on wherever the OAuth callback was originally headed. Someone who does
// not agree can sign out and delete the account from their account page.
export default function ConfirmPoliciesPageBody({ userId, next }: Props) {
  const router = useRouter();
  const { lang } = useLanguage();
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const canContinue = privacyAccepted && ageConfirmed && !loading;

  async function handleContinue() {
    if (!canContinue) return;
    setLoading(true);
    // Awaited (unlike the fire-and-forget in signup-form.tsx) because the
    // whole point of this page is the record — but never blocking: a
    // logging hiccup shouldn't strand a freshly signed-in user here.
    try {
      await fetch("/api/policy-acceptance-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: "signup", policies: SIGNUP_POLICIES, userId }),
      });
    } catch {
      // See above.
    }
    router.push(next);
  }

  async function handleSignOut() {
    setLoading(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />
      <div className="hidden md:block absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center px-6 py-32">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              {lang === "en" ? "One last step" : "Un ultimo passaggio"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {lang === "en"
                ? "Your Google account is connected. Before you continue, please confirm the following."
                : "Il tuo account Google è collegato. Prima di continuare, conferma quanto segue."}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 space-y-4">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-foreground/20 accent-[var(--primary)]"
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                {lang === "en" ? "I have read and agree to the" : "Ho letto e accetto i"}{" "}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {lang === "en" ? "Terms of Service" : "Termini di Servizio"}
                </a>{" "}
                {lang === "en" ? "and the" : "e la"}{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-foreground/20 accent-[var(--primary)]"
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                {lang === "en"
                  ? "I confirm that I am at least 14 years old."
                  : "Confermo di avere almeno 14 anni."}
              </span>
            </label>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "0 4px 24px color-mix(in srgb, var(--primary) 31%, transparent)" }}
            >
              {loading
                ? (lang === "en" ? "One moment…" : "Un attimo…")
                : (lang === "en" ? "Continue" : "Continua")}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              {lang === "en" ? "Don't agree?" : "Non sei d'accordo?"}{" "}
              <button type="button" onClick={handleSignOut} disabled={loading} className="text-primary hover:underline disabled:opacity-50">
                {lang === "en" ? "Sign out" : "Esci"}
              </button>
              {" "}
              {lang === "en"
                ? "(you can delete the account at any time from your account page)."
                : "(puoi eliminare l'account in qualsiasi momento dalla pagina del tuo account)."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
