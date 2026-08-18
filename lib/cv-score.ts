import type { ProfileSchema } from "./schema";

// The 4-criteria CV score shown on /generate: how strong the profile is,
// 0-25 per criterion, 100 total. Computed deterministically from a
// ProfileSchema — both "before" (the freshly-extracted, unpolished profile)
// and "after" (post-improveResume) run through this exact same function, so
// the comparison is always apples-to-apples and free/instant either way.
// (An earlier version judged "before" via a separate subjective AI read of
// the raw PDF — that let the two scores diverge for reasons that had
// nothing to do with what improveResume() actually changed, which read as
// the app randomly "losing" good content. Never re-introduce a second
// scoring method for one side of this comparison.)
//
// Deliberately strict, not graded on a curve: that AI-judged predecessor
// carried an explicit rubric ("most real CVs, even genuinely good ones,
// should land 30-65 per criterion; 80+ reserved for near-exceptional") that
// got lost when scoring moved to plain presence checks below — a CV could
// max out 3 of 4 criteria just by having *some* bio/skills/contact info,
// regardless of actual depth. The thresholds below restore that severity
// while staying 100% deterministic (no AI judgment re-enters the "before"
// score, so the consistency guarantee above still holds).
export interface CvScoreBreakdown {
  quantifiedResults: number;
  clarity: number;
  atsStructure: number;
  specificSkills: number;
  total: number;
}

const HAS_NUMBER = /\d/;

function scoreQuantifiedResults(profile: ProfileSchema): number {
  const bullets = profile.experience.flatMap((e) => e.description);
  if (bullets.length === 0) return 0;
  const withNumbers = bullets.filter((b) => HAS_NUMBER.test(b)).length;
  return Math.round((withNumbers / bullets.length) * 25);
}

function scoreClarity(profile: ProfileSchema): number {
  const bio = profile.personal_info.bio?.trim() ?? "";
  if (!bio) return 0;
  // bio_original is omitted by extraction when the source CV had no
  // self-description at all to draw from (see lib/parse-resume.ts) — but
  // even when present, a one-line qualification/job title copied verbatim
  // isn't a real positioning statement either. Only count it as genuine
  // "own voice" once it reads like an actual summary sentence, not a title.
  const original = profile.personal_info.bio_original?.trim() ?? "";
  const hasSubstantiveVoice = original.length >= 50;
  let score = hasSubstantiveVoice ? 8 : 3;
  if (bio.length >= 60 && bio.length <= 140) score += 10;
  else if (bio.length >= 30 && bio.length <= 180) score += 5;
  if (profile.personal_info.title?.trim()) score += 7;
  return Math.max(0, Math.min(25, score));
}

function scoreAtsStructure(profile: ProfileSchema): number {
  // Raised from a bare >0 presence check on every item — passing "you have
  // at least one skill" was trivial to clear regardless of how thin the CV
  // actually was. A real skills/certifications section reads as more than
  // one or two scattered entries.
  const checks = [
    profile.skills.hard.length >= 3,
    profile.skills.tools.length >= 2,
    profile.education.length > 0,
    profile.certifications.length >= 2 || profile.projects.length >= 2,
    Boolean(profile.personal_info.email_obfuscated) &&
      (Boolean(profile.personal_info.phone_obfuscated) || Boolean(profile.personal_info.social_links.linkedin)),
  ];
  return checks.filter(Boolean).length * 5;
}

function scoreSpecificSkills(profile: ProfileSchema): number {
  const unique = new Set(
    [...profile.skills.hard, ...profile.skills.tools].map((s) => s.toLowerCase().trim())
  );
  // Cap raised from 10 to 14 — hitting 10 unique skills/tools was common
  // enough (including generic ones) to max this criterion too easily.
  // Full marks now reserved for a genuinely skill-dense profile.
  return Math.round((Math.min(unique.size, 14) / 14) * 25);
}

export function computeCvScore(profile: ProfileSchema): CvScoreBreakdown {
  const quantifiedResults = scoreQuantifiedResults(profile);
  const clarity = scoreClarity(profile);
  const atsStructure = scoreAtsStructure(profile);
  const specificSkills = scoreSpecificSkills(profile);
  return {
    quantifiedResults,
    clarity,
    atsStructure,
    specificSkills,
    total: quantifiedResults + clarity + atsStructure + specificSkills,
  };
}

// Applied to the "after" (post-improveResume) score against the AI-judged
// "before" score: per-criterion, "after" can only stay level or rise, never
// drop below "before" — optimizing a CV must never make its displayed score
// go down, even if the deterministic after-check happens to read a specific
// criterion slightly more harshly than the subjective before-judgment did.
export function floorScoreAgainst(after: CvScoreBreakdown, before: CvScoreBreakdown | null | undefined): CvScoreBreakdown {
  if (!before) return after;
  const quantifiedResults = Math.max(after.quantifiedResults, before.quantifiedResults);
  const clarity = Math.max(after.clarity, before.clarity);
  const atsStructure = Math.max(after.atsStructure, before.atsStructure);
  const specificSkills = Math.max(after.specificSkills, before.specificSkills);
  return {
    quantifiedResults,
    clarity,
    atsStructure,
    specificSkills,
    total: quantifiedResults + clarity + atsStructure + specificSkills,
  };
}
