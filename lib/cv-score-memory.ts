import { kv } from "./kv";
import type { CvScoreBreakdown } from "./cv-score";

// Keyed by the exact PDF's content hash, so re-uploading the identical file
// — whether an original source CV or one of our own exported PDFs — always
// returns the same score instead of a fresh, inherently variable AI
// judgment. No TTL: once a document has been scored, that score is
// permanent, unlike the short-lived "pending profile" KV entries.
//
// Versioned (v2): the scoring logic itself changed twice in one night (the
// "before" score stopped being a separate subjective AI judgment, then
// improveResume() got a deterministic guard against silently dropping
// numbers from bullets). A score remembered under the OLD logic is wrong
// relative to what current code computes — and being permanent, it kept
// resurfacing on every re-test of the same PDF, which is exactly what looked
// like "the score keeps dropping after optimization" even after the actual
// bug was fixed. Bump this suffix whenever the scoring formula changes
// again, so stale entries are silently bypassed instead of manually purged.
const SCORE_MEMORY_PREFIX = "cv-score-memory:v2:";

// Web Crypto works in both edge and Node runtimes, so this stays usable from
// both /api/parse-resume (edge) and /api/pdf/[slug] (Node).
export async function hashPdf(data: ArrayBuffer | Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", data as BufferSource);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getRememberedScore(pdfHash: string): Promise<CvScoreBreakdown | null> {
  const raw = await kv.get<string>(`${SCORE_MEMORY_PREFIX}${pdfHash}`);
  if (!raw) return null;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

export async function rememberScore(pdfHash: string, score: CvScoreBreakdown): Promise<void> {
  await kv.set(`${SCORE_MEMORY_PREFIX}${pdfHash}`, JSON.stringify(score));
}
