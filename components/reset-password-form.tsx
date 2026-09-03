"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import PasswordRequirements, { isPasswordValid } from "@/components/password-requirements";
import { useLanguage } from "@/components/language-provider";
import PasswordInput from "@/components/password-input";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-background border border-foreground/10 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-all duration-200";

export default function ResetPasswordForm() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"checking" | "ready" | "saving" | "success" | "error" | "invalid">("checking");
  const [error, setError] = useState<string | null>(null);

  // Clicking the emailed recovery link logs the browser in with a
  // short-lived session scoped to changing the password — if there's no
  // session at all, the link was invalid, already used, or expired.
  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setStatus(session ? "ready" : "invalid");
    });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isPasswordValid(password)) {
      setStatus("error");
      setError(lang === "en" ? "The password doesn't meet all the requirements." : "La password non rispetta tutti i requisiti richiesti.");
      return;
    }
    if (password !== confirm) {
      setStatus("error");
      setError(lang === "en" ? "Passwords don't match." : "Le password non coincidono.");
      return;
    }

    setStatus("saving");
    const supabase = createBrowserSupabaseClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setStatus("error");
      setError(updateError.message);
      return;
    }
    setStatus("success");
    setTimeout(() => {
      router.push("/account");
      router.refresh();
    }, 1500);
  }

  if (status === "checking") {
    return <p className="text-sm text-muted-foreground text-center">{lang === "en" ? "Checking the link…" : "Verifica del link in corso…"}</p>;
  }

  if (status === "invalid") {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center text-sm text-muted-foreground space-y-3">
        <p>{lang === "en" ? "This link is no longer valid — it may have expired or already been used." : "Questo link non è più valido — potrebbe essere scaduto o già usato."}</p>
        <a href="/forgot-password" className="text-primary hover:underline font-semibold">
          {lang === "en" ? "Request a new link →" : "Richiedi un nuovo link →"}
        </a>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center text-sm text-muted-foreground">
        {lang === "en" ? "Password updated ✓ — taking you to your account…" : "Password aggiornata ✓ — ti stiamo portando al tuo account…"}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          {lang === "en" ? "New password" : "Nuova password"}
        </label>
        <PasswordInput
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={lang === "en" ? "Create a secure password" : "Crea una password sicura"}
          className={inputClass}
        />
        <PasswordRequirements password={password} />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          {lang === "en" ? "Confirm password" : "Conferma password"}
        </label>
        <PasswordInput
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder={lang === "en" ? "Repeat the password" : "Ripeti la password"}
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      <button
        type="submit"
        disabled={status === "saving" || !isPasswordValid(password)}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "0 4px 24px color-mix(in srgb, var(--primary) 31%, transparent)" }}
      >
        {status === "saving" ? (lang === "en" ? "Saving…" : "Salvataggio…") : (lang === "en" ? "Set new password" : "Imposta nuova password")}
      </button>
    </form>
  );
}
