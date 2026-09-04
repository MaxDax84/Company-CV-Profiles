import type { ProfileSchema } from "./schema";

// Characters invalid (or awkward) in a downloaded filename across
// Windows/macOS — stripped rather than escaped, since a filename is read at
// a glance, not parsed.
function sanitize(s: string): string {
  return s.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, " ").trim();
}

function todayLabel(): string {
  return new Date().toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

// The position/company a CV or letter is FOR — used as the default value of
// profiles.display_name when a row is first created (see
// lib/profile-store.ts), so a tailored CV starts out named after the job it
// targets rather than something technical. Only tailored profiles carry
// target_role/target_company; a primary (not-yet-adapted) CV falls back to
// the person's own current title, since there's no target position to name.
export function positionLabel(profile: ProfileSchema): string {
  const { target_role, target_company } = profile.metadata;
  if (target_role && target_company) return `${target_role} - ${target_company}`;
  if (target_role) return target_role;
  if (target_company) return target_company;
  return profile.personal_info.title || "CV";
}

// Reads as a name and a description, not a row of tags — one comma to
// attach the role, one trailing dash before the date. The template name
// (Alpha/Beta/...) used to appear here too; dropped as pure clutter for a
// downloaded file's name, since it's already visible inside the PDF itself.
// `displayName` is the CV's own chosen name (profiles.display_name) — a
// human label the owner picked (or that defaulted to positionLabel() at
// creation, see lib/profile-store.ts), never the technical URL slug.
export function buildCvFilename(profile: ProfileSchema, displayName: string): string {
  return sanitize(
    `${profile.personal_info.full_name}, ${displayName} - ${todayLabel()}.pdf`
  );
}

export function buildCvWordFilename(profile: ProfileSchema, displayName: string): string {
  return sanitize(
    `${profile.personal_info.full_name}, ${displayName} - ${todayLabel()}.docx`
  );
}

export function buildCoverLetterFilename(profile: ProfileSchema, displayName: string): string {
  return sanitize(
    `${profile.personal_info.full_name}, Lettera ${displayName} - ${todayLabel()}.pdf`
  );
}

// Matches the report's own content language (see lib/interview-prep.ts's
// LANGUAGE_NAMES) — a candidate who picked English for the report shouldn't
// get an Italian filename back.
const INTERVIEW_PREP_FILENAME_LABELS: Record<string, { title: string; fallback: string; locale: string }> = {
  it: { title: "Colloquio", fallback: "Preparazione", locale: "it-IT" },
  en: { title: "Interview", fallback: "Preparation", locale: "en-US" },
  es: { title: "Entrevista", fallback: "Preparación", locale: "es-ES" },
  fr: { title: "Entretien", fallback: "Préparation", locale: "fr-FR" },
  de: { title: "Vorstellungsgespräch", fallback: "Vorbereitung", locale: "de-DE" },
  pt: { title: "Entrevista", fallback: "Preparação", locale: "pt-PT" },
};

export function buildInterviewPrepFilename(companyName: string | null, language?: string): string {
  const l = INTERVIEW_PREP_FILENAME_LABELS[language ?? "it"] ?? INTERVIEW_PREP_FILENAME_LABELS.it;
  const dateLabel = new Date().toLocaleDateString(l.locale, { day: "numeric", month: "long", year: "numeric" });
  return sanitize(`${l.title}, ${companyName ?? l.fallback} - ${dateLabel}.pdf`);
}
