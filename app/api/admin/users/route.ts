import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { createServiceSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/service";

// Same "internal stats view, not a paginated export" reasoning as
// /api/admin/costs — bounded fetches instead of a dedicated SQL
// aggregation RPC, generous enough for this app's actual scale.
const MAX_LEDGER_ROWS = 20000;
const MAX_USER_PAGES = 20; // 20 * 1000 = 20k accounts, well above current scale

interface LedgerRow {
  user_id: string;
  amount: number;
  reason: string;
  created_at: string;
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

  const [{ data: ledgerData, error: ledgerError }, { data: creditsData, error: creditsError }] = await Promise.all([
    service
      .from("credit_ledger")
      .select("user_id, amount, reason, created_at")
      .order("created_at", { ascending: false })
      .limit(MAX_LEDGER_ROWS),
    service.from("account_credits").select("user_id, credits, code, updated_at"),
  ]);
  if (ledgerError) return NextResponse.json({ error: ledgerError.message }, { status: 500 });
  if (creditsError) return NextResponse.json({ error: creditsError.message }, { status: 500 });

  const ledgerRows = (ledgerData ?? []) as LedgerRow[];
  const creditsRows = (creditsData ?? []) as AccountCreditsRow[];

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
    };
  });

  users.sort((a, b) => b.totalSpent - a.totalSpent);

  return NextResponse.json({
    users,
    truncated: ledgerRows.length === MAX_LEDGER_ROWS,
  });
}
