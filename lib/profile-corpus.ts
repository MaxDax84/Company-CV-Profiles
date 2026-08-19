import type { ProfileSchema } from "./schema";

// Deterministic anti-fabrication backstop, shared by every AI call that
// rewrites skills/technologies from a source profile (lib/tailor-resume.ts,
// lib/cv-chat-reformulate.ts) — regardless of how well the model follows its
// prompt, a skill/tool/technology can only survive in the output if its
// exact (case-insensitive) text already appeared somewhere in the source
// profile's own skills/technologies, or every one of its significant words
// is evidenced somewhere in the source's own free text.

export function collectAllowedTechTokens(source: ProfileSchema): Set<string> {
  const items = [
    ...source.skills.hard,
    ...source.skills.soft,
    ...source.skills.tools,
    ...source.experience.flatMap((e) => e.technologies),
  ];
  return new Set(items.map((s) => s.toLowerCase().trim()));
}

// A skill that was never tagged as such in the source profile can still be
// truthful if every one of its significant words already appears somewhere
// in the source's own free text (bio, experience bullets, projects) — e.g.
// "P&L Management" survives because the source CV literally says "P&L
// targets" and "...Development and CRM Manager" elsewhere. Words that don't
// appear anywhere in the source (e.g. "FMCG", "SAP") still get filtered out.
const SKILL_STOPWORDS = new Set(["a", "an", "the", "of", "in", "on", "for", "with", "to", "and", "or"]);

function significantWords(phrase: string): string[] {
  return phrase
    .toLowerCase()
    .split(/[\s/&,-]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !SKILL_STOPWORDS.has(w));
}

export function buildSourceCorpus(source: ProfileSchema): string {
  const parts = [
    source.personal_info.title,
    source.personal_info.bio,
    source.personal_info.bio_original ?? "",
    ...source.experience.flatMap((e) => [e.role, ...e.description]),
    ...source.projects.map((p) => `${p.title} ${p.description} ${p.tags.join(" ")}`),
    ...(source.other ?? []),
  ];
  return parts.join(" \n ").toLowerCase();
}

export function isEvidencedByCorpus(term: string, corpus: string): boolean {
  const words = significantWords(term);
  return words.length > 0 && words.every((w) => corpus.includes(w));
}

export function keepAllowed(items: string[], allowed: Set<string>, corpus: string): string[] {
  return items.filter((item) => allowed.has(item.toLowerCase().trim()) || isEvidencedByCorpus(item, corpus));
}
