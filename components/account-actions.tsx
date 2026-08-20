"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useLanguage } from "@/components/language-provider";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { lang } = useLanguage();

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
      {loading ? (lang === "en" ? "Signing out…" : "Uscita…") : (lang === "en" ? "Log out" : "Esci")}
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
export function DeleteProfileButton({ profileId, label, confirmMessage }: DeleteProfileButtonProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "deleting" | "error">("idle");
  const { lang } = useLanguage();
  const resolvedLabel = label ?? (lang === "en" ? "Delete profile" : "Elimina profilo");

  async function handleDelete() {
    if (!window.confirm(confirmMessage ?? (lang === "en" ? "Are you sure? The profile and its link will stop working immediately." : "Sei sicuro? Il profilo e il suo link smetteranno di funzionare subito."))) return;
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
        className="text-xs text-destructive hover:text-destructive/80 transition-colors disabled:opacity-50"
      >
        {status === "deleting" ? (lang === "en" ? "Deleting…" : "Eliminazione…") : resolvedLabel}
      </button>
      {status === "error" && (
        <p className="text-xs text-destructive">{lang === "en" ? "Something went wrong. Try again." : "Qualcosa è andato storto. Riprova."}</p>
      )}
    </div>
  );
}

// Permanently deletes the Supabase Auth user (and everything owned by it,
// via cascading foreign keys) — not just a profile. High-friction on
// purpose: a plain confirm() is too easy to click through by habit for
// something this irreversible, so this requires typing an exact phrase.
export function DeleteAccountButton() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "deleting" | "error">("idle");
  const { lang } = useLanguage();
  const deletePhrase = lang === "en" ? "DELETE" : "ELIMINA";

  async function handleDelete() {
    const typed = window.prompt(
      lang === "en"
        ? `This action is permanent and erases your account, profiles, and credits with no way to recover them.\n\nType "${deletePhrase}" to confirm.`
        : `Questa azione è permanente e cancella account, profili e crediti senza possibilità di recupero.\n\nScrivi "${deletePhrase}" per confermare.`
    );
    if (typed !== deletePhrase) return;

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
        className="text-xs font-semibold text-destructive hover:text-destructive/80 transition-colors disabled:opacity-50"
      >
        {status === "deleting"
          ? (lang === "en" ? "Deleting account…" : "Eliminazione account…")
          : (lang === "en" ? "Permanently delete account" : "Elimina account permanentemente")}
      </button>
      {status === "error" && (
        <p className="text-xs text-destructive">{lang === "en" ? "Something went wrong. Try again." : "Qualcosa è andato storto. Riprova."}</p>
      )}
    </div>
  );
}
