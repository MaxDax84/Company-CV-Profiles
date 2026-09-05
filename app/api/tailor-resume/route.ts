import { NextRequest, NextResponse } from "next/server";
import { tailorResumeAuthedRatelimit, getClientIp } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileRow, getOwnedProfileBySlug, saveTailoredProfile, hashJobPosting } from "@/lib/profile-store";
import { getAccountCode } from "@/lib/credits";
import { fetchJobPostingText } from "@/lib/job-posting-fetch";
import { tailorResume } from "@/lib/tailor-resume";
import { trackServer } from "@/lib/analytics-server";

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

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    // Every caller here is already authenticated (checked above) — always
    // the higher, per-account budget, keyed by user id rather than IP.
    const { success, reset } = await tailorResumeAuthedRatelimit.limit(user.id);
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

    // Counted before this run's save below, so a count of 0 here means this
    // IS the first one — cheap existence check, same pattern as the
    // MAX_PRIMARY_PROFILES_PER_USER check in claimPendingProfile.
    const { count: priorTailoredCount } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("kind", "tailored");

    // --- Tailor — free. Only the resulting file (PDF/Word) costs a credit,
    // spent at download time in /api/pdf/[slug] and /api/cv-word/[slug].
    const sourceProfile = sourceRow.data;
    const tailored = await tailorResume(sourceProfile, jobPostingText, user.id);

    // Set by route code, not trusted to the model, so the before/after panel
    // always has something to compare against.
    tailored.personal_info.bio_original = sourceProfile.personal_info.bio;
    tailored.metadata.generated_at = new Date().toISOString();

    const jobHash = await hashJobPosting(sourceRow.id, jobPostingText);
    const { slug } = await saveTailoredProfile(supabase, user.id, sourceRow.id, tailored, jobHash);
    const code = await getAccountCode(supabase, user.id);

    // Fired here, once the tailored result actually exists — not on the
    // form's submit click — matching the spec's activation-metric rule.
    await trackServer(user.id, "adaptation_completed", {
      ms_since_signup: Date.now() - new Date(user.created_at).getTime(),
      is_first_adaptation: (priorTailoredCount ?? 0) === 0,
    });

    return NextResponse.json({ slug, code, profile: tailored });
  } catch (err) {
    console.error("[tailor-resume]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
