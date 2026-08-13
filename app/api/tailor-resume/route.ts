import { NextRequest, NextResponse } from "next/server";
import { tailorResumeRatelimit, getClientIp } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileRow, getOwnedProfileBySlug, saveTailoredProfile } from "@/lib/profile-store";
import { spendCredits, CREDIT_COSTS, InsufficientCreditsError, getAccountCode } from "@/lib/credits";
import { fetchJobPostingText } from "@/lib/job-posting-fetch";
import { tailorResume } from "@/lib/tailor-resume";

// Node runtime (not edge): this route makes a Claude call and can exceed the
// edge runtime's fixed 25s execution ceiling — maxDuration only takes effect
// on Node functions. Bumped from 60s after a real 504 (Vercel Runtime
// Timeout) on a long CV + long job posting combo.
export const maxDuration = 120;

const JOB_TEXT_MIN = 200;
const JOB_TEXT_MAX = 20_000;

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
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

    const formData = await req.formData();

    const turnstileToken = formData.get("turnstileToken");
    const captchaOk = await verifyTurnstile(
      typeof turnstileToken === "string" ? turnstileToken : null,
      clientIp
    );
    if (!captchaOk) {
      return NextResponse.json({ error: "Captcha verification failed. Please try again." }, { status: 403 });
    }

    const jobSource = formData.get("jobSource");
    if (jobSource !== "text" && jobSource !== "url") {
      return NextResponse.json({ error: "Invalid or missing jobSource." }, { status: 400 });
    }

    // --- Resolve the source CV — a specific one of the caller's own
    // uploaded CVs if named (a user can have several, see /account), else
    // their most recently uploaded one.
    const sourceSlug = formData.get("sourceSlug");
    let sourceRow = typeof sourceSlug === "string" && sourceSlug
      ? await getOwnedProfileBySlug(supabase, user.id, sourceSlug)
      : await getOwnedProfileRow(supabase, user.id, "primary");
    // Only ever tailor an uploaded CV, never a previously-tailored one — a
    // crafted sourceSlug pointing at a kind='tailored' row is treated as
    // not found, same as any other invalid slug.
    if (sourceRow && "kind" in sourceRow && sourceRow.kind !== "primary") {
      sourceRow = null;
    }
    if (!sourceRow) {
      return NextResponse.json({ error: "Generate your profile first." }, { status: 404 });
    }

    // --- Resolve the job posting text ---
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

    // --- Spend the credit before running Claude. Not refunded if the
    // tailoring call itself later fails — an accepted v1 gap (see project plan).
    try {
      await spendCredits(supabase, CREDIT_COSTS.tailor, "tailor", sourceRow.data.personal_info.full_name);
    } catch (err) {
      if (err instanceof InsufficientCreditsError) {
        return NextResponse.json(
          { error: "Not enough credits to tailor your profile.", code: "INSUFFICIENT_CREDITS" },
          { status: 402 }
        );
      }
      throw err;
    }

    // --- Tailor ---
    const sourceProfile = sourceRow.data;
    const tailored = await tailorResume(sourceProfile, jobPostingText);

    // Set by route code, not trusted to the model, so the before/after panel
    // always has something to compare against.
    tailored.personal_info.bio_original = sourceProfile.personal_info.bio;
    tailored.metadata.generated_at = new Date().toISOString();

    const { slug } = await saveTailoredProfile(supabase, user.id, sourceRow.id, tailored);
    const code = await getAccountCode(supabase, user.id);

    return NextResponse.json({ slug, code, profile: tailored });
  } catch (err) {
    console.error("[tailor-resume]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
