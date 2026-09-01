import { NextRequest, NextResponse } from "next/server";
import { interviewPrepAnonymousRatelimit, getClientIp } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { fetchJobPostingText } from "@/lib/job-posting-fetch";
import { generateInterviewPrep } from "@/lib/interview-prep";
import { savePendingInterviewPrep } from "@/lib/interview-prep-store";

// No auth required — this is the pre-signup entry point reached from
// /interview-prep (itself reached from /start's "Prepara il colloquio"
// button). Generation is free here; the 2 credits are charged only once the
// report is claimed into a real account (see claimPendingInterviewPrep) —
// mirroring how /api/parse-resume lets an anonymous visitor generate a CV
// preview for free before any account exists.
export const maxDuration = 120;

const JOB_TEXT_MIN = 200;
const JOB_TEXT_MAX = 20_000;
const MAX_LANGUAGE_CODE_LENGTH = 8;

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const { success, reset } = await interviewPrepAnonymousRatelimit.limit(clientIp);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a bit." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)) } }
      );
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

    const languageRaw = formData.get("language");
    const language = typeof languageRaw === "string" ? languageRaw.trim() : "";
    if (!language || language.length > MAX_LANGUAGE_CODE_LENGTH) {
      return NextResponse.json({ error: "Invalid language." }, { status: 400 });
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

    const content = await generateInterviewPrep(jobPostingText, language);
    const { slug, claimToken } = await savePendingInterviewPrep(content);

    return NextResponse.json({ slug, claimToken, content });
  } catch (err) {
    console.error("[interview-prep/anonymous]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
