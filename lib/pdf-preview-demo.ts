// Fixed demo content shared by the 3 PDF-template preview thumbnails (see
// app/pdf-preview/[template]/page.tsx). Deliberately long enough to span
// roughly two A4-equivalent pages, so the auto-scroll thumbnail animation
// (borrowed from the web-template picker) has real content to reveal.
export const PDF_PREVIEW_ACCENT = "#6366f1";

export const PDF_PREVIEW_DEMO = {
  fullName: "Marco Ferretti",
  title: "Senior Product Manager",
  bio: "Product manager con 8 anni di esperienza nella guida di team cross-funzionali per la costruzione di prodotti SaaS B2B, dall'idea al lancio.",
  contact: "marco.ferretti@email.com   +39 333 1234567   Milano, IT",
  links: "LinkedIn   Portfolio",
  experience: [
    {
      role: "Head of Product",
      company: "Northstar Analytics — Milano",
      dates: "2022 – Presente",
      bullets: [
        "Guidato una squadra di 12 persone tra product, design e ricerca su 3 linee di prodotto",
        "Portato il tasso di attivazione utenti dal 34% al 61% in 18 mesi",
        "Definito la roadmap annuale allineata a obiettivi di revenue e retention",
      ],
      tech: "Roadmapping, Figma, SQL, Amplitude",
    },
    {
      role: "Senior Product Manager",
      company: "Vela Software — Torino",
      dates: "2019 – 2022",
      bullets: [
        "Lanciato 2 nuovi moduli prodotto, generando 1.4M€ di ARR incrementale",
        "Ridotto il time-to-market del 25% introducendo un processo di discovery continuo",
        "Coordinato ricerche utente con oltre 60 clienti enterprise",
      ],
      tech: "Jira, Mixpanel, A/B testing",
    },
    {
      role: "Product Manager",
      company: "Loop Digital — Torino",
      dates: "2016 – 2019",
      bullets: [
        "Gestito il ciclo di vita completo di un prodotto mobile con 200k utenti attivi",
        "Collaborato con engineering per ridurre i bug critici in produzione del 40%",
      ],
      tech: "Notion, Trello",
    },
  ],
  education: [
    { degree: "Laurea Magistrale — Ingegneria Gestionale", school: "Politecnico di Torino", dates: "2014 – 2016", grade: "110/110 con lode" },
    { degree: "Laurea Triennale — Ingegneria Gestionale", school: "Politecnico di Torino", dates: "2011 – 2014", grade: undefined as string | undefined },
  ],
  certifications: [
    "Certified Scrum Product Owner (CSPO) — Scrum Alliance, 2021",
    "Product Management Certificate — Reforge, 2020",
  ],
  skills: {
    hard: "Product Strategy, Roadmapping, Data Analysis, A/B Testing, SQL",
    tools: "Figma, Jira, Amplitude, Notion, Linear",
    soft: "Leadership, Comunicazione, Negoziazione",
  },
} as const;
