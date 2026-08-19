import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChatTurn } from "./cv-chat-question";

export interface ChatSessionRow {
  id: string;
  status: "active" | "completed";
  transcript: ChatTurn[];
  question_count: number;
}

// Loads the caller's chat session for this profile, creating one if none
// exists yet, and transparently resetting it if the last session was
// already completed — "restart" is just "the next call sees status
// completed and starts over on the same row" (see migration 0012's own
// comment: one row per profile, not a session-history table).
export async function getActiveChatSession(
  supabase: SupabaseClient,
  userId: string,
  profileId: string
): Promise<ChatSessionRow> {
  const { data } = await supabase
    .from("cv_chat_sessions")
    .select("id, status, transcript, question_count")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (!data) {
    const { data: created, error } = await supabase
      .from("cv_chat_sessions")
      .insert({ user_id: userId, profile_id: profileId })
      .select("id, status, transcript, question_count")
      .single();
    if (error) throw error;
    return created as ChatSessionRow;
  }

  if (data.status === "completed") {
    const { data: reset, error } = await supabase
      .from("cv_chat_sessions")
      .update({ status: "active", transcript: [], question_count: 0, updated_at: new Date().toISOString() })
      .eq("id", data.id)
      .select("id, status, transcript, question_count")
      .single();
    if (error) throw error;
    return reset as ChatSessionRow;
  }

  return data as ChatSessionRow;
}

export async function saveChatTurn(
  supabase: SupabaseClient,
  sessionId: string,
  transcript: ChatTurn[],
  questionCount: number
): Promise<void> {
  const { error } = await supabase
    .from("cv_chat_sessions")
    .update({ transcript, question_count: questionCount, updated_at: new Date().toISOString() })
    .eq("id", sessionId);
  if (error) throw error;
}

export async function markChatSessionCompleted(supabase: SupabaseClient, sessionId: string): Promise<void> {
  const { error } = await supabase
    .from("cv_chat_sessions")
    .update({ status: "completed", updated_at: new Date().toISOString() })
    .eq("id", sessionId);
  if (error) throw error;
}
