"use client";

import { useState } from "react";
import { Globe, Lock } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface ProfileVisibilityToggleProps {
  profileId: string;
  initialIsPublic: boolean;
}

// Lets the owner take their own CV's public page offline without deleting
// the CV — see supabase/migrations/0018_profile_visibility.sql. Optimistic
// update (flips immediately, reverts on error) since this is a low-stakes,
// instantly-reversible toggle, not a destructive action worth a confirm step.
export default function ProfileVisibilityToggle({ profileId, initialIsPublic }: ProfileVisibilityToggleProps) {
  const { lang } = useLanguage();
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    const next = !isPublic;
    setIsPublic(next);
    setSaving(true);
    try {
      const res = await fetch("/api/account/set-profile-visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profileId, isPublic: next }),
      });
      if (!res.ok) setIsPublic(!next);
    } catch {
      setIsPublic(!next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={saving}
      className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      title={
        isPublic
          ? (lang === "en" ? "Anyone with the link can view this page" : "Chiunque abbia il link può vedere questa pagina")
          : (lang === "en" ? "Only you can view this page" : "Solo tu puoi vedere questa pagina")
      }
    >
      {isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
      {isPublic
        ? (lang === "en" ? "Public page" : "Pagina pubblica")
        : (lang === "en" ? "Private page" : "Pagina privata")}
    </button>
  );
}
