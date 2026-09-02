"use client";

import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/costs", label: "Costi API" },
  { href: "/admin/users", label: "Utenti" },
  { href: "/admin/feedback", label: "Feedback" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-1 rounded-xl border border-foreground/10 p-1 w-fit">
      {TABS.map((tab) => (
        <a
          key={tab.href}
          href={tab.href}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          style={
            pathname === tab.href
              ? { background: "var(--primary)", color: "var(--primary-foreground)" }
              : { color: "var(--muted-foreground)" }
          }
        >
          {tab.label}
        </a>
      ))}
    </div>
  );
}
