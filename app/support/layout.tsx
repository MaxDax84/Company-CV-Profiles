import type { Metadata } from "next";

// Metadata lives here rather than in page.tsx because that page is a
// "use client" component — see app/start/layout.tsx for the same pattern.
export const metadata: Metadata = {
  title: "Supporto",
  description:
    "Assistenza Jobli: domande su account, crediti, privacy e cancellazione dei dati, più un modulo per contattarci direttamente.",
  alternates: { canonical: "/support" },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
