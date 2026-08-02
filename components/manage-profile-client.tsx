"use client";

import { useState } from "react";
import type { ProfileSchema, TemplateStyle } from "@/lib/schema";
import { TEMPLATE_COLORS, TEMPLATE_STYLES } from "@/lib/templates";
import { translations } from "@/lib/i18n";

const TEMPLATE_NAMES: Record<TemplateStyle, string> = {
  alpha: "Alpha",
  beta: "Beta",
  gamma: "Gamma",
  delta: "Delta",
};

interface Props {
  token: string;
  slug: string;
  profile: ProfileSchema;
}

type Status = "idle" | "updating" | "deleting" | "deleted" | "error";

export default function ManageProfileClient({ token, slug, profile: initialProfile }: Props) {
  const [profile, setProfile] = useState(initialProfile);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const lang = profile.metadata.language;
  const t = translations[lang].manage;
  const tTemplates = translations[lang].generate.templates;
  const accent = profile.metadata.primary_color;

  async function changeTemplate(template: TemplateStyle) {
    if (template === profile.metadata.template || status === "updating") return;
    setStatus("updating");
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/manage/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t.genericError);
      setProfile(data.profile);
      setStatus("idle");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t.genericError);
      setStatus("error");
    }
  }

  async function deleteProfile() {
    if (!window.confirm(t.deleteConfirm)) return;
    setStatus("deleting");
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/manage/${token}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? t.genericError);
      }
      setStatus("deleted");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t.genericError);
      setStatus("error");
    }
  }

  if (status === "deleted") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
        <div className="max-w-md text-center space-y-4">
          <div className="text-4xl">✅</div>
          <h1 className="text-xl font-semibold">{t.deletedTitle}</h1>
          <p className="text-sm text-muted-foreground">{t.deletedSubtitle}</p>
          <a href="/" className="inline-block text-sm text-primary hover:underline">{t.backHome}</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-16">
      <div className="max-w-lg mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-1 text-center">
          <p className="font-semibold">{profile.personal_info.full_name}</p>
          <p className="text-sm text-muted-foreground">{profile.personal_info.title}</p>
          <a
            href={`/profile/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm font-medium hover:underline"
            style={{ color: accent }}
          >
            {t.viewProfile}
          </a>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            {t.templateSectionTitle}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TEMPLATE_STYLES.map((id) => {
              const isCurrent = id === profile.metadata.template;
              const templateAccent = TEMPLATE_COLORS[id];
              return (
                <button
                  key={id}
                  onClick={() => changeTemplate(id)}
                  disabled={status === "updating"}
                  className="rounded-2xl border-2 p-3 text-left transition-all disabled:opacity-50"
                  style={{
                    borderColor: isCurrent ? templateAccent : "rgba(255,255,255,0.08)",
                    boxShadow: isCurrent ? `0 0 0 1px ${templateAccent}` : "none",
                  }}
                >
                  <p className="text-xs font-bold tracking-widest" style={{ color: templateAccent }}>
                    {TEMPLATE_NAMES[id].toUpperCase()}
                  </p>
                  <p className="text-[10px] text-foreground/50 mt-1">{tTemplates[id]}</p>
                  {isCurrent && <p className="text-[10px] mt-1" style={{ color: templateAccent }}>{t.currentTemplate}</p>}
                </button>
              );
            })}
          </div>
          {status === "updating" && <p className="text-xs text-muted-foreground/60">{t.updating}</p>}
        </div>

        {errorMsg && (
          <p className="text-sm text-red-400 text-center">{errorMsg}</p>
        )}

        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400/80">{t.dangerZone}</p>
          <button
            onClick={deleteProfile}
            disabled={status === "deleting"}
            className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
          >
            {status === "deleting" ? t.deleting : t.deleteButton}
          </button>
        </div>

        <div className="text-center">
          <a href="/" className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">
            {t.backHome}
          </a>
        </div>
      </div>
    </div>
  );
}
