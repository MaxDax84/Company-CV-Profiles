"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import PasswordRequirements, { isPasswordValid } from "@/components/password-requirements";
import GoogleAuthButton from "@/components/google-auth-button";
import { useLanguage } from "@/components/language-provider";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-background border border-foreground/10 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-all duration-200";

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const claimToken = searchParams.get("claim");
  const loginHref = claimToken ? `/login?claim=${claimToken}` : "/login";
  const { lang } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "needsEmailConfirm" | "alreadyRegistered" | "claimFailed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Fire-and-forget proof that the terms/privacy checkbox below was
  // actually ticked before this account was created — see
  // supabase/migrations/0033_policy_acceptance_log.sql. userId is passed
  // through (rather than relying on the session cookie) because a
  // "confirm your email" signup has no server session yet at this point.
  function logSignupPolicyAcceptance(userId: string) {
    fetch("/api/policy-acceptance-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: "signup", policies: ["privacy", "terms"], userId }),
    }).catch(() => {});
  }

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
    if (!isPasswordValid(password) || !privacyAccepted) return;
    setStatus("loading");
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const emailRedirectTo = `${window.location.origin}/auth/callback${claimToken ? `?claim=${encodeURIComponent(claimToken)}` : ""}`;
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo },
    });

    if (signUpError) {
      setError(signUpError.message);
      setStatus("error");
      setProgress(0);
      return;
    }

    if (!data.session) {
      // With "Confirm email" on, Supabase never tells signUp() outright that
      // an email is already registered (that would let anyone probe which
      // emails have accounts) — instead it returns this same shape as a
      // genuine new signup, but with an empty identities array, whether the
      // existing account uses a password or only Google. That's the only
      // client-visible signal to catch it here instead of showing a
      // "confirmation email sent" message that's actively misleading for an
      // account that already exists (nothing new was actually sent).
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setStatus("alreadyRegistered");
        return;
      }
      if (data.user) logSignupPolicyAcceptance(data.user.id);
      setStatus("needsEmailConfirm");
      return;
    }
    if (data.user) logSignupPolicyAcceptance(data.user.id);

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
        // The account itself was created successfully even though claiming
        // this specific CV failed (e.g. expired preview, or the 4-CV
        // limit) — stop here instead of auto-redirecting, so the reason is
        // actually readable instead of flashing by before navigation.
        setError(claimed.error ?? (lang === "en" ? "Could not save this profile to your account." : "Non è stato possibile salvare il profilo nel tuo account."));
        setStatus("claimFailed");
        setProgress(0);
        return;
      } catch {
        // Network hiccup, not a real rejection — don't strand them on it.
      }
    }
    setProgress(100);
    await delay(300);
    router.push("/account");
  }

  if (status === "needsEmailConfirm") {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center text-sm text-muted-foreground">
        {lang === "en"
          ? "We've sent you a confirmation email — click the link to activate your account, then come back here to log in."
          : "Ti abbiamo inviato un'email di conferma — clicca il link per attivare l'account, poi torna qui per accedere."}
      </div>
    );
  }

  if (status === "alreadyRegistered") {
    return (
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-6 text-center space-y-3">
        <p className="text-sm text-amber-700 dark:text-amber-400 font-semibold">
          {lang === "en" ? "You're already registered" : "Sei già registrato"}
        </p>
        <p className="text-sm text-muted-foreground">
          {lang === "en"
            ? "This email already has a Jobli account (possibly via Google sign-in). Log in below, or reset your password if you don't remember it."
            : "Questa email ha già un account Jobli (magari con l'accesso Google). Accedi qui sotto, oppure recupera la password se non la ricordi."}
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href={loginHref}
            className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {lang === "en" ? "Log in" : "Accedi"}
          </a>
          <a href="/forgot-password" className="text-sm text-primary hover:underline">
            {lang === "en" ? "Reset password" : "Recupera password"}
          </a>
        </div>
      </div>
    );
  }

  if (status === "claimFailed") {
    return (
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-6 text-center space-y-3">
        <p className="text-sm text-amber-700 dark:text-amber-400 font-semibold">{lang === "en" ? "Account created" : "Account creato"}</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <a
          href="/account"
          className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          {lang === "en" ? "Go to your account →" : "Vai al tuo account →"}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="signup-email" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={lang === "en" ? "you@email.com" : "tu@email.com"}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="signup-password" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={lang === "en" ? "Create a secure password" : "Crea una password sicura"}
          className={inputClass}
        />
        <PasswordRequirements password={password} />
      </div>

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

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !isPasswordValid(password) || !privacyAccepted}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "0 4px 24px color-mix(in srgb, var(--primary) 31%, transparent)" }}
      >
        {status === "loading" && (
          <span
            className="absolute inset-y-0 left-0 bg-foreground/15 transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        )}
        <span className="relative">
          {status === "loading"
            ? (lang === "en" ? "Creating account…" : "Creazione account…")
            : (lang === "en" ? "Create free account" : "Crea account gratis")}
        </span>
      </button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground/50">
        <div className="flex-1 h-px bg-foreground/10" />
        {lang === "en" ? "or" : "oppure"}
        <div className="flex-1 h-px bg-foreground/10" />
      </div>

      <GoogleAuthButton claimToken={claimToken} />
      <p className="text-[11px] text-muted-foreground/60 text-center -mt-2">
        {lang === "en"
          ? "By continuing with Google, you agree to our Terms of Service and Privacy Policy."
          : "Continuando con Google, accetti i nostri Termini di Servizio e la Privacy Policy."}
      </p>

      <p className="text-xs text-muted-foreground text-center">
        {lang === "en" ? "Already have an account?" : "Hai già un account?"}{" "}
        <a href={loginHref} className="text-primary hover:underline">
          {lang === "en" ? "Log in" : "Accedi"}
        </a>
      </p>
    </form>
  );
}
