import type { Metadata } from "next";

// Metadata lives here rather than in page.tsx because that page is a
// "use client" component — see app/start/layout.tsx for the same pattern.
export const metadata: Metadata = {
  title: "Domande frequenti",
  description:
    "Come funziona Jobli, come viene calcolato il punteggio del CV, cosa sono i crediti, come vengono trattati i tuoi dati e come si cancella un account.",
  alternates: { canonical: "/faq" },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
