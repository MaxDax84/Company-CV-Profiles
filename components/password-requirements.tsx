"use client";

import { useLanguage } from "@/components/language-provider";

interface Requirement {
  labelIt: string;
  labelEn: string;
  test: (password: string) => boolean;
}

const REQUIREMENTS: Requirement[] = [
  { labelIt: "Almeno 8 caratteri", labelEn: "At least 8 characters", test: (p) => p.length >= 8 },
  { labelIt: "Una lettera maiuscola", labelEn: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { labelIt: "Un numero", labelEn: "One number", test: (p) => /[0-9]/.test(p) },
  { labelIt: "Un carattere speciale (es. ! ? # % &)", labelEn: "One special character (e.g. ! ? # % &)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

// Shared by every "set a password" form (signup, reset, change) — kept as
// the single source of truth for the rule so the displayed checklist can
// never drift out of sync with what actually blocks submission.
export function isPasswordValid(password: string): boolean {
  return REQUIREMENTS.every((r) => r.test(password));
}

export default function PasswordRequirements({ password }: { password: string }) {
  const { lang } = useLanguage();
  return (
    <ul className="space-y-1 pt-1">
      {REQUIREMENTS.map((r) => {
        const met = r.test(password);
        const label = lang === "en" ? r.labelEn : r.labelIt;
        return (
          <li
            key={label}
            className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${met ? "text-green-600 dark:text-green-400" : "text-destructive"}`}
          >
            <span className="inline-flex w-3.5 shrink-0 justify-center">{met ? "✓" : "✗"}</span>
            <span>{label}</span>
          </li>
        );
      })}
    </ul>
  );
}
