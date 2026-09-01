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

// The position/company a CV or letter is FOR — the whole point of a
// descriptive filename in the Download list, where someone with several CVs
// needs to tell them apart without opening each one. Only tailored profiles
// carry target_role/target_company; a primary (not-yet-adapted) CV falls
// back to the person's own current title, since there's no target position
// to name.
export function positionLabel(profile: ProfileSchema): string {
  const { target_role, target_company } = profile.metadata;
  if (target_role && target_company) return `${target_role} - ${target_company}`;
  if (target_role) return target_role;
  if (target_company) return target_company;
  return profile.personal_info.title || "CV";
}

// CV-only variant of positionLabel: a CV not adapted to any specific job
// posting (no target_role/target_company) identifies itself by its own name
// — the same editable name shown as "Nome del CV caricato" on /account — not
// by a guessed job title, which reads as noise once you already know your
// own title. Tailored CVs are unaffected: they still label by role/company.
export function cvLabel(profile: ProfileSchema, cvName: string): string {
  const { target_role, target_company } = profile.metadata;
  if (target_role || target_company) return positionLabel(profile);
  return cvName;
}

export function buildCvFilename(profile: ProfileSchema, templateName: string, cvName: string): string {
  return sanitize(
    `${profile.personal_info.full_name} - ${cvLabel(profile, cvName)} - ${templateName} - ${todayLabel()}.pdf`
  );
}

export function buildCvWordFilename(profile: ProfileSchema, cvName: string): string {
  return sanitize(
    `${profile.personal_info.full_name} - ${cvLabel(profile, cvName)} - ${todayLabel()}.docx`
  );
}

export function buildCoverLetterFilename(profile: ProfileSchema, cvName: string): string {
  return sanitize(
    `${profile.personal_info.full_name} - Lettera - ${cvLabel(profile, cvName)} - ${todayLabel()}.pdf`
  );
}

export function buildInterviewPrepFilename(companyName: string | null): string {
  return sanitize(`Colloquio - ${companyName ?? "Preparazione"} - ${todayLabel()}.pdf`);
}
