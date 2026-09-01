import { createServiceSupabaseClient, isSupabaseConfigured } from "./supabase/service";

// Records the real token usage (and computed $ cost) of every Claude API
// call this app makes, permanently, in claude_usage_log — see
// supabase/migrations/0013_claude_usage_log.sql. Console logs alone aren't
// enough for this: Vercel's log retention is short, useless for building
// actual cost statistics or pricing/promo decisions over time.

export interface ClaudeUsage {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
}

// One entry per distinct Claude-calling operation in the app — kept as a
// union (not a free string) so a typo can't silently create a new,
// unqueryable operation label.
export type ClaudeOperation =
  | "parse_resume"
  | "improve_resume"
  | "tailor_resume"
  | "relevance_check"
  | "cover_letter"
  | "translate_resume"
  | "translate_cover_letter"
  | "cv_chat_question"
  | "cv_chat_finish"
  | "interview_prep";

// $ per million tokens — list prices. Update here if pricing changes; cache
// reads are billed at a fraction of the input rate, cache writes at a
// premium over it, per Anthropic's standard scheme.
const PRICING: Record<string, { input: number; output: number; cacheWrite: number; cacheRead: number }> = {
  "claude-haiku-4-5-20251001": { input: 1.0, output: 5.0, cacheWrite: 1.25, cacheRead: 0.1 },
  // Sonnet 5's $2/$10 intro pricing ended 2026-08-31 — back to list price.
  // Rows logged before this date (found while pricing credits, 2026-09-01)
  // are understated by ~33% and don't get retroactively recomputed.
  "claude-sonnet-5": { input: 3.0, output: 15.0, cacheWrite: 3.75, cacheRead: 0.3 },
};

function computeCostUsd(model: string, usage: ClaudeUsage, cacheWrite: number, cacheRead: number): number {
  const price = PRICING[model];
  if (!price) return 0;
  return (
    (usage.input_tokens * price.input +
      usage.output_tokens * price.output +
      cacheWrite * price.cacheWrite +
      cacheRead * price.cacheRead) /
    1_000_000
  );
}

// Fire-and-forget by design: a logging failure must never break the actual
// feature request that triggered it. Safe to call from any runtime (edge
// or node) — createServiceSupabaseClient() is a plain fetch-based client.
export function logClaudeUsage(
  operation: ClaudeOperation,
  model: string,
  usage: ClaudeUsage | undefined,
  userId?: string | null
): void {
  if (!usage) return;
  const cacheWrite = usage.cache_creation_input_tokens ?? 0;
  const cacheRead = usage.cache_read_input_tokens ?? 0;
  const costUsd = computeCostUsd(model, usage, cacheWrite, cacheRead);

  console.log(
    `[claude-usage] ${operation} model=${model} input=${usage.input_tokens} output=${usage.output_tokens} ` +
      `cache_write=${cacheWrite} cache_read=${cacheRead} cost≈$${costUsd.toFixed(4)}`
  );

  if (!isSupabaseConfigured()) return;
  const supabase = createServiceSupabaseClient();
  supabase
    .from("claude_usage_log")
    .insert({
      operation,
      model,
      input_tokens: usage.input_tokens,
      output_tokens: usage.output_tokens,
      cache_creation_tokens: cacheWrite,
      cache_read_tokens: cacheRead,
      cost_usd: costUsd,
      user_id: userId ?? null,
    })
    .then(({ error }) => {
      if (error) console.error("[claude-usage] failed to persist:", error);
    });
}
