// Single source of truth for every PostHog event this app sends — name,
// shape, and nothing else. Deliberately dependency-free (no posthog-js, no
// posthog-node) so it's safe to import from anywhere: client components,
// Node routes, and the one Edge route (see lib/analytics-edge.ts) alike.
//
// Naming: snake_case, object_action, past tense — matches PostHog's own
// convention and keeps the Insights UI sortable/searchable by object.
//
// PRIVACY: no field here may ever hold CV content, a name, an email, or a
// phone number — counts, durations, codes, and enums only. Every event was
// checked against this rule when added; re-check it again before adding one.

export type CvParseErrorReason =
  | "no_text_layer"
  | "encrypted_pdf"
  | "unsupported_format"
  | "empty_document"
  | "parse_timeout"
  | "not_a_resume"
  | "llm_error";

export interface AnalyticsEvents {
  signup_completed: { method: "password" | "google" };
  cv_upload_started: { file_size_kb: number; file_type: string };
  cv_parse_succeeded: { ms_elapsed: number; n_experiences: number; n_skills: number; has_multi_column: boolean };
  cv_parse_failed: { error_reason: CvParseErrorReason; file_size_kb: number; file_type: string };
  score_viewed: { score_total: number; quantified_results: number; clarity: number; ats_structure: number; specific_skills: number };
  profile_page_generated: { ms_elapsed: number };
  job_ad_pasted: { ad_length_chars: number };
  adaptation_completed: { ms_since_signup: number; is_first_adaptation: boolean };
  download_completed: { format: "pdf" | "docx"; template: string; credits_left: number };
  credits_requested: { extra_credits: number };
  public_page_viewed: { profile_owner_id: string };
}

export type AnalyticsEventName = keyof AnalyticsEvents;

// PostHog persists its own anonymous distinct_id as a first-party cookie
// once statistics consent is granted (see lib/analytics-client.ts) — a
// route with no logged-in user can read it here so a server-only event
// still lands on the same visitor timeline instead of an orphaned random
// id. Falls back to a fresh id when absent (no consent yet, or this SDK
// version's cookie is named differently) — those events are still useful
// in aggregate, just not correlatable to that visitor's later funnel steps.
// Takes a plain `{ get(name): { value: string } | undefined }` rather than
// NextRequest's own cookies type so it works identically for the Edge
// route's request.cookies and a Node route's request.cookies alike.
export function readPosthogDistinctId(
  cookies: { get(name: string): { value: string } | undefined },
  apiKey: string | undefined
): string {
  if (apiKey) {
    const cookie = cookies.get(`ph_${apiKey}_posthog`)?.value;
    if (cookie) {
      try {
        return JSON.parse(cookie).distinct_id ?? crypto.randomUUID();
      } catch {
        // fall through
      }
    }
  }
  return crypto.randomUUID();
}
