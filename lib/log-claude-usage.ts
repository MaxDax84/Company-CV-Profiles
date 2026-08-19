// Logs the real token usage (and an estimated $ cost) of a Claude API call
// to the server console — shows up in Vercel's function logs. Not shown to
// users anywhere; purely for us to see actual per-call cost instead of
// guessing from typical token counts.

export interface ClaudeUsage {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
}

// $ per million tokens. Current list prices as of 2026-08 — update here if
// pricing changes; cache reads are billed at a fraction of the input rate,
// cache writes at a premium over it, per Anthropic's standard scheme.
const PRICING: Record<string, { input: number; output: number; cacheWrite: number; cacheRead: number }> = {
  "claude-haiku-4-5-20251001": { input: 1.0, output: 5.0, cacheWrite: 1.25, cacheRead: 0.1 },
  "claude-sonnet-5": { input: 2.0, output: 10.0, cacheWrite: 2.5, cacheRead: 0.2 }, // intro pricing through 2026-08-31
};

export function logClaudeUsage(label: string, model: string, usage: ClaudeUsage | undefined): void {
  if (!usage) return;
  const price = PRICING[model];
  const cacheWrite = usage.cache_creation_input_tokens ?? 0;
  const cacheRead = usage.cache_read_input_tokens ?? 0;
  const costUsd = price
    ? (usage.input_tokens * price.input +
        usage.output_tokens * price.output +
        cacheWrite * price.cacheWrite +
        cacheRead * price.cacheRead) /
      1_000_000
    : null;
  console.log(
    `[claude-usage] ${label} model=${model} input=${usage.input_tokens} output=${usage.output_tokens} ` +
      `cache_write=${cacheWrite} cache_read=${cacheRead}` +
      (costUsd !== null ? ` cost≈$${costUsd.toFixed(4)}` : "")
  );
}
