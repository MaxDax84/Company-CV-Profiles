import type { ProfileSchema } from "./schema";
import type { CvScoreBreakdown } from "./cv-score";
import { extractProfileJson, PROFILE_JSON_SCHEMA_BLOCK } from "./claude-json";
import { logClaudeUsage } from "./log-claude-usage";

// Thrown when the model itself flags the uploaded PDF as not being a CV at
// all (see the is_resume check in SYSTEM_PROMPT) — a distinct error type so
// the route can return a specific, actionable message instead of the
// generic 500 a malformed-extraction failure would produce.
export class NotAResumeError extends Error {
  constructor() {
    super("The uploaded file doesn't appear to be a CV/resume.");
    this.name = "NotAResumeError";
  }
}

// Raw 0-25-per-criterion score Claude assigns to the SOURCE CV, before any
// of the extraction/clarity improvements are applied — only the model can
// judge this honestly and severely, since a deterministic formula over the
// normalized ProfileSchema can only check for presence/counts, not genuine
// quality (a previous deterministic-only version of this score let a CV
// that was merely *complete* — some bio, some skills, some contact info —
// max out 3 of its 4 criteria regardless of how thin or unremarkable it
// actually was). This raw judgment gets embedded into
// profile.metadata.score_before so it travels with the profile through the
// permanent PDF-hash memory (lib/cv-score-memory.ts) — the same file
// re-uploaded later reuses this exact judgment instead of re-grading and
// risking a different number for content that hasn't changed.
export interface CvScoreBeforeRaw {
  quantified_results: number;
  clarity: number;
  ats_structure: number;
  specific_skills: number;
}

const SYSTEM_PROMPT = `You are a precise CV data extractor. Your task is to extract information from a CV/resume PDF and return ONLY a valid JSON object matching the schema below.

Rules:
- FIRST, before anything else: decide whether this document is actually a CV/resume — a document describing one identifiable person's work experience, education, and/or skills for job-seeking purposes. It does not need to be a traditional format (career-change stories, portfolios with a bio, academic CVs all count), but it must clearly be about one person's professional background. If it is something else entirely (an invoice, a novel or book excerpt, a random article, a certificate, an unrelated form or contract, a blank/corrupted page, etc.), set a top-level "is_resume": false and return ONLY {"is_resume": false} — no other field, do not invent or force-fit a plausible-looking CV out of unrelated content. If it is a CV/resume, proceed with the full extraction below (you may omit "is_resume" in that case, or set it true).
- Return ONLY the JSON object, no markdown, no explanation, no code fences.
- Never hallucinate data that is not present in the document. Use null or omit optional fields if data is missing.
- The schema below uses "| undefined" to mark optional fields. NEVER write the literal word "undefined" in your JSON output — it is not valid JSON. For a missing optional field, use null or omit the field entirely.
- CRITICAL — LANGUAGE: First detect the dominant language of the source CV. Every piece of free text you write yourself (bio, description bullets, title if rephrased) MUST be in that same language — do not default to English or translate. If the CV is in Italian, write bio and description bullets in Italian; if in English, write them in English. Only metadata.language records the detected code ("it" or "en").
- For full_name: remove apostrophes from surnames (e.g. "D'Assano" → "Dassano", "Dell'Aquila" → "DellAquila", "O'Brien" → "OBrien").
- Also capture the REAL, non-obfuscated email and phone in "email" and "phone" — these are only ever used in a private downloadable PDF the person generates for themselves (never shown on the public web page), so they must be usable by a real recruiter. Copy them exactly as written in the CV (normalize obvious formatting like spacing, but never alter the digits/characters).
- Obfuscate email (separately, for "email_obfuscated"): keep first letter, replace middle with ***, keep domain. Example: "mario.rossi@gmail.com" → "m***@gmail.com".
- Obfuscate phone (separately, for "phone_obfuscated"): keep country code and last 4 digits, replace rest with *. Example: "+39 333 1234567" → "+39 3** *** 4567".
- NEVER extract or carry over date/place of birth, age, fiscal code, ID/passport number, marital status, gender, nationality, or a home/residential address, into ANY field (bio, other, or anywhere else) — even if the source CV states them plainly (common on older Italian CV formats under "Dati Anagrafici"). None of this belongs on a job-seeking profile page; treat it exactly like data that should be silently omitted, not summarized or rephrased.
- For description bullet points: one bullet per distinct achievement or responsibility the CV actually describes for that role — do not compress multiple distinct achievements into a single bullet, and do not drop a bullet just to shorten the list. Copy the CV's own sentence as-is whenever it is already clear and grammatically correct — do not shorten it, summarize it, or drop any of its words; there is no word limit on a bullet. Only rewrite a sentence when it is genuinely unclear, ungrammatical, or garbled (e.g. broken mid-word by PDF text extraction), and even then change only what's needed to make it read correctly, keeping every fact it states. Never drop, round, or alter a %, number, scope, team size, budget, or timeframe stated in the source — these must be preserved exactly as written, in every bullet, rewritten or not. Up to 6 bullets per experience if the source genuinely describes that many; fewer if the source has fewer.
- For bio: this is a FAITHFUL extraction pass, not an optimization pass — a later step handles improving it. Just lightly clean up (grammar/typos only) the CV's own summary or positioning statement into one sentence, max 140 characters, same substance as bio_original. Do not add new phrasing, do not select or prioritize which skills to foreground, do not optimize for length or impact. If the CV has no self-description at all, write one plain, factual sentence stating only the person's role/seniority (e.g. "Marketing Manager with experience in digital campaigns") — still without any embellishment.
- For bio_original: a short, literal, unpolished restatement of how the CV itself describes the person's role (e.g. lifted near-verbatim from the CV's own summary or job title line) — this shows the "before" state, so do NOT apply any of the improvements you apply to "bio". Same language as the CV. If the CV has no self-description to draw from, omit this field.
- For education "degree": if the source clearly states a formal qualification type (e.g. "Laurea Magistrale", "Bachelor's", "Diploma"), use that, and put the subject/major in "field". If it does NOT — e.g. a short course, certificate program, or training whose title doesn't map to a formal degree category — put the course/program title exactly as written into "degree" itself and omit "field" entirely. Never leave "degree" blank and never invent a category label just to have something to put there.
- For experience: include at most 6 entries. If the CV genuinely has more distinct roles than that, do NOT simply drop the oldest ones — first merge consecutive roles at the SAME company (internal promotions, or a relocation to a different office of the same employer) into a single entry (one role/title string joining both, e.g. "Senior X / Y", description bullets combined, start_date from the earliest merged role and end_date from the latest) to make room, so that every distinct EMPLOYER the person has worked for is still represented by at least one entry; only if merging every same-company role still leaves more than 6 employers should you drop entries, oldest first. Never assign a merged or kept entry a date range that doesn't span its own bullets — double-check each entry's start_date/end_date actually matches what that entry describes, especially when the source CV's layout places a role's date badge next to a different line than its title. For each entry, also set "is_career_experience": a real, continuative professional role that belongs on someone's career timeline gets true; a summer job, a short (a few months) temporary/seasonal gig, or student/part-time work unrelated to the person's professional field gets false. A genuine internship or apprenticeship that IS in the person's professional field still counts as true — this is about excluding youth/seasonal/unrelated work from someone's "years of experience", not internships in general. When in doubt (a role's nature is ambiguous), default to true rather than guessing it away.
- For technologies per experience: up to 6 items — include every named tool/technology/platform the source mentions for that role, do not truncate to fewer just to shorten the list.
- For skills (hard/soft/tools): max 6 items each.
- For projects: max 2 entries.
- For certifications: max 4 entries.
- For primary_color: suggest a hex color that matches the person's industry (e.g. #6366f1 for tech, #0ea5e9 for finance, #10b981 for healthcare).
- For template: choose "alpha" for creative/design roles, "beta" for tech/engineering, "gamma" for business/finance, "delta" for any other.
- For image_placeholder: assign "gradient-1" through "gradient-8" to each project sequentially.
- For other: catch-all for anything relevant that doesn't fit the sections above — hobbies, sports, volunteering, non-professional collaborations, extra languages, interests. Max 8 short items (a few words each), same language as the CV. Omit the field entirely if there's nothing like this in the CV — do not invent generic filler. Never put birth date, age, fiscal code, ID numbers, marital status, or a home address here (see the rule above) — a "Dati Anagrafici" block on the source CV is not a valid source for this field.
- For social_links (linkedin, github, portfolio, twitter): only fill a field if the CV literally prints that specific URL or handle as visible text (e.g. "linkedin.com/in/mariorossi", "github.com/mrossi", "@mariorossi"). A "LinkedIn"/"GitHub" label, icon, or the word alone with no visible address next to it is NOT enough — you cannot see where a hyperlink actually points, only the rendered page text, so guessing the platform's bare homepage (e.g. "https://linkedin.com") would be inventing a URL, not extracting one, and a broken-feeling link is worse than no link. Omit the field entirely in that case.
- Detect language from the CV content and set metadata.language to "it" or "en".
- Additionally, suggest 3 to 5 job titles this person is genuinely qualified for right now, in a top-level "suggested_titles" array of strings, same language as the CV. Ground every title strictly in the seniority, domain, and concrete skills/experience actually present in the CV — a plausible next step or lateral move, never an aspirational role the CV doesn't support (e.g. don't suggest "CTO" for someone with two years as a junior developer, and don't suggest a totally different domain the CV shows no evidence of). Order from closest/most obvious match to more exploratory. If the CV is too thin or unfocused to support even 3 honest suggestions, return fewer rather than padding with a weak guess.
- Additionally, evaluate the SOURCE CV as originally written (before any of the improvements you make above) on 4 criteria, each an integer from 0 to 25, in a top-level "cv_score_before" object:
  - "quantified_results": out of 25, up to 18 points for what fraction of the CV's own bullet points/achievements already include a concrete number, percentage, or monetary value (18 = nearly all do, 0 = none do), plus up to 7 points for what fraction of bullets OPEN on a strong, active, results-oriented verb (e.g. "Achieved", "Reduced", "Led", "Ottimizzato", "Guidato") rather than a passive, duty-listing phrase (e.g. "Responsible for", "Mi occupavo di") — 7 = nearly all bullets open strong, 0 = none do. For roles where numbers are genuinely not a natural fit (entry-level, operational — e.g. a server, an intern), a well-contextualized scope (team size, volume handled, frequency, autonomy granted) counts toward the number-fraction component same as a metric would; don't penalize a role for lacking metrics that role type wouldn't realistically produce.
  - "clarity": out of 25, up to 15 points for how clear, concise, and professional the CV's own summary/profile statement is, if it has one (a one-line job title or qualification name copied as if it were a summary does NOT count as a real self-description — 15 = a genuinely clear, well-scoped positioning statement, 0 = missing, vague, or just a restated title) — plus up to 5 points for whether the experience bullets avoid reading as dense, multi-clause walls of text (each one scannable in a few seconds, not a paragraph) — plus up to 5 points for whether the ORIGINAL document itself has a clean, scannable visual hierarchy: role/company names visually distinguished (bold or similar), actual bullet points rather than solid paragraphs, consistent spacing, and contact info immediately visible near the top, rather than a cluttered, inconsistent, or hard-to-navigate layout.
  - "ats_structure": judging the ORIGINAL PDF's actual visual layout (not its content) — is it a clean, single-column, linear document with standard section headers (e.g. Experience, Education, Skills), plain selectable text, and no tables, multi-column layouts, text boxes, headers/footers holding key info, or decorative graphics/icons that could confuse an ATS parser or cause it to misread/skip/scramble content? Look at the actual page geometry, not just whether the text reads sensibly once extracted — a narrow sidebar (photo, contact info, languages, skills, education) running down one side of the page next to a wider main column (profile, experience) is a MULTI-COLUMN layout even if each column's own text is individually well-formatted, and most real-world ATS parsers read left-to-right across the full page width, which scrambles a sidebar's contact/skills into the middle of experience bullets or drops it entirely — this extremely common "photo + sidebar" CV template must score low (roughly 3-10 out of 25), never near the top, specifically because of that structural risk, regardless of how clean each individual column looks. 25 = clean single-column layout an ATS would parse perfectly; 0 = heavily multi-column, table-based, or graphically complex layout likely to confuse a parser.
  - "specific_skills": out of 25, up to 18 points for how many concrete, specific hard skills or tools does the CV explicitly name (not vague soft-skill adjectives, not skills you had to infer from a course title) — 18 = 10 or more distinct, genuinely specific skills/tools explicitly stated, 0 = none — plus up to 7 points for what fraction of those named skills/tools are also demonstrated inside an experience bullet, not just listed in a skills section (e.g. "using Salesforce" appearing in an actual bullet, not only "Salesforce" sitting in a skills list) — 7 = most named skills show up in context somewhere, 0 = skills only ever appear in the skills list, never demonstrated in an experience bullet.
  Be strict and critical, not encouraging — judge against the standard of a highly polished, ATS-optimized, recruiter-ready CV, not against an average CV, and not relative to the candidate's seniority or field. Most real CVs, even genuinely good ones, should land in the 30-65 range on most criteria; reserve scores above 80 for the rare CV that is already close to exceptional on that specific criterion. Do not round up out of politeness, and do not inflate a criterion just because the CV is complete or well-organized elsewhere — a vague or generic bio, a thin or merely-implied skills section, or bullets with no numbers should score low even if the CV is otherwise tidy.

Schema:
${PROFILE_JSON_SCHEMA_BLOCK}

Also include, as a sibling of "personal_info" at the top level (not nested inside it):
"suggested_titles": string[]
"cv_score_before": {
  "quantified_results": number,
  "clarity": number,
  "ats_structure": number,
  "specific_skills": number
}`;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export interface ParseResumeResult {
  profile: ProfileSchema;
  suggestedTitles: string[];
}

type SocialPlatform = "linkedin" | "github" | "twitter";

function classifySocialUrl(url: string): SocialPlatform | null {
  let host: string;
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
  if (host === "linkedin.com") return "linkedin";
  if (host === "github.com") return "github";
  if (host === "twitter.com" || host === "x.com") return "twitter";
  return null;
}

// A CV's "LinkedIn"/"GitHub" contact-icon row is almost always a clickable
// hyperlink annotation with no visible URL text next to it — the model can
// only see rendered page content, never where a link actually points (see
// the social_links rule in SYSTEM_PROMPT), so it has no way to fill these in
// from text alone. Reading the PDF's own link annotations gets the real
// target directly and deterministically, no guessing involved. Best-effort:
// this must never fail the whole extraction over a link-reading hiccup, so
// any error here just yields no extra links, same as before this existed.
async function extractSocialLinksFromPdf(pdfBuffer: ArrayBuffer): Promise<Partial<Record<SocialPlatform, string>>> {
  const found: Partial<Record<SocialPlatform, string>> = {};
  try {
    const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const doc = await getDocument({ data: new Uint8Array(pdfBuffer) }).promise;
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const annotations = await page.getAnnotations();
      for (const a of annotations) {
        if (a.subtype !== "Link" || typeof a.url !== "string") continue;
        const platform = classifySocialUrl(a.url);
        if (platform && !found[platform]) found[platform] = a.url;
      }
    }
  } catch {
    // Edge runtime, a malformed PDF, whatever — fall back to whatever the
    // model itself extracted from visible text.
  }
  return found;
}

export async function parseResume(pdfBuffer: ArrayBuffer, userId?: string | null): Promise<ParseResumeResult> {
  const base64Pdf = arrayBufferToBase64(pdfBuffer);
  // Kicked off alongside the Claude call (not after it) so this adds no
  // extra latency to the overall extraction.
  const pdfLinksPromise = extractSocialLinksFromPdf(pdfBuffer);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "pdfs-2024-09-25",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8192,
      // Array form + cache_control: this exact system prompt is identical
      // across every /generate call — caching it cuts input-token cost and
      // latency on every request after the first within the 5-minute window.
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: base64Pdf,
              },
            },
            {
              type: "text",
              text: "Extract all data from this CV and return the JSON object. Set metadata.generated_at to the current ISO timestamp.",
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${body}`);
  }

  const json = await res.json() as {
    stop_reason: string;
    content: { type: string; text: string }[];
    usage?: { input_tokens: number; output_tokens: number; cache_creation_input_tokens?: number; cache_read_input_tokens?: number };
  };
  logClaudeUsage("parse_resume", "claude-haiku-4-5-20251001", json.usage, userId);

  const parsed = extractProfileJson<Partial<ProfileSchema> & { is_resume?: boolean; suggested_titles?: string[]; cv_score_before?: CvScoreBeforeRaw }>(
    json,
    "CV too long to process. Please try with a shorter CV (max 2 pages recommended)."
  );

  if (parsed.is_resume === false) {
    throw new NotAResumeError();
  }

  const { suggested_titles, is_resume, cv_score_before, ...profile } = parsed as ProfileSchema & { suggested_titles?: string[]; is_resume?: boolean; cv_score_before?: CvScoreBeforeRaw };

  if (!profile.metadata?.generated_at) {
    profile.metadata.generated_at = new Date().toISOString();
  }

  // ProfileSchema declares these as required arrays, but the extraction
  // prompt tells the model to omit optional fields entirely when the CV has
  // no such section (e.g. no "Projects" or "Certifications" — common for
  // non-technical roles) — the model follows that literally and drops the
  // key rather than returning []. Every consumer (the 4 web templates, the
  // PDF/Word exporters, tailor-resume) trusted the schema and called
  // `.length`/`.map` unguarded, which crashed the whole render for any CV
  // missing one of these sections. Normalize here, once, at the source.
  profile.projects ??= [];
  profile.certifications ??= [];

  // The prompt tells the model to omit a social link it only sees as a bare
  // label (a "LinkedIn" hyperlink with no visible URL text) rather than
  // guess the platform's homepage — but it doesn't always comply, and a
  // bare label used as an href renders as a broken relative link on every
  // template (see components/templates/*). Belt-and-suspenders: drop
  // anything that isn't actually a URL or @handle.
  if (profile.personal_info?.social_links) {
    const links = profile.personal_info.social_links;
    for (const key of Object.keys(links) as (keyof typeof links)[]) {
      if (!/[./@]/.test(links[key] ?? "")) delete links[key];
    }
  }

  // Fill in (or correct) linkedin/github/twitter from the PDF's own
  // hyperlink annotations — a real link read straight from the document
  // beats anything the model inferred from visible text alone.
  const pdfLinks = await pdfLinksPromise;
  Object.assign(profile.personal_info.social_links, pdfLinks);

  // Sum ourselves rather than trusting the model to also report a correct
  // total — it's only ever asked for the 4 individual criteria.
  if (cv_score_before) {
    const scoreBefore: CvScoreBreakdown = {
      quantifiedResults: cv_score_before.quantified_results,
      clarity: cv_score_before.clarity,
      atsStructure: cv_score_before.ats_structure,
      specificSkills: cv_score_before.specific_skills,
      total: cv_score_before.quantified_results + cv_score_before.clarity + cv_score_before.ats_structure + cv_score_before.specific_skills,
    };
    profile.metadata.score_before = scoreBefore;
  }

  return { profile, suggestedTitles: suggested_titles ?? [] };
}
