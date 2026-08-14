import type { ProfileSchema } from "./schema";

// Extracted dates come straight from AI parsing of arbitrary CV text and can be
// in any format ("2017", "Luglio 2017", "07/2017", ...). Never assume a fixed
// shape — pull out the first 4-digit year we can find, or treat it as unknown.
function extractYear(dateStr: string): number | null {
  const match = dateStr.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : null;
}

// Earliest experience start year, or null if none of the entries have a
// recognizable year. Callers must hide the stat entirely when null — never
// fall back to a sentinel value, which would render as bogus data.
export function earliestStartYear(experience: ProfileSchema["experience"]): number | null {
  const years = experience.map(e => extractYear(e.start_date)).filter((y): y is number => y !== null);
  return years.length ? Math.min(...years) : null;
}

// "8+" years of experience since the earliest recognizable start year, or
// null if unknown — callers should omit the stat rather than show "—" or a
// nonsensical figure derived from missing data.
export function yearsOfExperience(experience: ProfileSchema["experience"]): string | null {
  const earliest = earliestStartYear(experience);
  if (earliest === null) return null;
  const years = new Date().getFullYear() - earliest;
  return years >= 0 ? `${years}+` : null;
}

// "2018 – 2021", "2021", "Present", or "" (never a bare "–") depending on
// which of start_year/end_year the source CV actually stated — a template
// that instead interpolates `{start} – {end}` directly renders a dangling
// dash the moment either side is missing, which reads as a data error.
export function formatEducationYearRange(
  start: number | undefined,
  end: number | "present" | undefined
): string {
  const startStr = start != null ? String(start) : "";
  const endStr = end === "present" ? "Present" : end != null ? String(end) : "";
  if (startStr && endStr) return `${startStr} – ${endStr}`;
  return startStr || endStr;
}
