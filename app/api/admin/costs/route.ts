import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { createServiceSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/service";

interface UsageRow {
  operation: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  created_at: string;
}

// Bounded fetch: this is an internal stats view, not a paginated export —
// 20k rows is far more than this app has generated so far and keeps the
// response fast without needing a dedicated SQL aggregation RPC.
const MAX_ROWS = 20000;

export async function GET(req: NextRequest) {
  if (!(await verifyAdminSession(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase
    .from("claude_usage_log")
    .select("operation, model, input_tokens, output_tokens, cost_usd, created_at")
    .order("created_at", { ascending: false })
    .limit(MAX_ROWS);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as UsageRow[];

  const byOperation = new Map<string, { count: number; totalCost: number; inputTokens: number; outputTokens: number }>();
  const byModel = new Map<string, { count: number; totalCost: number }>();
  const byDay = new Map<string, number>();

  let totalCost = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  for (const row of rows) {
    const cost = Number(row.cost_usd) || 0;
    totalCost += cost;
    totalInputTokens += row.input_tokens;
    totalOutputTokens += row.output_tokens;

    const op = byOperation.get(row.operation) ?? { count: 0, totalCost: 0, inputTokens: 0, outputTokens: 0 };
    op.count += 1;
    op.totalCost += cost;
    op.inputTokens += row.input_tokens;
    op.outputTokens += row.output_tokens;
    byOperation.set(row.operation, op);

    const model = byModel.get(row.model) ?? { count: 0, totalCost: 0 };
    model.count += 1;
    model.totalCost += cost;
    byModel.set(row.model, model);

    const day = row.created_at.slice(0, 10); // YYYY-MM-DD
    byDay.set(day, (byDay.get(day) ?? 0) + cost);
  }

  const operations = Array.from(byOperation.entries())
    .map(([operation, stats]) => ({
      operation,
      count: stats.count,
      totalCost: stats.totalCost,
      avgCost: stats.totalCost / stats.count,
      avgInputTokens: Math.round(stats.inputTokens / stats.count),
      avgOutputTokens: Math.round(stats.outputTokens / stats.count),
    }))
    .sort((a, b) => b.totalCost - a.totalCost);

  const models = Array.from(byModel.entries())
    .map(([model, stats]) => ({ model, count: stats.count, totalCost: stats.totalCost, avgCost: stats.totalCost / stats.count }))
    .sort((a, b) => b.totalCost - a.totalCost);

  const dailyCosts = Array.from(byDay.entries())
    .map(([day, cost]) => ({ day, cost }))
    .sort((a, b) => a.day.localeCompare(b.day))
    .slice(-30);

  return NextResponse.json({
    totalCalls: rows.length,
    totalCost,
    avgCostPerCall: rows.length > 0 ? totalCost / rows.length : 0,
    totalInputTokens,
    totalOutputTokens,
    operations,
    models,
    dailyCosts,
    truncated: rows.length === MAX_ROWS,
  });
}
