import type { Metadata } from "next";

// app/start/page.tsx is a "use client" component, and a client component
// cannot export `metadata` — Next.js silently ignores it. A sibling layout
// is the standard escape hatch (same trick as app/showcase/layout.tsx):
// the layout is a server component, so its metadata export is honoured, and
// it renders nothing of its own.
export const metadata: Metadata = {
  title: "Inizia gratis",
  description:
    "Carica il PDF del tuo CV e in meno di un minuto ottieni il punteggio, una pagina profilo pronta da condividere e un CV ottimizzato per gli ATS. 3 crediti gratis alla registrazione.",
  alternates: { canonical: "/start" },
};

export default function StartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
