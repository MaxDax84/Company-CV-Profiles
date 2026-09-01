import type { SupabaseClient } from "@supabase/supabase-js";
import { kv } from "./kv";
import { toSlug, PENDING_TTL_SECONDS } from "./profile-store";
import { CREDIT_COSTS, InsufficientCreditsError } from "./credits";
import { spendCredits } from "./credits-server";
import type { InterviewPrepContent } from "./interview-prep";

// Storage for "Prepara il colloquio" reports — see
// supabase/migrations/0029_interview_preps.sql for why this is its own
// table, unrelated to `profiles`.

export interface InterviewPrepRow {
  id: string;
  slug: string;
  company_name: string | null;
  content: InterviewPrepContent;
  language: string;
  created_at: string;
}

// Same normalize-then-hash approach as hashJobPosting in profile-store.ts —
// scoped by user (not a source CV id, since this feature has none) so two
// different accounts pasting the same public job posting don't collide.
export async function hashInterviewJobPosting(userId: string, jobPostingText: string): Promise<string> {
  const normalized = jobPostingText.trim().toLowerCase().replace(/\s+/g, " ");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${userId}:${normalized}`));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export interface DuplicateInterviewPrepMatch {
  slug: string;
  createdAt: string;
}

// Warns before spending the 2 credits again on a job posting this account
// has already researched — mirrors findDuplicateTailoredProfile's reasoning.
export async function findDuplicateInterviewPrep(
  supabase: SupabaseClient,
  userId: string,
  jobHash: string
): Promise<DuplicateInterviewPrepMatch | null> {
  const { data } = await supabase
    .from("interview_preps")
    .select("slug, created_at")
    .eq("user_id", userId)
    .eq("job_hash", jobHash)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return { slug: data.slug, createdAt: data.created_at };
}

export async function saveInterviewPrep(
  supabase: SupabaseClient,
  userId: string,
  content: InterviewPrepContent,
  jobHash: string
): Promise<{ slug: string }> {
  const baseSlug = toSlug(content.company_name ?? content.role_title ?? "colloquio") || "colloquio";

  for (let attempt = 0; attempt < 10; attempt++) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;
    const { error } = await supabase.from("interview_preps").insert({
      user_id: userId,
      slug,
      company_name: content.company_name,
      job_hash: jobHash,
      content,
      language: content.language,
    });
    if (!error) return { slug };
    if (error.code !== "23505") throw error;
  }

  throw new Error("Could not allocate a unique slug for the interview prep report.");
}

// Anonymous flow (no account yet): a just-generated report lives in KV for a
// short window, same TTL/reasoning as savePendingProfile in profile-store.ts
// — long enough for "paste a job posting, look at it, sign up" in one
// sitting, short enough that an abandoned preview cleans itself up.
export async function savePendingInterviewPrep(
  content: InterviewPrepContent,
  jobHash?: string
): Promise<{ slug: string; claimToken: string }> {
  const baseSlug = toSlug(content.company_name ?? content.role_title ?? "colloquio") || "colloquio";
  let slug = baseSlug;
  let attempt = 0;
  while (await kv.exists(`interview-pending:${slug}`)) {
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  await kv.set(`interview-pending:${slug}`, JSON.stringify(content), { ex: PENDING_TTL_SECONDS });

  const claimToken = crypto.randomUUID();
  await kv.set(`interview-claim:${claimToken}`, JSON.stringify({ slug, jobHash }), { ex: PENDING_TTL_SECONDS });

  return { slug, claimToken };
}

export async function getPendingInterviewPrep(slug: string): Promise<InterviewPrepContent | null> {
  const raw = await kv.get<string>(`interview-pending:${slug}`);
  if (!raw) return null;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

export type InterviewClaimError = "expired" | "insufficient_credits" | "claim_failed";

// Moves a pending KV preview into the caller's permanent account, exactly
// like claimPendingProfile — except claiming here also spends the 2 credits
// the report actually costs, since (unlike a CV) nothing was charged yet at
// generation time for an anonymous visitor. `supabase` must be a
// request-scoped, already-authenticated client — spendCredits and the
// insert both rely on it.
export async function claimPendingInterviewPrep(
  supabase: SupabaseClient,
  userId: string,
  claimToken: string
): Promise<{ slug: string } | { error: InterviewClaimError }> {
  const claimRaw = await kv.get<string>(`interview-claim:${claimToken}`);
  if (!claimRaw) return { error: "expired" };
  const { slug: pendingSlug, jobHash } = typeof claimRaw === "string" ? JSON.parse(claimRaw) : claimRaw;

  const content = await getPendingInterviewPrep(pendingSlug);
  if (!content) return { error: "expired" };

  try {
    await spendCredits(supabase, CREDIT_COSTS.interviewPrep, "interview_prep", content.company_name ?? content.role_title ?? undefined);
  } catch (err) {
    if (err instanceof InsufficientCreditsError) return { error: "insufficient_credits" };
    throw err;
  }

  for (let attempt = 0; attempt < 10; attempt++) {
    const slug = attempt === 0 ? pendingSlug : `${pendingSlug}-${attempt}`;
    const { error: insertError } = await supabase.from("interview_preps").insert({
      user_id: userId,
      slug,
      company_name: content.company_name,
      job_hash: jobHash ?? null,
      content,
      language: content.language,
    });
    if (!insertError) {
      await kv.del(`interview-pending:${pendingSlug}`);
      await kv.del(`interview-claim:${claimToken}`);
      return { slug };
    }
    if (insertError.code !== "23505") return { error: "claim_failed" };
  }

  return { error: "claim_failed" };
}

export async function getOwnedInterviewPrepBySlug(
  supabase: SupabaseClient,
  userId: string,
  slug: string
): Promise<InterviewPrepRow | null> {
  const { data } = await supabase
    .from("interview_preps")
    .select("id, slug, company_name, content, language, created_at")
    .eq("user_id", userId)
    .eq("slug", slug)
    .maybeSingle();
  return data as InterviewPrepRow | null;
}

// Every report a user has generated, newest first — shown as a list in the
// account's "Prepara il colloquio" tab, same pattern as
// getOwnedTailoredProfiles.
export async function getOwnedInterviewPreps(
  supabase: SupabaseClient,
  userId: string
): Promise<InterviewPrepRow[]> {
  const { data } = await supabase
    .from("interview_preps")
    .select("id, slug, company_name, content, language, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as InterviewPrepRow[];
}
