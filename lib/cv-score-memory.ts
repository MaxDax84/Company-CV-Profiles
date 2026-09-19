import { kv } from "./kv";
import type { ProfileSchema } from "./schema";

// Keyed by the exact PDF's content hash, so re-uploading the identical file
// — whether an original source CV or one of our own exported PDFs — resolves
// to the exact same extracted data instead of a fresh extraction pass that
// could genuinely differ. Longer-lived than the 1-hour "pending profile" KV
// entries (see lib/profile-store.ts), but NOT permanent: the entry holds the
// full parsed CV (name, email, phone, work history), often from someone who
// never created an account, so it expires 30 days after it was last used and
// is purged outright when the owning account is deleted (see
// forgetRememberedProfiles below and app/api/account/delete/route.ts).
//
// 30 days since last use is the retention ceiling because that is the
// window this cache actually serves: a job seeker re-uploading the same file
// across one job-hunt cycle (accidental resubmit, "let me try another
// template", re-uploading our own export to tailor it again) lands well
// inside it, and anything older is re-extracted at the cost of one Claude
// call — the score comparison stays honest either way, since a re-extraction
// only ever produces a new "before" alongside its own "after". The TTL is
// refreshed on every hit (sliding window), so a file that is genuinely in
// active use never expires under the user, while an abandoned one-off
// anonymous upload is gone a month later.
//
// This used to remember only the computed SCORE, not the profile itself.
// That was the real cause behind a second, subtler round of "score drops
// after optimization" reports: the remembered "before" score could be
// pinned to an OLDER extraction of the same PDF, while "after" reflected a
// freshly re-extracted profile from a NEW parseResume() call once the
// short-lived pending-cache had expired — two genuinely different
// extractions (Claude's reading of a CV isn't perfectly deterministic
// run-to-run), scored honestly but not comparably. Remembering the whole
// profile instead makes "before" and "after" mathematically guaranteed to
// start from identical data whenever the same file resurfaces, and also
// means a formula change never needs its own cache-versioning scheme:
// there's no separately-cached number to go stale, only a profile to
// re-score on demand.
//
// The profile's own metadata.score_before (the AI-judged rubric score from
// its original extraction, see lib/parse-resume.ts) travels along inside it
// and is what "before" actually means downstream — an entry remembered
// before that field existed gets it backfilled on next read, see
// reconstructScoreBefore() in lib/cv-score.ts.
const PROFILE_MEMORY_PREFIX = "cv-profile-memory:";
export const PROFILE_MEMORY_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days since last use

// Web Crypto works in both edge and Node runtimes, so this stays usable from
// both /api/parse-resume (edge) and /api/pdf/[slug] (Node).
export async function hashPdf(data: ArrayBuffer | Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", data as BufferSource);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getRememberedProfile(pdfHash: string): Promise<ProfileSchema | null> {
  const key = `${PROFILE_MEMORY_PREFIX}${pdfHash}`;
  const raw = await kv.get<string>(key);
  if (!raw) return null;
  // Slide the expiry: a hit means this file is still in use, so it earns
  // another 30 days from now rather than from when it was first remembered.
  await kv.expire(key, PROFILE_MEMORY_TTL_SECONDS);
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

export async function rememberProfile(pdfHash: string, profile: ProfileSchema): Promise<void> {
  await kv.set(`${PROFILE_MEMORY_PREFIX}${pdfHash}`, JSON.stringify(profile), { ex: PROFILE_MEMORY_TTL_SECONDS });
}

// Drops the remembered extractions for the given PDF hashes — called from
// account deletion with every pdf_hash found on the user's saved CVs, so
// the parsed personal data doesn't outlive the account for up to another
// 30 days. Tolerates an empty list (older CVs saved before the pdf_hash
// column existed have none).
export async function forgetRememberedProfiles(pdfHashes: string[]): Promise<void> {
  const keys = [...new Set(pdfHashes.filter(Boolean))].map((h) => `${PROFILE_MEMORY_PREFIX}${h}`);
  if (keys.length === 0) return;
  await kv.del(...keys);
}
