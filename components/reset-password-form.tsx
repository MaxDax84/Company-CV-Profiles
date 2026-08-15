"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import PasswordRequirements, { isPasswordValid } from "@/components/password-requirements";

const ACCENT = "#6366f1";
const inputClass =
  "w-full px-4 py-3 rounded-xl bg-background border border-foreground/10 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-all duration-200";

export default function ResetPasswordForm() {
  const router = useRouter();
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
      setError("La password non rispetta tutti i requisiti richiesti.");
      return;
    }
    if (password !== confirm) {
      setStatus("error");
      setError("Le password non coincidono.");
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
    return <p className="text-sm text-muted-foreground text-center">Verifica del link in corso…</p>;
  }

  if (status === "invalid") {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-sm text-muted-foreground space-y-3">
        <p>Questo link non è più valido — potrebbe essere scaduto o già usato.</p>
        <a href="/forgot-password" className="text-primary hover:underline font-semibold">
          Richiedi un nuovo link →
        </a>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center text-sm text-muted-foreground">
        Password aggiornata ✓ — ti stiamo portando al tuo account…
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Nuova password
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Crea una password sicura"
          className={inputClass}
        />
        <PasswordRequirements password={password} />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Conferma password
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Ripeti la password"
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      <button
        type="submit"
        disabled={status === "saving" || !isPasswordValid(password)}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: ACCENT, color: "#000", boxShadow: `0 4px 24px ${ACCENT}50` }}
      >
        {status === "saving" ? "Salvataggio…" : "Imposta nuova password"}
      </button>
    </form>
  );
}
