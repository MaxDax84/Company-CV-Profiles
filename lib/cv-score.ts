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
