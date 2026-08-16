"use client";

import { useState, type FormEvent } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface ChangeEmailFormProps {
  currentEmail: string;
}

export default function ChangeEmailForm({ currentEmail }: ChangeEmailFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || email.trim() === currentEmail) {
      setStatus("error");
      setErrorMsg("Inserisci un indirizzo email diverso da quello attuale.");
      return;
    }

    setStatus("saving");
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.updateUser({ email: email.trim() });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }
    setStatus("success");
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="nuova-email@esempio.com"
          className="flex-1 bg-foreground/[0.03] border border-foreground/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50"
        />
        <button
          type="submit"
          disabled={status === "saving"}
          className="px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-50 shrink-0"
          style={{ background: "#6366f1", color: "#000" }}
        >
          {status === "saving" ? "Invio…" : "Cambia email"}
        </button>
      </div>
      {status === "success" && (
        <p className="text-xs text-green-700">
          Controlla la tua nuova casella email per confermare il cambio.
        </p>
      )}
      {status === "error" && <p className="text-xs text-red-600">{errorMsg}</p>}
    </form>
  );
}
