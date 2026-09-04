"use client";

import { useLanguage } from "@/components/language-provider";

export default function AccountSettingsHeader({ createdAt }: { createdAt: string }) {
  const { lang } = useLanguage();

  return (
    <div>
      <a href="/account" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
        {lang === "en" ? "← Back to dashboard" : "← Torna alla dashboard"}
      </a>
      <h1 className="font-heading text-2xl font-bold tracking-tight mt-2">
        {lang === "en" ? "Account settings" : "Impostazioni account"}
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        {lang === "en" ? "Member since" : "Membro da"} {new Date(createdAt).toLocaleDateString(lang === "en" ? "en-US" : "it-IT", { year: "numeric", month: "long", timeZone: "UTC" })}
      </p>
    </div>
  );
}
