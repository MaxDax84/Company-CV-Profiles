import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChatTurn } from "./cv-chat-question";

export interface ChatSessionState {
  transcript: ChatTurn[];
  questionCount: number;
}

// Reads the session for this profile — a completed one is treated as if it
// didn't exist, so the next call always starts a fresh conversation rather
// than resuming a finished one. One row per profile (see
// supabase/migrations/0022_cv_chat_sessions.sql), never a history to browse.
export async function getActiveChatSession(supabase: SupabaseClient, profileId: string): Promise<ChatSessionState> {
  const { data } = await supabase
    .from("cv_chat_sessions")
    .select("transcript, status, question_count")
    .eq("profile_id", profileId)
    .maybeSingle();
  if (!data || data.status === "completed") {
    return { transcript: [], questionCount: 0 };
  }
  return { transcript: (data.transcript ?? []) as ChatTurn[], questionCount: data.question_count as number };
}

// Overwrites the whole transcript — called once per turn, only after the
// next question has already been chosen successfully, so a failed Claude
// call never leaves a half-written turn behind for the client to retry
// against inconsistent state.
export async function saveChatTurn(
  supabase: SupabaseClient,
  userId: string,
  profileId: string,
  transcript: ChatTurn[]
): Promise<void> {
  const { error } = await supabase
    .from("cv_chat_sessions")
    .upsert(
      { user_id: userId, profile_id: profileId, transcript, status: "active", question_count: transcript.length },
      { onConflict: "profile_id" }
    );
  if (error) throw error;
}

export async function markChatSessionCompleted(supabase: SupabaseClient, profileId: string): Promise<void> {
  const { error } = await supabase
    .from("cv_chat_sessions")
    .update({ status: "completed" })
    .eq("profile_id", profileId);
  if (error) throw error;
}
