import { cache } from "react";
import { kv } from "./kv";
import type { ProfileSchema, TemplateStyle } from "./schema";
import { parseResume } from "./parse-resume";
import { improveResume } from "./improve-resume";
import { TEMPLATE_COLORS, isTemplateStyle } from "./templates";
import type { CvScoreBreakdown } from "./cv-score";
import { computeCvScore } from "./cv-score";
import { hashPdf, getRememberedProfile, rememberProfile } from "./cv-score-memory";
import { createServiceSupabaseClient, isSupabaseConfigured } from "./supabase/service";
import type { SupabaseClient } from "@supabase/supabase-js";

// Shared slug/KV/Postgres plumbing used by /api/parse-resume, /api/claim,
// /api/tailor-resume, app/profile/[slug]/page.tsx (pending previews and
// seeded demo profiles), and app/[code]/[slug]/page.tsx (claimed profiles).

// A just-generated-but-not-yet-registered profile lives in KV for a short
// window — long enough for "generate, look at the preview, sign up" to
// happen in one sitting, short enough that an abandoned preview cleans
// itself up instead of accumulating forever like the old 48h anonymous
// profiles did.
export const PENDING_TTL_SECONDS = 60 * 60; // 1 hour

// Converts "Mario Rossi" → "mario-rossi", with collision suffix if needed
export function toSlug(fullName: string): string {
  return fullName
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// personal_info.email/phone are the real, non-obfuscated contact details —
// meant for the owner's own downloadable PDF only, never for a page a
// stranger can load. Strip before anything leaves the server for public
// consumption (the public /profile/[slug] page, its metadata, etc).
function stripPII(profile: ProfileSchema): ProfileSchema {
  return {
    ...profile,
    personal_info: {
      ...profile.personal_info,
      email: undefined,
      phone: undefined,
    },
  };
}

async function getRawPendingProfile(slug: string): Promise<ProfileSchema | null> {
  const raw = await kv.get<string>(`profile:${slug}`);
  if (!raw) return null;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

// Public-safe read for a still-pending preview or a seeded demo/showcase
// profile — both only ever live in KV, never in Postgres. A *claimed*
// profile is no longer reachable this way; its permanent public address is
// /<account-code>/<slug> (see getProfileByAccountCode below).
// cache() dedupes within a single request — both the page component and
// generateMetadata call this for the same slug, and without it each render
// paid for the KV read twice.
export const getProfileBySlug = cache(async (slug: string): Promise<ProfileSchema | null> => {
  const pending = await getRawPendingProfile(slug);
  return pending ? stripPII(pending) : null;
});

// Public-safe read for a claimed profile's permanent address:
// /<account-code>/<slug>. The account code is looked up first (it's the
// real, never-changing identity), then the specific CV by slug within that
// one account — a slug only needs to be unique within its own account now,
// not site-wide, so it must always be resolved together with the code.
// cache()-wrapped for the same reason as getProfileBySlug above — the page
// component and generateMetadata both call this with the same (code, slug),
// which otherwise meant 2 extra Supabase round-trips per page view.
export const getProfileByAccountCode = cache(async (code: string, slug: string): Promise<ProfileSchema | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const service = createServiceSupabaseClient();
    const { data: account } = await service
      .from("account_credits")
      .select("user_id")
      .eq("code", code)
      .maybeSingle();
    if (!account) return null;

    const { data } = await service
      .from("profiles")
      .select("data, kind")
      .eq("user_id", account.user_id)
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return null;
    // Tailored (job-adapted) profiles never get a public web page — only
    // the PDF/cover-letter output, listed in the account's "CV adattati"
    // section. Treat one exactly like a slug that doesn't exist.
    if (data.kind === "tailored") return null;

    return stripPII(data.data as ProfileSchema);
  } catch (err) {
    console.error("[getProfileByAccountCode] Postgres lookup failed", err);
    return null;
  }
});

// Owner-scoped read (dashboard "dati anagrafici", PDF export, tailoring
// source) — returns the full row including the real email/phone, since only
// the owner sees this. A user can have several kind='primary' rows (every
// CV they've ever uploaded and claimed — see getOwnedPrimaryProfiles for
// the full list); this returns the MOST RECENT one, used wherever a single
// "current" CV is needed (e.g. what /tailor tailors by default).
export async function getOwnedProfileRow(
  supabase: SupabaseClient,
  userId: string,
  kind: "primary" | "tailored" | "translated" = "primary"
): Promise<{ id: string; slug: string; data: ProfileSchema } | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id, slug, data")
    .eq("user_id", userId)
    .eq("kind", kind)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as { id: string; slug: string; data: ProfileSchema } | null;
}

// Every CV a user has uploaded and claimed, newest first — shown as a list
// on the account dashboard, the same way getOwnedTailoredProfiles works.
export async function getOwnedPrimaryProfiles(
  supabase: SupabaseClient,
  userId: string
): Promise<{ id: string; slug: string; data: ProfileSchema; created_at: string }[]> {
  const { data } = await supabase
    .from("profiles")
    .select("id, slug, data, created_at")
    .eq("user_id", userId)
    .eq("kind", "primary")
    .order("created_at", { ascending: false });
  return (data ?? []) as { id: string; slug: string; data: ProfileSchema; created_at: string }[];
}

// Same as above, looked up by slug instead of kind — used by the PDF route,
// which serves both primary and tailored profiles. RLS's owner-only policy
// means this naturally returns null for a slug that exists but belongs to
// someone else, same as a slug that doesn't exist at all.
export async function getOwnedProfileBySlug(
  supabase: SupabaseClient,
  userId: string,
  slug: string
): Promise<{ id: string; slug: string; data: ProfileSchema; kind: "primary" | "tailored" | "translated" } | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id, slug, data, kind")
    .eq("user_id", userId)
    .eq("slug", slug)
    .maybeSingle();
  return data as { id: string; slug: string; data: ProfileSchema; kind: "primary" | "tailored" | "translated" } | null;
}

// All of a user's tailored (job-specific) profiles, newest first — shown as
// a list on the account dashboard. Uncapped, unlike the single primary
// profile, since tailoring is paid-per-run and each output is independent.
export async function getOwnedTailoredProfiles(
  supabase: SupabaseClient,
  userId: string
): Promise<{ id: string; slug: string; data: ProfileSchema; created_at: string }[]> {
  const { data } = await supabase
    .from("profiles")
    .select("id, slug, data, created_at")
    .eq("user_id", userId)
    .eq("kind", "tailored")
    .order("created_at", { ascending: false });
  return (data ?? []) as { id: string; slug: string; data: ProfileSchema; created_at: string }[];
}

// Saves a tailored (paid) output as a new, independent row owned by the
// same account — never overwrites the primary profile. Slug uniqueness is
// checked against Postgres now, not KV. RLS means each caller can only see
// their own rows, so the pre-check can't detect another user's identical
// slug — the DB's UNIQUE constraint is the real guard; on a collision
// (Postgres code 23505) just retry with the next suffix.
export async function saveTailoredProfile(
  supabase: SupabaseClient,
  userId: string,
  sourceProfileId: string,
  profile: ProfileSchema
): Promise<{ slug: string }> {
  const baseSlug = toSlug(profile.personal_info.full_name) || "profile";

  for (let attempt = 0; attempt < 10; attempt++) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;
    const { error } = await supabase.from("profiles").insert({
      user_id: userId,
      kind: "tailored",
      slug,
      data: profile,
      source_profile_id: sourceProfileId,
    });
    if (!error) return { slug };
    if (error.code !== "23505") throw error;
  }

  throw new Error("Could not allocate a unique slug for the tailored profile.");
}

// Same pattern as saveTailoredProfile, but for an opt-in translated copy of
// a primary CV — unlike a tailored (job-specific) profile, a translation
// DOES get its own public page (kind='translated' isn't excluded by
// getProfileByAccountCode below), since the whole point is a shareable
// multilingual version of the profile.
export async function saveTranslatedProfile(
  supabase: SupabaseClient,
  userId: string,
  sourceProfileId: string,
  profile: ProfileSchema
): Promise<{ slug: string }> {
  const baseSlug = `${toSlug(profile.personal_info.full_name) || "profile"}-${profile.metadata.language}`;

  for (let attempt = 0; attempt < 10; attempt++) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;
    const { error } = await supabase.from("profiles").insert({
      user_id: userId,
      kind: "translated",
      slug,
      data: profile,
      source_profile_id: sourceProfileId,
    });
    if (!error) return { slug };
    if (error.code !== "23505") throw error;
  }

  throw new Error("Could not allocate a unique slug for the translated profile.");
}

// Every translation of a given source profile, newest first — shown under
// that CV's card on the account dashboard.
export async function getTranslationsOf(
  supabase: SupabaseClient,
  sourceProfileId: string
): Promise<{ id: string; slug: string; data: ProfileSchema; created_at: string }[]> {
  const { data } = await supabase
    .from("profiles")
    .select("id, slug, data, created_at")
    .eq("source_profile_id", sourceProfileId)
    .eq("kind", "translated")
    .order("created_at", { ascending: false });
  return (data ?? []) as { id: string; slug: string; data: ProfileSchema; created_at: string }[];
}

// Writes a freshly-generated (not yet claimed by any account) profile to
// KV under a fresh, collision-free slug, alongside an unguessable claim
// token. Slugs are human-readable and guessable — the claim token, not the
// slug, is the actual credential a signup uses to take ownership.
//
// `slugSource` — when given (the uploaded PDF's own filename, minus its
// extension) — takes priority over the person's name, so the page's address
// matches the file the user actually uploaded. Falls back to the name, then
// to a plain "profile", if that yields nothing usable (e.g. a filename with
// no alphanumeric characters at all).
export async function savePendingProfile(
  profile: ProfileSchema,
  slugSource?: string
): Promise<{ slug: string; claimToken: string }> {
  const baseSlug = toSlug(slugSource ?? "") || toSlug(profile.personal_info.full_name) || "profile";
  let slug = baseSlug;
  let attempt = 0;
  while (await kv.exists(`profile:${slug}`)) {
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  await kv.set(`profile:${slug}`, JSON.stringify(profile), { ex: PENDING_TTL_SECONDS });

  const claimToken = crypto.randomUUID();
  await kv.set(`claim:${claimToken}`, JSON.stringify({ slug }), { ex: PENDING_TTL_SECONDS });

  return { slug, claimToken };
}

// Phase 2 of the /generate flow: the CV was already faithfully extracted and
// scored in phase 1 (see parseResume's "before" score) — this is where the
// actual AI improvement happens (mainly the bio, see lib/improve-resume.ts),
// plus the user's template choice, right before the page is finalized.
// Keyed by the claim token rather than the slug — slugs are
// human-readable/guessable, so authorizing this by slug alone would let
// anyone who can guess another user's slug trigger AI calls against their
// still-unclaimed preview before they sign up.
//
// The claim token itself isn't single-use here (it's still needed later by
// claimPendingProfile at signup) — but the AI call it triggers must only
// ever run once per token, or the same Turnstile-verified upload could be
// replayed against this route to rack up unlimited real Claude calls within
// the token's 1h TTL. A separate `improved:` KV flag makes the improve step
// itself idempotent: a repeat call just reapplies the template choice to the
// already-improved profile instead of asking Claude to improve it again.
export async function improveAndFinalizePendingProfile(
  claimToken: string,
  template?: TemplateStyle
): Promise<{ slug: string; profile: ProfileSchema } | null> {
  const claimRaw = await kv.get<string>(`claim:${claimToken}`);
  if (!claimRaw) return null;
  const { slug } = typeof claimRaw === "string" ? JSON.parse(claimRaw) : claimRaw;

  const pending = await getRawPendingProfile(slug);
  if (!pending) return null;

  const alreadyImproved = await kv.get(`improved:${claimToken}`);
  const improved = alreadyImproved ? pending : await improveResume(pending);
  if (!alreadyImproved) {
    await kv.set(`improved:${claimToken}`, "1", { ex: PENDING_TTL_SECONDS });
  }

  if (template && isTemplateStyle(template)) {
    improved.metadata.template = template;
    improved.metadata.primary_color = TEMPLATE_COLORS[template];
  }

  await kv.set(`profile:${slug}`, JSON.stringify(improved), { ex: PENDING_TTL_SECONDS });
  return { slug, profile: improved };
}

export type ClaimError = "expired" | "claim_failed" | "cv_limit_reached";

// A user can claim several CVs (see getOwnedPrimaryProfiles), but not
// unbounded — caps runaway storage/abuse and keeps the account dashboard's
// CV list actually manageable to look at.
export const MAX_PRIMARY_PROFILES_PER_USER = 4;

// Moves a pending KV preview into the caller's permanent Postgres record, as
// a new kind='primary' row — up to MAX_PRIMARY_PROFILES_PER_USER per
// account, all ending up listed on the account dashboard (see
// getOwnedPrimaryProfiles). `supabase` must be a request-scoped,
// already-authenticated client (see lib/supabase/server.ts) — the insert
// relies on RLS's `auth.uid() = user_id` check, not on anything passed in
// here.
export async function claimPendingProfile(
  supabase: SupabaseClient,
  userId: string,
  claimToken: string
): Promise<{ slug: string } | { error: ClaimError }> {
  const claimRaw = await kv.get<string>(`claim:${claimToken}`);
  if (!claimRaw) return { error: "expired" };
  const { slug: pendingSlug } = typeof claimRaw === "string" ? JSON.parse(claimRaw) : claimRaw;

  const profile = await getRawPendingProfile(pendingSlug);
  if (!profile) return { error: "expired" };

  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("kind", "primary");
  if ((count ?? 0) >= MAX_PRIMARY_PROFILES_PER_USER) {
    return { error: "cv_limit_reached" };
  }

  // The pending slug was only checked for uniqueness among OTHER still-
  // pending previews (see savePendingProfile) — it can still collide with
  // an already-claimed profile in Postgres, e.g. claiming a second CV that
  // happens to belong to someone with the same name as an earlier one.
  // Retry with a suffix on a unique-constraint violation, same pattern as
  // saveTailoredProfile.
  for (let attempt = 0; attempt < 10; attempt++) {
    const slug = attempt === 0 ? pendingSlug : `${pendingSlug}-${attempt}`;
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({ user_id: userId, kind: "primary", slug, data: profile });
    if (!insertError) {
      await kv.del(`profile:${pendingSlug}`);
      await kv.del(`claim:${claimToken}`);
      return { slug };
    }
    if (insertError.code !== "23505") return { error: "claim_failed" };
  }

  return { error: "claim_failed" };
}

export interface ResolveFromPdfResult {
  profile: ProfileSchema;
  pdfHash: string;
  fromCache: boolean;
  cachedSlug: string | null;
  templateChanged: boolean;
  scoreBefore: CvScoreBreakdown | null;
  // Persisted on profile.metadata.suggested_titles (see below), so it
  // survives both a cache hit and, once claimed, permanent storage — shown
  // per-CV on the account dashboard, not just on the just-generated preview.
  suggestedTitles: string[];
}

// Extracts a profile from an uploaded PDF, reusing a cached extraction if
// this exact file was uploaded before (accidental resubmit, or someone
// replaying a file to run up the Claude bill) instead of paying for a fresh
// call. Reapplies `templateChoice` even on a cache hit, since the extracted
// content is identical but the user may have picked a different look.
//
// The cache only ever looks at still-pending (unclaimed) KV previews — once
// a profile is claimed into Postgres its KV entry is deleted, so a repeat
// upload after that point correctly falls through to a fresh extraction
// rather than trying to reuse someone's now-owned account data.
//
// The EXTRACTED PROFILE, unlike the short-lived pending cache above, is
// remembered permanently by PDF hash (see lib/cv-score-memory.ts) —
// re-uploading the exact same file must always resolve to the exact same
// extracted data, whether that's minutes or months later, and whether it's
// an original CV or one of our own already-optimized exports (which get
// remembered at export time, in /api/pdf/[slug]). The score itself is
// always derived fresh from that profile with computeCvScore() — never
// separately cached — so "before" and "after" are mathematically
// guaranteed to start from identical data every time.
export async function resolveProfileFromPdf(
  buf: ArrayBuffer,
  templateChoice: unknown
): Promise<ResolveFromPdfResult> {
  const pdfHash = await hashPdf(buf);

  const cachedSlug = await kv.get<string>(`pdf-hash:${pdfHash}`);
  if (cachedSlug) {
    const cachedProfile = await getRawPendingProfile(cachedSlug);
    if (cachedProfile) {
      let templateChanged = false;
      if (isTemplateStyle(templateChoice) && templateChoice !== cachedProfile.metadata.template) {
        cachedProfile.metadata.template = templateChoice;
        cachedProfile.metadata.primary_color = TEMPLATE_COLORS[templateChoice];
        templateChanged = true;
      }
      return { profile: cachedProfile, pdfHash, fromCache: true, cachedSlug, templateChanged, scoreBefore: cachedProfile.metadata.score_before ?? computeCvScore(cachedProfile), suggestedTitles: cachedProfile.metadata.suggested_titles ?? [] };
    }
  }

  // Permanent memory, independent of the pending cache above: if this exact
  // file was ever read before, reuse that extraction verbatim instead of
  // asking Claude to re-read it. Extraction isn't perfectly deterministic
  // run-to-run, so without this, a "before" score computed from an older
  // reading of this same file could genuinely differ from an "after" score
  // computed post-improvement on a brand new reading — a real mismatch,
  // just not one caused by anything actually being lost. Also skips a paid
  // extraction call entirely on a repeat upload.
  const remembered = await getRememberedProfile(pdfHash);
  let profile: ProfileSchema;
  let suggestedTitles: string[];
  if (remembered) {
    profile = remembered;
    suggestedTitles = remembered.metadata.suggested_titles ?? [];
  } else {
    const parsed = await parseResume(buf);
    profile = parsed.profile;
    suggestedTitles = parsed.suggestedTitles;
    profile.metadata.suggested_titles = suggestedTitles;
    // Normalize apostrophes in name (e.g. D'Assano → Dassano)
    profile.personal_info.full_name = profile.personal_info.full_name.replace(/'/g, "");
    await rememberProfile(pdfHash, profile);
  }

  // User's choice always wins over the AI suggestion
  if (isTemplateStyle(templateChoice)) {
    profile.metadata.template = templateChoice;
    profile.metadata.primary_color = TEMPLATE_COLORS[templateChoice];
  }

  return { profile, pdfHash, fromCache: false, cachedSlug: null, templateChanged: false, scoreBefore: profile.metadata.score_before ?? computeCvScore(profile), suggestedTitles };
}
