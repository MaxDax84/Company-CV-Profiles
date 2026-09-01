"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useLanguage } from "@/components/language-provider";

interface LifecycleEmailsToggleProps {
  userId: string;
  initialOptedOut: boolean;
}

// In-app counterpart to the one-click unsubscribe link in the lifecycle
// emails themselves (welcome, zero-balance, inactivity reminder — see
// lib/email.ts and app/api/account/unsubscribe/route.ts) — legal audit
// finding: a recipient must be able to opt out "easily", which includes
// being able to turn it back on without needing another email to arrive
// first. Writes directly to account_settings via the browser client, same
// pattern as AvatarUploadForm — the table's own RLS policy already allows
// an owner to write their own row.
export default function LifecycleEmailsToggle({ userId, initialOptedOut }: LifecycleEmailsToggleProps) {
  const [optedOut, setOptedOut] = useState(initialOptedOut);
  const [saving, setSaving] = useState(false);
  const { lang } = useLanguage();
  const tr = (it: string, en: string) => (lang === "en" ? en : it);

  async function toggle() {
    const next = !optedOut;
    setSaving(true);
    setOptedOut(next); // optimistic — this is a simple preference, not worth a loading flash
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase
      .from("account_settings")
      .upsert({ user_id: userId, lifecycle_emails_opt_out: next }, { onConflict: "user_id" });
    if (error) {
      console.error("[LifecycleEmailsToggle]", error);
      setOptedOut(!next); // revert on failure
    }
    setSaving(false);
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs text-muted-foreground pr-2">
        {tr(
          "Email di benvenuto, avviso crediti esauriti e promemoria di inattività.",
          "Welcome, zero-credits, and inactivity reminder emails."
        )}
      </p>
      <button
        type="button"
        onClick={toggle}
        disabled={saving}
        role="switch"
        aria-checked={!optedOut}
        aria-label={tr("Ricevi email sull'account", "Receive account emails")}
        className="relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 disabled:opacity-60"
        style={{ background: optedOut ? "var(--border)" : "var(--primary)" }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: optedOut ? "translateX(0)" : "translateX(20px)" }}
        />
      </button>
    </div>
  );
}
