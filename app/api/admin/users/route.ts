import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { createServiceSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/service";

// Same "internal stats view, not a paginated export" reasoning as
// /api/admin/costs — bounded fetches instead of a dedicated SQL
// aggregation RPC, generous enough for this app's actual scale.
const MAX_LEDGER_ROWS = 20000;
const MAX_USAGE_ROWS = 20000;
const MAX_USER_PAGES = 20; // 20 * 1000 = 20k accounts, well above current scale

interface LedgerRow {
  user_id: string;
  amount: number;
  reason: string;
  created_at: string;
}

interface UsageRow {
  user_id: string | null;
  cost_usd: number;
}

interface AccountCreditsRow {
  user_id: string;
  credits: number;
  code: string | null;
  updated_at: string;
}

export async function GET(req: NextRequest) {
  if (!(await verifyAdminSession(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const service = createServiceSupabaseClient();

  const [{ data: ledgerData, error: ledgerError }, { data: creditsData, error: creditsError }, { data: usageData, error: usageError }] = await Promise.all([
    service
      .from("credit_ledger")
      .select("user_id, amount, reason, created_at")
      .order("created_at", { ascending: false })
      .limit(MAX_LEDGER_ROWS),
    service.from("account_credits").select("user_id, credits, code, updated_at"),
    service
      .from("claude_usage_log")
      .select("user_id, cost_usd")
      .not("user_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(MAX_USAGE_ROWS),
  ]);
  if (ledgerError) return NextResponse.json({ error: ledgerError.message }, { status: 500 });
  if (creditsError) return NextResponse.json({ error: creditsError.message }, { status: 500 });
  if (usageError) return NextResponse.json({ error: usageError.message }, { status: 500 });

  const ledgerRows = (ledgerData ?? []) as LedgerRow[];
  const creditsRows = (creditsData ?? []) as AccountCreditsRow[];
  const usageRows = (usageData ?? []) as UsageRow[];

  // Real Claude API $ cost per user — only ever populated for calls that
  // actually recorded a user_id. cv-generation calls made before a user
  // signs up (the /generate flow's phase-1/phase-2 for an anonymous
  // visitor) have no user yet at call time and can never be attributed
  // here, even going forward — an inherent gap, not a bug.
  const costByUser = new Map<string, number>();
  for (const row of usageRows) {
    if (!row.user_id) continue;
    costByUser.set(row.user_id, (costByUser.get(row.user_id) ?? 0) + (Number(row.cost_usd) || 0));
  }

  // auth.users (email, signup date) is only reachable via the Admin API,
  // same as the inactivity-reminder cron — paginate rather than assume a
  // single page covers every account.
  const emailById = new Map<string, string>();
  const createdAtById = new Map<string, string>();
  for (let page = 1; page <= MAX_USER_PAGES; page++) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    for (const u of data.users) {
      if (u.email) emailById.set(u.id, u.email);
      createdAtById.set(u.id, u.created_at);
    }
    if (data.users.length < 1000) break;
  }

  interface Agg {
    spent: number;
    granted: number;
    spendCount: number;
    lastActivityAt: string | null;
    byReason: Record<string, number>;
  }
  const byUser = new Map<string, Agg>();
  for (const row of ledgerRows) {
    const agg = byUser.get(row.user_id) ?? { spent: 0, granted: 0, spendCount: 0, lastActivityAt: null, byReason: {} };
    if (row.amount < 0) {
      agg.spent += -row.amount;
      agg.spendCount += 1;
      agg.byReason[row.reason] = (agg.byReason[row.reason] ?? 0) - row.amount;
    } else {
      agg.granted += row.amount;
    }
    if (!agg.lastActivityAt || row.created_at > agg.lastActivityAt) agg.lastActivityAt = row.created_at;
    byUser.set(row.user_id, agg);
  }

  const users = creditsRows.map((c) => {
    const agg = byUser.get(c.user_id) ?? { spent: 0, granted: 0, spendCount: 0, lastActivityAt: null, byReason: {} };
    return {
      userId: c.user_id,
      email: emailById.get(c.user_id) ?? null,
      code: c.code,
      signupAt: createdAtById.get(c.user_id) ?? null,
      currentBalance: c.credits,
      totalSpent: agg.spent,
      totalGranted: agg.granted,
      spendCount: agg.spendCount,
      lastActivityAt: agg.lastActivityAt,
      spentByReason: agg.byReason,
      totalCostUsd: costByUser.get(c.user_id) ?? 0,
    };
  });

  users.sort((a, b) => b.totalSpent - a.totalSpent);

  return NextResponse.json({
    users,
    truncated: ledgerRows.length === MAX_LEDGER_ROWS || usageRows.length === MAX_USAGE_ROWS,
  });
}
