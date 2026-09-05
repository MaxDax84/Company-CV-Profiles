import { NextRequest, NextResponse } from "next/server";
import { tailorResumeAuthedRatelimit } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileRow, getOwnedProfileBySlug, hashJobPosting, findDuplicateTailoredProfile } from "@/lib/profile-store";
import { fetchJobPostingText } from "@/lib/job-posting-fetch";
import { checkRelevance } from "@/lib/relevance-check";

// Cheap Haiku call — no Turnstile (that friction stays on the real,
// credit-spending /api/tailor-resume submission right after this) and no
// credit spent. Still authenticated + rate-limited since it's an unlimited
// free Claude call otherwise.
export const maxDuration = 30;

const JOB_TEXT_MIN = 200;
const JOB_TEXT_MAX = 20_000;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    // Shares tailorResumeAuthedRatelimit's bucket with /api/tailor-resume
    // (by design — see the comment above): this check plus the real
    // submission right after it draw from the same budget, so a user can't
    // get extra free Claude calls just by triggering this preview repeatedly.
    const { success, reset } = await tailorResumeAuthedRatelimit.limit(user.id);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a bit." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)) } }
      );
    }

    const formData = await req.formData();

    const jobSource = formData.get("jobSource");
    if (jobSource !== "text" && jobSource !== "url") {
      return NextResponse.json({ error: "Invalid or missing jobSource." }, { status: 400 });
    }

    const sourceSlug = formData.get("sourceSlug");
    let sourceRow = typeof sourceSlug === "string" && sourceSlug
      ? await getOwnedProfileBySlug(supabase, user.id, sourceSlug)
      : await getOwnedProfileRow(supabase, user.id, "primary");
    if (sourceRow && "kind" in sourceRow && sourceRow.kind !== "primary") {
      sourceRow = null;
    }
    if (!sourceRow) {
      return NextResponse.json({ error: "Generate your profile first." }, { status: 404 });
    }

    let jobPostingText: string;
    if (jobSource === "text") {
      const jobText = formData.get("jobText");
      if (typeof jobText !== "string") {
        return NextResponse.json({ error: "No job posting text provided" }, { status: 400 });
      }
      const trimmed = jobText.trim();
      if (trimmed.length < JOB_TEXT_MIN || trimmed.length > JOB_TEXT_MAX) {
        return NextResponse.json(
          { error: `Job posting text must be between ${JOB_TEXT_MIN} and ${JOB_TEXT_MAX} characters.` },
          { status: 400 }
        );
      }
      jobPostingText = trimmed;
    } else {
      const jobUrl = formData.get("jobUrl");
      if (typeof jobUrl !== "string" || !jobUrl.trim()) {
        return NextResponse.json({ error: "No job posting URL provided" }, { status: 400 });
      }
      const fetched = await fetchJobPostingText(jobUrl.trim());
      if (!fetched.ok) {
        return NextResponse.json({ error: fetched.reason, code: "JOB_FETCH_FAILED" }, { status: 422 });
      }
      jobPostingText = fetched.text;
    }

    const jobHash = await hashJobPosting(sourceRow.id, jobPostingText);
    const duplicateOf = await findDuplicateTailoredProfile(supabase, user.id, sourceRow.id, jobHash);

    const result = await checkRelevance(sourceRow.data, jobPostingText, user.id);
    return NextResponse.json({ ...result, duplicateOf });
  } catch (err) {
    console.error("[relevance-check]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
