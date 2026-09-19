"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import PasswordRequirements, { isPasswordValid } from "@/components/password-requirements";
import GoogleAuthButton from "@/components/google-auth-button";
import { useLanguage } from "@/components/language-provider";
import { safeRedirectPath } from "@/lib/safe-redirect";
import PasswordInput from "@/components/password-input";
import { trackClient } from "@/lib/analytics-client";
import { SIGNUP_POLICIES } from "@/lib/log-policy-acceptance";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-background border border-foreground/10 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-all duration-200";

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const claimToken = searchParams.get("claim");
  // Same "land on the feature that was clicked, not the generic dashboard"
  // mechanism as login-form.tsx — see lib/safe-redirect.ts.
  const next = safeRedirectPath(searchParams.get("next"));
  const loginParams = new URLSearchParams();
  if (claimToken) loginParams.set("claim", claimToken);
  if (next) loginParams.set("next", next);
  const loginHref = loginParams.size > 0 ? `/login?${loginParams.toString()}` : "/login";
  const { lang } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  // Terms §2: the service is for people aged 14+ (the Italian minimum age
  // to consent to online data processing alone). Until this box is ticked
  // too, neither the password submit nor the Google button is enabled.
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const declarationsAccepted = privacyAccepted && ageConfirmed;
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "needsEmailConfirm" | "alreadyRegistered" | "claimFailed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Fire-and-forget proof that the terms/privacy and 14+ checkboxes below
  // were actually ticked before this account was created — see
  // supabase/migrations/0033_policy_acceptance_log.sql. userId is passed
  // through (rather than relying on the session cookie) because a
  // "confirm your email" signup has no server session yet at this point.
  function logSignupPolicyAcceptance(userId: string) {
    fetch("/api/policy-acceptance-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: "signup", policies: SIGNUP_POLICIES, userId }),
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
    if (!isPasswordValid(password) || !declarationsAccepted) return;
    setStatus("loading");
    setError(null);

    // Catches a mistyped/made-up domain ("bmail.com") here instead of a
    // silent dead end when the confirmation email never arrives — see
    // app/api/account/check-email-domain/route.ts for why this checks for a
    // mail exchanger rather than matching against a fixed provider list.
    try {
      const domainCheck = await fetch("/api/account/check-email-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const domainResult = await domainCheck.json().catch(() => ({ valid: true }));
      if (domainCheck.ok && domainResult.valid === false) {
        setError(lang === "en" ? "This email domain doesn't look like it can receive mail — check for a typo." : "Il dominio di questa email non sembra in grado di ricevere posta — controlla che non ci sia un errore di battitura.");
        setStatus("error");
        setProgress(0);
        return;
      }
    } catch {
      // Network hiccup reaching our own check — don't block a real signup
      // over it, same fail-open reasoning as the route itself.
    }

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
    trackClient.signupCompleted({ method: "password" });

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
    router.push(next ?? "/account");
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
        <PasswordInput
          id="signup-password"
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

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !isPasswordValid(password) || !declarationsAccepted}
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

      {/* Same two declarations gate the Google path: the button stays
          disabled until both boxes above are ticked, and the fact that they
          were is forwarded to /auth/callback (see google-auth-button.tsx)
          so the acceptance record gets written server-side for a new
          Google account too. */}
      <GoogleAuthButton
        claimToken={claimToken}
        next={next}
        policiesAccepted={declarationsAccepted}
        disabled={!declarationsAccepted}
      />
      <p className="text-[11px] text-muted-foreground/60 text-center -mt-2">
        {declarationsAccepted
          ? (lang === "en"
            ? "The declarations above also apply when you continue with Google."
            : "Le dichiarazioni qui sopra valgono anche se continui con Google.")
          : (lang === "en"
            ? "Tick both boxes above to continue with Google."
            : "Spunta entrambe le caselle qui sopra per continuare con Google.")}
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
