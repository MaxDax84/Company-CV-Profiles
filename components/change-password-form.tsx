"use client";

import { useState, type FormEvent } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import PasswordRequirements, { isPasswordValid } from "@/components/password-requirements";
import { useLanguage } from "@/components/language-provider";
import PasswordInput from "@/components/password-input";

export default function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { lang } = useLanguage();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isPasswordValid(password)) {
      setStatus("error");
      setErrorMsg(lang === "en" ? "The password doesn't meet all the requirements." : "La password non rispetta tutti i requisiti richiesti.");
      return;
    }
    if (password !== confirm) {
      setStatus("error");
      setErrorMsg(lang === "en" ? "Passwords don't match." : "Le password non coincidono.");
      return;
    }

    setStatus("saving");
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }
    setStatus("success");
    setPassword("");
    setConfirm("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <PasswordInput
            placeholder={lang === "en" ? "New password" : "Nuova password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50"
          />
          <PasswordRequirements password={password} />
        </div>
        <PasswordInput
          placeholder={lang === "en" ? "Confirm password" : "Conferma password"}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving" || !isPasswordValid(password)}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          {status === "saving" ? (lang === "en" ? "Updating…" : "Aggiornamento…") : (lang === "en" ? "Update password" : "Aggiorna password")}
        </button>
        {status === "success" && <p className="text-xs text-green-700 dark:text-green-400">{lang === "en" ? "Password updated ✓" : "Password aggiornata ✓"}</p>}
        {status === "error" && <p className="text-xs text-destructive">{errorMsg}</p>}
      </div>
    </form>
  );
}
