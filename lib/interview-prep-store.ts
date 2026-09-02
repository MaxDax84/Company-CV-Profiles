import type { SupabaseClient } from "@supabase/supabase-js";
import { toSlug } from "./profile-store";
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
