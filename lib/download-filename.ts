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
function positionLabel(profile: ProfileSchema): string {
  const { target_role, target_company } = profile.metadata;
  if (target_role && target_company) return `${target_role} - ${target_company}`;
  if (target_role) return target_role;
  if (target_company) return target_company;
  return profile.personal_info.title || "CV";
}

export function buildCvFilename(profile: ProfileSchema, templateName: string): string {
  return sanitize(
    `${profile.personal_info.full_name} - ${positionLabel(profile)} - ${templateName} - ${todayLabel()}.pdf`
  );
}

export function buildCoverLetterFilename(profile: ProfileSchema): string {
  return sanitize(
    `${profile.personal_info.full_name} - Lettera - ${positionLabel(profile)} - ${todayLabel()}.pdf`
  );
}
