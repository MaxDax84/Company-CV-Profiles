// ─── Sotto-tipi ────────────────────────────────────────────────────────────

export interface PersonalInfo {
  full_name: string;
  title: string;               // es. "Senior Software Engineer"
  bio: string;                 // max ~200 caratteri
  bio_original?: string;       // frase originale dal CV, prima della riscrittura AI
  email_obfuscated: string;    // es. "m***@gmail.com" — usato sulla pagina web pubblica (anti-scraping)
  phone_obfuscated?: string;   // es. "+39 3** *** 1234" — usato sulla pagina web pubblica (anti-scraping)
  email?: string;              // reale, non oscurato — usato SOLO nel PDF scaricabile (mai sui template web pubblici)
  phone?: string;              // reale, non oscurato — usato SOLO nel PDF scaricabile (mai sui template web pubblici)
  location?: string;           // es. "Milano, IT"
  social_links: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
  };
}

export interface ExperienceItem {
  company: string;
  role: string;
  start_date: string;          // "2021-03" o "2021"
  end_date: string;            // "2024-01" o "present"
  description: string[];       // bullet points, uno per risultato/responsabilità reale nella fonte (fino a 6)
  technologies: string[];      // ["React", "Node.js"] — fino a 6
  location?: string;
}

export interface EducationItem {
  institution: string;
  degree: string;              // "Laurea Magistrale", "Bachelor's"
  field?: string;              // "Computer Science"
  start_year: number;
  end_year: number | "present";
  grade?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  url?: string;
}

export interface Skills {
  hard: string[];              // ["TypeScript", "Python", "SQL"]
  soft: string[];              // ["Leadership", "Problem solving"]
  tools: string[];             // ["Figma", "Docker", "Git"]
}

export interface Project {
  title: string;
  description: string;         // 1-2 frasi
  tags: string[];
  url?: string;
  image_placeholder: string;   // "gradient-1" … "gradient-8"
}

// ─── Metadata ──────────────────────────────────────────────────────────────

export type TemplateStyle = "alpha" | "beta" | "gamma" | "delta";

export interface Metadata {
  primary_color: string;       // hex: "#6366f1"
  template: TemplateStyle;
  language: "it" | "en";
  generated_at: string;        // ISO 8601
}

// ─── Schema completo ───────────────────────────────────────────────────────

export interface ProfileSchema {
  personal_info: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: Certification[];
  skills: Skills;
  projects: Project[];
  other?: string[];            // hobby, sport, volontariato, collaborazioni non professionali — tutto ciò che non rientra nelle sezioni sopra
  metadata: Metadata;
}
