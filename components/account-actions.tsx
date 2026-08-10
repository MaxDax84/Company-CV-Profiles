"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
    >
      {loading ? "Uscita…" : "Esci"}
    </button>
  );
}

interface DeleteProfileButtonProps {
  profileId: string;
  label?: string;
  confirmMessage?: string;
}

// Deletes a single profile row — the primary CV or one specific tailored
// (job-adapted) one, identified by profileId. Does NOT touch the account
// itself; see DeleteAccountButton for that.
export function DeleteProfileButton({ profileId, label = "Elimina profilo", confirmMessage }: DeleteProfileButtonProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "deleting" | "error">("idle");

  async function handleDelete() {
    if (!window.confirm(confirmMessage ?? "Sei sicuro? Il profilo e il suo link smetteranno di funzionare subito.")) return;
    setStatus("deleting");
    try {
      const res = await fetch("/api/account/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profileId }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleDelete}
        disabled={status === "deleting"}
        className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
      >
        {status === "deleting" ? "Eliminazione…" : label}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400">Qualcosa è andato storto. Riprova.</p>
      )}
    </div>
  );
}

const DELETE_ACCOUNT_PHRASE = "ELIMINA";

// Permanently deletes the Supabase Auth user (and everything owned by it,
// via cascading foreign keys) — not just a profile. High-friction on
// purpose: a plain confirm() is too easy to click through by habit for
// something this irreversible, so this requires typing an exact phrase.
export function DeleteAccountButton() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "deleting" | "error">("idle");

  async function handleDelete() {
    const typed = window.prompt(
      `Questa azione è permanente e cancella account, profili e crediti senza possibilità di recupero.\n\nScrivi "${DELETE_ACCOUNT_PHRASE}" per confermare.`
    );
    if (typed !== DELETE_ACCOUNT_PHRASE) return;

    setStatus("deleting");
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (!res.ok) throw new Error();
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleDelete}
        disabled={status === "deleting"}
        className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
      >
        {status === "deleting" ? "Eliminazione account…" : "Elimina account permanentemente"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400">Qualcosa è andato storto. Riprova.</p>
      )}
    </div>
  );
}
