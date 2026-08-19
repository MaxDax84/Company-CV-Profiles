import type { ProfileSchema } from "./schema";

// The 4-criteria CV score shown on /generate: how strong the profile is,
// 0-25 per criterion, 100 total. computeCvScore() below is the deterministic
// half: it's what always computes "after" (post-improveResume), and it's
// also what backfills a missing "before" (see reconstructScoreBefore).
//
// "before" itself, though, is normally an AI-judged score computed once at
// extraction time (lib/parse-resume.ts's cv_score_before, carried on
// profile.metadata.score_before) — a genuinely subjective, severity-rubric
// read of the CV as originally written, not this file's own presence-check
// formula. floorScoreAgainst() below then guarantees "after" can only match
// or beat that judged "before" per criterion, never fall below it. Only
// reconstructScoreBefore() falls back to scoring deterministically for
// "before" too, and only when the real AI judgment is missing.
//
// The thresholds below are deliberately strict, not graded on a curve: an
// earlier fully-deterministic design (no AI judgment at all, presence
// checks only) let a CV max out 3 of 4 criteria just by having *some*
// bio/skills/contact info, regardless of actual depth.
export interface CvScoreBreakdown {
  quantifiedResults: number;
  clarity: number;
  atsStructure: number;
  specificSkills: number;
  total: number;
}

const HAS_NUMBER = /\d/;

// First-word roots for a bullet opening on a strong, results-oriented verb
// ("Achieved…", "Ottimizzato…") rather than a passive/duty-listing one ("Mi
// occupavo di…", "Responsible for…"). Roots, not full words, so gender/
// number inflection (Italian past participles: -o/-a/-i/-e) and English
// -ed/-ing suffixes all match off one entry — `.startsWith()` against the
// bullet's own first word, not a substring search, so it only judges how
// the bullet OPENS. Deliberately a plain wordlist rather than an AI judgment
// on the "after" side too — see lib/parse-resume.ts's quantified_results
// rubric for why the "before" side stays AI-judged from the real PDF.
const STRONG_VERB_ROOTS = [
  // English
  "achiev", "optimi", "reduc", "increas", "led", "lead", "built", "build",
  "launch", "deliver", "driv", "scal", "implement", "design", "negotiat",
  "spearhead", "streamlin", "generat", "establish", "restructur", "automat",
  "transform", "expand", "coordinat", "develop", "creat", "improv", "manag",
  "direct", "execut", "initiat", "pioneer", "accelerat", "boost", "doubl",
  "tripl", "sav", "won", "win", "secur", "clos", "onboard", "mentor",
  "train", "grew", "grow", "ship", "architect", "engineer", "deploy", "cut",
  "reorganiz", "hir", "rais", "engag", "oversa", "oversee", "own", "foster",
  "forg", "cultivat", "champion", "orchestrat", "navigat", "analy", "identif",
  "resolv", "troubleshoot", "author", "draft", "present", "pitch", "acquir",
  "retain", "upsold", "upsell", "convert", "outperform", "exceed", "surpass",
  "maintain", "administer", "supervis", "facilitat", "collaborat", "represent",
  "forecast", "budget", "audit", "review", "evaluat", "assess", "recruit",
  "promot", "award", "shap", "steer", "revamp", "overhaul", "unlock",
  // Italian
  "raggiunt", "ottimizz", "ridott", "increment", "riorganizzat", "guidat",
  "costruit", "lanciat", "gestit", "sviluppat", "implementat", "progettat",
  "negoziat", "automatizzat", "trasformat", "ampliat", "coordinat", "definit",
  "avviat", "creat", "migliorat", "dirett", "eseguit", "accelerat", "aument",
  "tagliat", "raddoppiat", "triplicat", "risparmiat", "vint", "conquistat",
  "chius", "format", "supervisionat", "pianificat", "strutturat", "potenziat",
  "consolidat", "elaborat", "ottenut", "assunt", "reclutat", "acquisit",
  "fideliz", "convertit", "analizzat", "identificat", "risolt",
  "presentat", "redatt", "trattat", "monitorat", "valutat", "revision",
  "promoss", "premiat", "ideat", "curat", "rilanciat",
];

function startsWithStrongVerb(bullet: string): boolean {
  const firstWord = bullet.trim().toLowerCase().replace(/^[^a-zà-ÿ]+/i, "").split(/\s+/)[0] ?? "";
  if (!firstWord) return false;
  return STRONG_VERB_ROOTS.some((root) => firstWord.startsWith(root));
}

function scoreQuantifiedResults(profile: ProfileSchema): number {
  const bullets = profile.experience.flatMap((e) => e.description);
  if (bullets.length === 0) return 0;
  // Two signals, weighted so a concrete number still matters most: whether
  // the bullet states a real metric (never fabricatable — improveResume()
  // can tighten wording but is forbidden from touching numbers), and
  // whether it OPENS on a strong, active verb rather than a passive
  // duty-listing phrase (genuinely rewritable, since it's about restating
  // an existing true fact more sharply, not inventing a new one).
  const withNumbers = bullets.filter((b) => HAS_NUMBER.test(b)).length;
  const withStrongVerb = bullets.filter(startsWithStrongVerb).length;
  const numbersScore = (withNumbers / bullets.length) * 18;
  const verbScore = (withStrongVerb / bullets.length) * 7;
  return Math.round(numbersScore + verbScore);
}

// A bullet reading as a dense, multi-clause block is hard to scan in the
// few seconds a CV typically gets — roughly 2-3 lines at normal CV width.
const WALL_OF_TEXT_CHARS = 220;

function scoreClarity(profile: ProfileSchema): number {
  const bio = profile.personal_info.bio?.trim() ?? "";
  // bio_original is omitted by extraction when the source CV had no
  // self-description at all to draw from (see lib/parse-resume.ts) — but
  // even when present, a one-line qualification/job title copied verbatim
  // isn't a real positioning statement either. Only count it as genuine
  // "own voice" once it reads like an actual summary sentence, not a title.
  let bioRaw = 0;
  if (bio) {
    const original = profile.personal_info.bio_original?.trim() ?? "";
    const hasSubstantiveVoice = original.length >= 50;
    bioRaw = hasSubstantiveVoice ? 8 : 3;
    if (bio.length >= 60 && bio.length <= 140) bioRaw += 10;
    else if (bio.length >= 30 && bio.length <= 180) bioRaw += 5;
    if (profile.personal_info.title?.trim()) bioRaw += 7;
  }
  // Rescaled from the bio formula's own 0-25 range to a 0-15 contribution,
  // leaving room for the two document-wide signals below — this criterion
  // used to be bio-only, which meant it couldn't reflect a CV that was a
  // wall of dense paragraphs everywhere else, or reward the layout quality
  // every Jobli export already guarantees.
  const bioContribution = (Math.max(0, Math.min(25, bioRaw)) / 25) * 15;

  // Bullet conciseness: genuinely readable if it's not scannable in a
  // glance — measurable from the text itself, and something improveResume()
  // can actually fix by tightening an overlong bullet (see its own prompt).
  const bullets = profile.experience.flatMap((e) => e.description);
  const concisenessScore = bullets.length === 0
    ? 5 // no bullets isn't itself a "wall of text" problem
    : (bullets.filter((b) => b.length <= WALL_OF_TEXT_CHARS).length / bullets.length) * 5;

  // Visual hierarchy (bold on role/company, real bullet points, consistent
  // spacing) and contact info placed near the top are guaranteed by every
  // Jobli export template, regardless of how the original CV was laid out —
  // a property of the output format, not something computed from content,
  // same reasoning as scoreAtsStructure below. Gated on there being actual
  // content to lay out, so a near-empty profile doesn't get free points.
  const hasSubstantiveContent = profile.experience.length > 0 || bio.length > 0;
  const hierarchyScore = hasSubstantiveContent ? 5 : 0;

  return Math.round(bioContribution + concisenessScore + hierarchyScore);
}

function scoreAtsStructure(profile: ProfileSchema): number {
  // This is a document-STRUCTURE criterion (single column, standard
  // Experience/Education/Skills headers, no tables/text-boxes/graphics an
  // ATS parser could choke on) — not a measure of how rich the skills
  // section is (that's scoreSpecificSkills below). Every Jobli export
  // renders through one of our own PDF templates, which is ATS-safe by
  // construction regardless of how the originally-uploaded CV was laid
  // out — so "after" isn't really computed from profile content, it's a
  // property of the output format itself. The only thing checked here is
  // that there's actually substantive content to format (a real CV was
  // parsed, not a near-empty one); genuine layout quality of the ORIGINAL
  // document lives entirely in the AI-judged "before" score (see
  // lib/parse-resume.ts's ats_structure rubric), which looks at the real
  // source PDF's actual structure before any of this exists.
  const hasSubstantiveContent = profile.experience.length > 0 &&
    (profile.skills.hard.length > 0 || profile.skills.tools.length > 0);
  return hasSubstantiveContent ? 25 : 10;
}

function scoreSpecificSkills(profile: ProfileSchema): number {
  const unique = new Set(
    [...profile.skills.hard, ...profile.skills.tools].map((s) => s.toLowerCase().trim())
  );
  // Cap raised from 10 to 14 — hitting 10 unique skills/tools was common
  // enough (including generic ones) to max this criterion too easily.
  // Full marks now reserved for a genuinely skill-dense profile.
  const breadthScore = (Math.min(unique.size, 14) / 14) * 18;

  // Contextualization bonus: a skill that's not just listed but also shows
  // up inside an actual experience bullet ("...via Salesforce...") reads as
  // demonstrated, not just claimed. Plain substring match against the
  // bullet text — deterministic on both "before" and "after" since it reads
  // fields improveResume() never touches (skills) against fields it can
  // only lightly reword, never fabricate new mentions into (bullets). The
  // length>=3 guard avoids short skill names (e.g. "Go", "R") false-
  // matching inside unrelated words.
  const bulletText = profile.experience.flatMap((e) => e.description).join(" ").toLowerCase();
  const contextualizable = [...unique].filter((s) => s.length >= 3);
  const contextualized = contextualizable.filter((s) => bulletText.includes(s)).length;
  const contextScore = contextualizable.length > 0 ? (contextualized / contextualizable.length) * 7 : 0;

  return Math.round(breadthScore + contextScore);
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

// Reconstructs a genuine "before" score for a profile whose
// metadata.score_before is missing (e.g. a PDF-hash cache entry remembered
// before that field existed, or an extraction whose AI response omitted
// it) — WITHOUT paying for a fresh Claude call. `profile` may already be
// the post-improveResume version; substituting bio_original back in for
// bio makes the clarity criterion (the only one bio affects) score the
// true original text. atsStructure and the "breadth" half of specificSkills
// read skills/education/certifications — fields improveResume() is
// contractually forbidden from fabricating — so those stay exact, not an
// approximation. quantifiedResults' verb-strength signal and
// specificSkills' contextualization signal both read experience bullet
// TEXT, which improveResume() is allowed to lightly reword (never numbers,
// but phrasing) — this fallback can't recover the true original wording
// (no "description_original" is kept, unlike bio), so those two signals are
// a reasonable approximation here, not an exact reconstruction. Only
// matters for this rare fallback path; the real AI-judged score_before this
// backfills for was never affected.
export function reconstructScoreBefore(profile: ProfileSchema): CvScoreBreakdown {
  if (!profile.personal_info.bio_original) return computeCvScore(profile);
  return computeCvScore({
    ...profile,
    personal_info: { ...profile.personal_info, bio: profile.personal_info.bio_original },
  });
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
