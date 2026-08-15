"use client";

interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

const REQUIREMENTS: Requirement[] = [
  { label: "Almeno 8 caratteri", test: (p) => p.length >= 8 },
  { label: "Una lettera maiuscola", test: (p) => /[A-Z]/.test(p) },
  { label: "Un numero", test: (p) => /[0-9]/.test(p) },
  { label: "Un carattere speciale (es. ! ? # % &)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

// Shared by every "set a password" form (signup, reset, change) — kept as
// the single source of truth for the rule so the displayed checklist can
// never drift out of sync with what actually blocks submission.
export function isPasswordValid(password: string): boolean {
  return REQUIREMENTS.every((r) => r.test(password));
}

export default function PasswordRequirements({ password }: { password: string }) {
  return (
    <ul className="space-y-1 pt-1">
      {REQUIREMENTS.map((r) => {
        const met = r.test(password);
        return (
          <li
            key={r.label}
            className="flex items-center gap-1.5 text-xs transition-colors duration-200"
            style={{ color: met ? "#16a34a" : "#dc2626" }}
          >
            <span className="inline-flex w-3.5 shrink-0 justify-center">{met ? "✓" : "✗"}</span>
            <span>{r.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
