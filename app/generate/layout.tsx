import type { Metadata } from "next";

// Metadata lives here rather than in page.tsx because that page is a
// "use client" component — see app/start/layout.tsx for the same pattern.
export const metadata: Metadata = {
  title: "Genera il tuo profilo dal CV",
  description:
    "Carica il PDF del tuo curriculum: l'AI lo legge, gli assegna un punteggio su 4 criteri e genera una pagina profilo professionale, senza inventare nulla che non hai scritto.",
  alternates: { canonical: "/generate" },
};

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
