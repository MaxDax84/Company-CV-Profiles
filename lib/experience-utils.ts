import type { ProfileSchema } from "./schema";

// Extracted dates come straight from AI parsing of arbitrary CV text and can be
// in any format ("2017", "Luglio 2017", "07/2017", ...). Never assume a fixed
// shape — pull out the first 4-digit year we can find, or treat it as unknown.
function extractYear(dateStr: string): number | null {
  const match = dateStr.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : null;
}

// Best-effort month (1-12) alongside extractYear — same "never assume a fixed
// shape" caveat. Falls back to null (caller defaults to mid-year) rather than
// guessing when nothing recognizable is found, since a wrong guess in either
// direction is no better than an unbiased default.
const MONTH_PATTERNS: [RegExp, number][] = [
  [/\bgen(?:naio)?\.?\b|\bjan(?:uary)?\.?\b/i, 1],
  [/\bfeb(?:braio)?\.?\b|\bfebruary\.?\b/i, 2],
  [/\bmar(?:zo)?\.?\b|\bmarch\.?\b/i, 3],
  [/\bapr(?:ile)?\.?\b|\bapril\.?\b/i, 4],
  [/\bmag(?:gio)?\.?\b|\bmay\.?\b/i, 5],
  [/\bgiu(?:gno)?\.?\b|\bjune?\.?\b/i, 6],
  [/\blug(?:lio)?\.?\b|\bjuly?\.?\b/i, 7],
  [/\bago(?:sto)?\.?\b|\baug(?:ust)?\.?\b/i, 8],
  [/\bset(?:tembre)?\.?\b|\bsep(?:t(?:ember)?)?\.?\b/i, 9],
  [/\bott(?:obre)?\.?\b|\boct(?:ober)?\.?\b/i, 10],
  [/\bnov(?:embre)?\.?\b|\bnovember\.?\b/i, 11],
  [/\bdic(?:embre)?\.?\b|\bdec(?:ember)?\.?\b/i, 12],
];
function extractMonth(dateStr: string): number | null {
  // Numeric "MM/YYYY" or "YYYY-MM" takes priority over name matching.
  const numeric = dateStr.match(/\b(\d{1,2})[\/\-]\d{4}\b/) ?? dateStr.match(/\b\d{4}[\/\-](\d{1,2})\b/);
  if (numeric) {
    const m = parseInt(numeric[1], 10);
    if (m >= 1 && m <= 12) return m;
  }
  for (const [pattern, month] of MONTH_PATTERNS) {
    if (pattern.test(dateStr)) return month;
  }
  return null;
}

const PRESENT_PATTERN = /present|current|oggi|attuale|in corso/i;

// Fractional-year point on the timeline (e.g. "Luglio 2017" -> 2017.5) so
// summing/merging date ranges below isn't stuck at whole-year precision —
// month unknown falls back to mid-year (6) rather than January, so it
// doesn't systematically over- or under-count in either direction.
function toFractionalYear(dateStr: string): number | null {
  const year = extractYear(dateStr);
  if (year === null) return null;
  const month = extractMonth(dateStr) ?? 6;
  return year + (month - 1) / 12;
}

// Earliest CAREER experience start year ("career started" stat in the
// templates), or null if none of the qualifying entries have a recognizable
// year. Ignores entries marked `is_career_experience: false` (see
// yearsOfExperience below) for the same reason: a teenage summer job
// shouldn't get to claim it's when someone's career began. Missing the
// field (pre-existing CVs) defaults to counting the entry.
export function earliestStartYear(experience: ProfileSchema["experience"]): number | null {
  const years = experience
    .filter(e => e.is_career_experience !== false)
    .map(e => extractYear(e.start_date))
    .filter((y): y is number => y !== null);
  return years.length ? Math.min(...years) : null;
}

// "8+" years of REAL career experience, or null if there isn't enough
// unambiguous data to say anything — callers should omit the stat rather
// than show "0+" or a nonsensical figure. Two corrections on top of a naive
// "current year minus earliest start year" span (which is what this used to
// do, and which is easy to blow up: a single teenage summer job or a
// months-long internship listed years before someone's real career started
// would inflate the total by every year in between, employed or not):
//
// 1. Entries the extractor marked as `is_career_experience: false` (a
//    seasonal/summer/student job unrelated to an ongoing career, per the
//    parse-resume system prompt) are excluded from the sum entirely, not
//    just from the display — a summer job doesn't get to define when
//    someone's "real" career started. Missing the field at all (every CV
//    parsed before this was added) defaults to counting it, so existing
//    profiles don't lose their stat until re-uploaded.
// 2. The remaining entries' date RANGES are summed and merged (not just
//    "latest minus earliest"), so overlapping roles don't double-count and
//    gaps between roles (career breaks, education-only years) don't
//    silently inflate the total the way a bare calendar span would.
export function yearsOfExperience(experience: ProfileSchema["experience"]): string | null {
  const now = new Date();
  const nowFractional = now.getFullYear() + now.getMonth() / 12;

  const intervals = experience
    .filter(e => e.is_career_experience !== false)
    .map(e => {
      const start = toFractionalYear(e.start_date);
      if (start === null) return null;
      const end = PRESENT_PATTERN.test(e.end_date) ? nowFractional : (toFractionalYear(e.end_date) ?? start);
      return { start, end: Math.max(start, end) };
    })
    .filter((i): i is { start: number; end: number } => i !== null)
    .sort((a, b) => a.start - b.start);

  if (intervals.length === 0) return null;

  let totalYears = 0;
  let mergedEnd = intervals[0].end;
  let mergedStart = intervals[0].start;
  for (let i = 1; i < intervals.length; i++) {
    const cur = intervals[i];
    if (cur.start <= mergedEnd) {
      mergedEnd = Math.max(mergedEnd, cur.end);
    } else {
      totalYears += mergedEnd - mergedStart;
      mergedStart = cur.start;
      mergedEnd = cur.end;
    }
  }
  totalYears += mergedEnd - mergedStart;

  const years = Math.floor(totalYears);
  return years >= 1 ? `${years}+` : null;
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
