"use client";

import { useState, type FormEvent } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export default function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setStatus("error");
      setErrorMsg("La password deve avere almeno 8 caratteri.");
      return;
    }
    if (password !== confirm) {
      setStatus("error");
      setErrorMsg("Le password non coincidono.");
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
        <input
          type="password"
          placeholder="Nuova password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-black/[0.03] border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50"
        />
        <input
          type="password"
          placeholder="Conferma password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full bg-black/[0.03] border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
          style={{ background: "#6366f1", color: "#000" }}
        >
          {status === "saving" ? "Aggiornamento…" : "Aggiorna password"}
        </button>
        {status === "success" && <p className="text-xs text-green-700">Password aggiornata ✓</p>}
        {status === "error" && <p className="text-xs text-red-600">{errorMsg}</p>}
      </div>
    </form>
  );
}
