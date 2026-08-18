import { kv } from "./kv";
import type { ProfileSchema } from "./schema";

// Keyed by the exact PDF's content hash, so re-uploading the identical file
// — whether an original source CV or one of our own exported PDFs — always
// resolves to the exact same extracted data instead of a fresh extraction
// pass that could genuinely differ. No TTL: once a document has been read,
// that reading is permanent, unlike the short-lived "pending profile" KV
// entries (see lib/profile-store.ts).
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

// Web Crypto works in both edge and Node runtimes, so this stays usable from
// both /api/parse-resume (edge) and /api/pdf/[slug] (Node).
export async function hashPdf(data: ArrayBuffer | Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", data as BufferSource);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getRememberedProfile(pdfHash: string): Promise<ProfileSchema | null> {
  const raw = await kv.get<string>(`${PROFILE_MEMORY_PREFIX}${pdfHash}`);
  if (!raw) return null;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

export async function rememberProfile(pdfHash: string, profile: ProfileSchema): Promise<void> {
  await kv.set(`${PROFILE_MEMORY_PREFIX}${pdfHash}`, JSON.stringify(profile));
}
