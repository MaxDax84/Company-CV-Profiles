import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import type { ProfileSchema } from "@/lib/schema";

const DEMO_PROFILE: ProfileSchema = {
  personal_info: {
    full_name: "Marco Ferretti",
    title: "Senior Full-Stack Engineer",
    bio: "Ingegnere del software con 8 anni di esperienza nella costruzione di prodotti digitali scalabili. Appassionato di architetture cloud e developer experience.",
    email_obfuscated: "m***@gmail.com",
    phone_obfuscated: "+39 3** *** 4821",
    location: "Milano, IT",
    social_links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  experience: [
    {
      company: "Satispay",
      role: "Senior Software Engineer",
      start_date: "2021-03",
      end_date: "present",
      description: [
        "Progettato e sviluppato microservizi ad alta disponibilità in Node.js e Go",
        "Ridotto la latenza delle API di pagamento del 40% tramite ottimizzazione delle query",
        "Guidato un team di 4 sviluppatori su features critiche per il prodotto",
        "Introdotto pratiche di testing che hanno portato la coverage dal 45% al 87%",
      ],
      technologies: ["Node.js", "Go", "PostgreSQL", "Kafka", "Kubernetes"],
      location: "Milano",
    },
    {
      company: "Musixmatch",
      role: "Full-Stack Developer",
      start_date: "2018-06",
      end_date: "2021-02",
      description: [
        "Sviluppato il nuovo sistema di ingestion dei testi musicali in Python",
        "Costruito dashboard analytics interne in React con dati real-time",
        "Integrato API di terze parti (Spotify, Apple Music) per sincronizzazione dati",
      ],
      technologies: ["Python", "React", "TypeScript", "Redis", "Elasticsearch"],
      location: "Bologna",
    },
  ],
  education: [
    {
      institution: "Politecnico di Milano",
      degree: "Laurea Magistrale",
      field: "Ingegneria Informatica",
      start_year: 2013,
      end_year: 2018,
      grade: "110/110 con lode",
    },
  ],
  certifications: [
    {
      name: "AWS Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      year: 2022,
    },
    {
      name: "Certified Kubernetes Administrator",
      issuer: "CNCF",
      year: 2023,
    },
  ],
  skills: {
    hard: ["TypeScript", "Go", "Python", "SQL", "System Design", "REST APIs"],
    soft: ["Leadership", "Problem solving", "Comunicazione tecnica"],
    tools: ["Docker", "Kubernetes", "AWS", "Terraform", "Figma", "Git"],
  },
  projects: [
    {
      title: "OpenBudget",
      description: "App open source per la gestione delle finanze personali con categorizzazione automatica delle spese tramite ML.",
      tags: ["React", "Python", "ML"],
      url: "https://github.com",
      image_placeholder: "gradient-1",
    },
    {
      title: "StreamSync",
      description: "Libreria TypeScript per la sincronizzazione in tempo reale di stato distribuito via WebSocket.",
      tags: ["TypeScript", "WebSocket", "OSS"],
      url: "https://github.com",
      image_placeholder: "gradient-2",
    },
    {
      title: "DevPulse",
      description: "Dashboard per il monitoraggio della produttività dei team di sviluppo con integrazione GitHub e Jira.",
      tags: ["Next.js", "GitHub API", "Analytics"],
      image_placeholder: "gradient-3",
    },
  ],
  metadata: {
    primary_color: "#6366f1",
    template: "alpha",
    language: "it",
    generated_at: new Date().toISOString(),
  },
};

const DEMO_BETA: ProfileSchema = {
  ...DEMO_PROFILE,
  metadata: { ...DEMO_PROFILE.metadata, template: "beta", primary_color: "#4f46e5" },
}

const DEMO_GAMMA: ProfileSchema = {
  ...DEMO_PROFILE,
  metadata: { ...DEMO_PROFILE.metadata, template: "gamma", primary_color: "#10b981" },
}

const DEMO_DELTA: ProfileSchema = {
  ...DEMO_PROFILE,
  metadata: { ...DEMO_PROFILE.metadata, template: "delta", primary_color: "#c9a84c" },
}

export async function GET() {
  await Promise.all([
    kv.set("profile:marco-ferretti",       JSON.stringify(DEMO_PROFILE)),
    kv.set("profile:marco-ferretti-beta",  JSON.stringify(DEMO_BETA)),
    kv.set("profile:marco-ferretti-gamma", JSON.stringify(DEMO_GAMMA)),
    kv.set("profile:marco-ferretti-delta", JSON.stringify(DEMO_DELTA)),
  ])
  return NextResponse.json({
    ok: true,
    profiles: {
      alpha: "/profile/marco-ferretti",
      beta:  "/profile/marco-ferretti-beta",
      gamma: "/profile/marco-ferretti-gamma",
      delta: "/profile/marco-ferretti-delta",
    }
  });
}
