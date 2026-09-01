import { NextRequest, NextResponse } from "next/server";
import { tailorResumeRatelimit, getClientIp } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CREDIT_COSTS, InsufficientCreditsError, getAccountCode } from "@/lib/credits";
import { spendCredits } from "@/lib/credits-server";
import { fetchJobPostingText } from "@/lib/job-posting-fetch";
import { generateInterviewPrep } from "@/lib/interview-prep";
import { hashInterviewJobPosting, saveInterviewPrep, findDuplicateInterviewPrep } from "@/lib/interview-prep-store";

// Same headroom as tailor-resume: a Claude call plus (here) several
// server-side web_search/web_fetch round trips within that one call.
export const maxDuration = 120;

const JOB_TEXT_MIN = 200;
const JOB_TEXT_MAX = 20_000;
// Only ever ISO 639-1 codes from components/translate-cv-button.tsx's fixed
// language list (e.g. "it", "es", "zh") — never free text.
const MAX_LANGUAGE_CODE_LENGTH = 8;

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    // Reuses tailor-resume's budget — same shape of request (a Claude call
    // triggered by a pasted job posting), no need for a second bucket.
    const { success, reset } = await tailorResumeRatelimit.limit(clientIp);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a bit." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)) } }
      );
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const jobSource = body?.jobSource;
    if (jobSource !== "text" && jobSource !== "url") {
      return NextResponse.json({ error: "Invalid or missing jobSource." }, { status: 400 });
    }

    const language = typeof body?.language === "string" ? body.language.trim() : "";
    if (!language || language.length > MAX_LANGUAGE_CODE_LENGTH) {
      return NextResponse.json({ error: "Invalid language." }, { status: 400 });
    }

    let jobPostingText: string;
    if (jobSource === "text") {
      const jobText = body?.jobText;
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
      const jobUrl = body?.jobUrl;
      if (typeof jobUrl !== "string" || !jobUrl.trim()) {
        return NextResponse.json({ error: "No job posting URL provided" }, { status: 400 });
      }
      const fetched = await fetchJobPostingText(jobUrl.trim());
      if (!fetched.ok) {
        return NextResponse.json({ error: fetched.reason, code: "JOB_FETCH_FAILED" }, { status: 422 });
      }
      jobPostingText = fetched.text;
    }

    const jobHash = await hashInterviewJobPosting(user.id, jobPostingText);

    // Skip re-researching (and re-charging) a posting this account already
    // ran, unless the caller explicitly confirms they want a fresh run —
    // same duplicate-guard shape as tailor-resume's relevance check, just
    // inline here since there's no separate free pre-check step for this
    // feature.
    if (body?.forceRegenerate !== true) {
      const duplicate = await findDuplicateInterviewPrep(supabase, user.id, jobHash);
      if (duplicate) {
        return NextResponse.json({ duplicateOf: duplicate }, { status: 409 });
      }
    }

    try {
      await spendCredits(supabase, CREDIT_COSTS.interviewPrep, "interview_prep", jobPostingText.slice(0, 120));
    } catch (err) {
      if (err instanceof InsufficientCreditsError) {
        return NextResponse.json(
          { error: "Not enough credits to prepare this interview report.", code: "INSUFFICIENT_CREDITS" },
          { status: 402 }
        );
      }
      throw err;
    }

    const content = await generateInterviewPrep(jobPostingText, language, user.id);
    const { slug } = await saveInterviewPrep(supabase, user.id, content, jobHash);
    const code = await getAccountCode(supabase, user.id);

    return NextResponse.json({ slug, code, content });
  } catch (err) {
    console.error("[interview-prep]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
