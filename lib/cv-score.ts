import type { ProfileSchema } from "./schema";
import type { CvScoreBeforeRaw } from "./parse-resume";

// The 4-criteria CV score shown on /generate: how strong the profile is,
// 0-25 per criterion, 100 total. "Before" (the raw source CV) is judged by
// Claude directly from the PDF during extraction — see the cv_score_before
// prompt block in lib/parse-resume.ts, since only the model can honestly
// assess the *original* document's structure. "After" (this file) is
// computed deterministically from the final structured profile, so it's
// free, instant, and can never drift from what's actually in the data.
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
  let score = 15;
  if (bio.length >= 50 && bio.length <= 150) score += 10;
  else if (bio.length >= 20 && bio.length <= 200) score += 5;
  if (!profile.personal_info.title?.trim()) score -= 5;
  return Math.max(0, Math.min(25, score));
}

function scoreAtsStructure(profile: ProfileSchema): number {
  const checks = [
    profile.skills.hard.length > 0,
    profile.skills.tools.length > 0,
    profile.education.length > 0,
    profile.certifications.length > 0 || profile.projects.length > 0,
    Boolean(profile.personal_info.email_obfuscated) &&
      (Boolean(profile.personal_info.phone_obfuscated) || Boolean(profile.personal_info.social_links.linkedin)),
  ];
  return checks.filter(Boolean).length * 5;
}

function scoreSpecificSkills(profile: ProfileSchema): number {
  const unique = new Set(
    [...profile.skills.hard, ...profile.skills.tools].map((s) => s.toLowerCase().trim())
  );
  return Math.round((Math.min(unique.size, 10) / 10) * 25);
}

// Claude returns the raw 4 sub-scores for the source CV — this just adds up
// the total in code rather than trusting the model's own arithmetic.
export function normalizeScoreBefore(raw: CvScoreBeforeRaw | null): CvScoreBreakdown | null {
  if (!raw) return null;
  const clamp = (n: number) => Math.max(0, Math.min(25, Math.round(n)));
  const quantifiedResults = clamp(raw.quantified_results);
  const clarity = clamp(raw.clarity);
  const atsStructure = clamp(raw.ats_structure);
  const specificSkills = clamp(raw.specific_skills);
  return {
    quantifiedResults,
    clarity,
    atsStructure,
    specificSkills,
    total: quantifiedResults + clarity + atsStructure + specificSkills,
  };
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
