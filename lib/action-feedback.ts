import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export type FeedbackActionType = "generate" | "tailor";

const LAST_SHOWN_KEY_PREFIX = "jobli_feedback_last_shown_";

// Not "ask once, forever" — the popup is meant to check back in periodically
// so a user can leave more than one rating over time, without ever feeling
// naggy. Cooldown applies whether the user answered, dismissed, or the
// popup just happened to show and got auto-hidden — any of those "uses up"
// this window equally.
const COOLDOWN_DAYS = 21;
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

function lastShownLocally(actionType: FeedbackActionType): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(LAST_SHOWN_KEY_PREFIX + actionType);
  return raw ? Number(raw) : 0;
}

// Called the moment the popup actually appears (not on every eligibility
// check) — starts this device's cooldown regardless of whether the user
// goes on to submit a rating or just closes it.
export function recordFeedbackShown(actionType: FeedbackActionType) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LAST_SHOWN_KEY_PREFIX + actionType, String(Date.now()));
  }
}

export async function isFeedbackEligible(actionType: FeedbackActionType): Promise<boolean> {
  if (Date.now() - lastShownLocally(actionType) < COOLDOWN_MS) return false;

  const supabase = createBrowserSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false; // not signed in — nothing to ask, nothing to save

  // Cross-device cooldown: also check the most recent real submission in the
  // DB, so switching devices doesn't reset the "ogni tanto" cadence.
  const { data } = await supabase
    .from("action_feedback")
    .select("created_at")
    .eq("user_id", userData.user.id)
    .eq("action_type", actionType)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (data && Date.now() - new Date(data.created_at).getTime() < COOLDOWN_MS) return false;
  return true;
}

export async function submitFeedback(actionType: FeedbackActionType, rating: number, comment: string) {
  const supabase = createBrowserSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  // A new row every time, not an upsert — this is a periodic pulse check,
  // so the history of ratings over time (visible in /admin/feedback) is the
  // point, not a single "final answer" per user.
  await supabase.from("action_feedback").insert({
    user_id: userData.user.id,
    action_type: actionType,
    rating,
    comment: comment.trim() || null,
  });
}
