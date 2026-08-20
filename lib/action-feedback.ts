import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export type FeedbackActionType = "generate" | "tailor";

const DISMISS_KEY_PREFIX = "jobli_feedback_dismissed_";

// A row in action_feedback (see supabase/migrations/0015_action_feedback.sql)
// is the source of truth for "already asked and answered" — it's unique per
// (user_id, action_type), so a real submission is permanent and cross-device.
// A dismiss without submitting has no server-side record (nothing meaningful
// to store), so it's tracked best-effort in localStorage instead, just to
// avoid nagging the same browser again this device.
export async function hasGivenFeedback(actionType: FeedbackActionType): Promise<boolean> {
  if (typeof window !== "undefined" && localStorage.getItem(DISMISS_KEY_PREFIX + actionType)) {
    return true;
  }
  const supabase = createBrowserSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return true; // not signed in — nothing to ask, nothing to save

  const { data } = await supabase
    .from("action_feedback")
    .select("id")
    .eq("user_id", userData.user.id)
    .eq("action_type", actionType)
    .maybeSingle();
  return !!data;
}

export function dismissFeedback(actionType: FeedbackActionType) {
  if (typeof window !== "undefined") {
    localStorage.setItem(DISMISS_KEY_PREFIX + actionType, "1");
  }
}

export async function submitFeedback(actionType: FeedbackActionType, rating: number, comment: string) {
  const supabase = createBrowserSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  await supabase.from("action_feedback").insert({
    user_id: userData.user.id,
    action_type: actionType,
    rating,
    comment: comment.trim() || null,
  });
  dismissFeedback(actionType);
}
