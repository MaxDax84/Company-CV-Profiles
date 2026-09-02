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
  // false for a seasonal/summer/short student job unrelated to an ongoing
  // career (see the parse-resume system prompt for the exact criteria) —
  // excluded from the "years of experience" stat in lib/experience-utils.ts
  // so it can't inflate that number the way a real role would. Optional
  // (not every writer of a ProfileSchema sets it) and missing/undefined
  // counts the entry as real experience, so CVs parsed before this field
  // existed don't lose their stat.
  is_career_experience?: boolean;
}

export interface EducationItem {
  institution: string;
  degree: string;              // "Laurea Magistrale", "Bachelor's"
  field?: string;              // "Computer Science"
  start_year?: number;
  end_year?: number | "present";
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
  // "it"/"en" drive actual UI-chrome branching in the templates (section
  // labels etc, e.g. `language === "it" ? "Esperienza" : "Experience"`) —
  // any other value gracefully falls into the English branch. Widened from
  // a strict "it" | "en" union to support lib/translate-resume.ts producing
  // a translated profile in an arbitrary target language: the CV's own
  // *content* is genuinely translated regardless of this value, only the
  // template's own static labels don't have full localization yet.
  language: string;
  generated_at: string;        // ISO 8601
  target_company?: string;     // tailored profiles only — hiring company, if named in the job posting
  target_role?: string;        // tailored profiles only — job title, if named in the job posting
  suggested_titles?: string[]; // job titles this person is qualified for, from extraction — shown per-CV in the account
  // The AI's subjective, deliberately strict judgment of the SOURCE CV
  // (see CvScoreBeforeRaw in lib/parse-resume.ts) — embedded here so it
  // travels with the profile through the permanent PDF-hash memory
  // (lib/cv-score-memory.ts) and survives improveResume()'s "copy metadata
  // unchanged" pass. The "after" score is the deterministic computeCvScore()
  // (lib/cv-score.ts), floored per-criterion against this so optimizing a
  // CV can never make its displayed score go down, only stay level or rise.
  score_before?: import("./cv-score").CvScoreBreakdown;
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
