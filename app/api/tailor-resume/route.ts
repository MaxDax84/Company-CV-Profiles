import { NextRequest, NextResponse } from "next/server";
import type { ProfileSchema } from "@/lib/schema";
import { isTemplateStyle, TEMPLATE_COLORS } from "@/lib/templates";
import { tailorResumeRatelimit, getClientIp } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { resolveProfileFromPdf, saveNewProfile, getProfileBySlug, extractSlugFromProfileUrl } from "@/lib/profile-store";
import { fetchJobPostingText } from "@/lib/job-posting-fetch";
import { tailorResume } from "@/lib/tailor-resume";

// Node runtime (not edge): this route makes two sequential Claude calls
// (PDF extraction + tailoring), which can exceed the edge runtime's fixed
// 25s execution ceiling — maxDuration only takes effect on Node functions.
// Bumped from 60s after a real 504 (Vercel Runtime Timeout) on a long CV +
// long job posting combo — two sequential Claude calls can exceed 60s.
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

    const formData = await req.formData();

    const turnstileToken = formData.get("turnstileToken");
    const captchaOk = await verifyTurnstile(
      typeof turnstileToken === "string" ? turnstileToken : null,
      clientIp
    );
    if (!captchaOk) {
      return NextResponse.json({ error: "Captcha verification failed. Please try again." }, { status: 403 });
    }

    const cvSource = formData.get("cvSource");
    if (cvSource !== "pdf" && cvSource !== "url") {
      return NextResponse.json({ error: "Invalid or missing cvSource." }, { status: 400 });
    }

    const jobSource = formData.get("jobSource");
    if (jobSource !== "text" && jobSource !== "url") {
      return NextResponse.json({ error: "Invalid or missing jobSource." }, { status: 400 });
    }

    const templateChoice = formData.get("template");

    // --- Resolve the source CV ---
    let sourceProfile: ProfileSchema;
    if (cvSource === "pdf") {
      const file = formData.get("pdf");
      if (!file || !(file instanceof Blob)) {
        return NextResponse.json({ error: "No PDF file provided" }, { status: 400 });
      }
      if (file.type !== "application/pdf") {
        return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
      }
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "PDF must be under 10 MB" }, { status: 413 });
      }
      const arrayBuffer = await file.arrayBuffer();
      const resolved = await resolveProfileFromPdf(arrayBuffer, templateChoice);
      sourceProfile = resolved.profile;
    } else {
      const profileUrl = formData.get("profileUrl");
      if (typeof profileUrl !== "string" || !profileUrl.trim()) {
        return NextResponse.json({ error: "No profile URL provided" }, { status: 400 });
      }
      const slug = extractSlugFromProfileUrl(profileUrl.trim());
      if (!slug) {
        return NextResponse.json({ error: "That doesn't look like a valid profile link." }, { status: 400 });
      }
      const found = await getProfileBySlug(slug);
      if (!found) {
        return NextResponse.json({ error: "Profile not found or expired." }, { status: 404 });
      }
      sourceProfile = found;
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

    // --- Tailor ---
    const tailored = await tailorResume(sourceProfile, jobPostingText);

    // Set by route code, not trusted to the model, so the before/after panel
    // always has something to compare against.
    tailored.personal_info.bio_original = sourceProfile.personal_info.bio;
    tailored.metadata.generated_at = new Date().toISOString();

    if (isTemplateStyle(templateChoice)) {
      tailored.metadata.template = templateChoice;
      tailored.metadata.primary_color = TEMPLATE_COLORS[templateChoice];
    }

    const { slug, manageToken } = await saveNewProfile(tailored);

    return NextResponse.json({ slug, profile: tailored, manageToken });
  } catch (err) {
    console.error("[tailor-resume]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
