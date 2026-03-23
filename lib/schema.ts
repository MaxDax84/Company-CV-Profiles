// ─── Sotto-tipi ────────────────────────────────────────────────────────────

export interface PersonalInfo {
  full_name: string;
  title: string;               // es. "Senior Software Engineer"
  bio: string;                 // max ~200 caratteri
  email_obfuscated: string;    // es. "m***@gmail.com"
  phone_obfuscated?: string;   // es. "+39 3** *** 1234"
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
  description: string[];       // bullet points, max 4 voci
  technologies: string[];      // ["React", "Node.js"]
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
  metadata: Metadata;
}
