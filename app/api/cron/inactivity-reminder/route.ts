import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service";
import { sendInactivityReminderEmail, SITE_URL } from "@/lib/email";

export const runtime = "nodejs";
export const maxDuration = 60;

const INACTIVITY_DAYS = 7;
const MAX_USER_PAGES = 20; // safety cap (20 * 1000 = 20k accounts), not an expected real ceiling

// Daily Vercel Cron (see vercel.json) — the third and last lifecycle email
// from the UX audit. Every account gets evaluated exactly once, on the
// first cron run after it turns 7 days old: accounts that already have a
// download or cover letter by then are "graduated" (marked as evaluated,
// no email), everyone else gets a one-time nudge. Protected by CRON_SECRET,
// Vercel's own documented pattern for authenticating its cron invocations.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceSupabaseClient();
  const cutoff = new Date(Date.now() - INACTIVITY_DAYS * 24 * 60 * 60 * 1000);

  // auth.users has no RLS-friendly client access — the Admin API is the
  // only way to read signup dates, so this walks every account rather than
  // filtering in SQL. Paginated defensively; in practice the vast majority
  // of accounts get skipped instantly below once inactivity_reminder_sent_at
  // is set on their first eligible run.
  const candidateIds: { id: string; email: string; createdAt: Date }[] = [];
  for (let page = 1; page <= MAX_USER_PAGES; page++) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    for (const u of data.users) {
      if (u.email && new Date(u.created_at) <= cutoff) {
        candidateIds.push({ id: u.id, email: u.email, createdAt: new Date(u.created_at) });
      }
    }
    if (data.users.length < 1000) break;
  }

  if (candidateIds.length === 0) {
    return NextResponse.json({ evaluated: 0, reminded: 0 });
  }

  const { data: creditRows, error: creditsError } = await service
    .from("account_credits")
    .select("user_id, inactivity_reminder_sent_at")
    .in("user_id", candidateIds.map(c => c.id));
  if (creditsError) throw creditsError;

  const notYetEvaluated = candidateIds.filter(c => {
    const row = creditRows?.find(r => r.user_id === c.id);
    return row && !row.inactivity_reminder_sent_at;
  });

  if (notYetEvaluated.length === 0) {
    return NextResponse.json({ evaluated: 0, reminded: 0 });
  }

  const ids = notYetEvaluated.map(c => c.id);
  const [{ data: downloads, error: downloadsError }, { data: letters, error: lettersError }] = await Promise.all([
    service.from("paid_downloads").select("user_id").in("user_id", ids),
    service.from("cover_letters").select("user_id").in("user_id", ids),
  ]);
  if (downloadsError) throw downloadsError;
  if (lettersError) throw lettersError;
  const activeUserIds = new Set([...(downloads ?? []).map(d => d.user_id), ...(letters ?? []).map(l => l.user_id)]);

  let reminded = 0;
  for (const candidate of notYetEvaluated) {
    if (!activeUserIds.has(candidate.id)) {
      try {
        await sendInactivityReminderEmail(candidate.email, SITE_URL);
        reminded++;
      } catch (err) {
        console.error("[cron/inactivity-reminder] send failed", candidate.id, err);
      }
    }
  }

  // Marked as evaluated regardless of whether an email was sent — an
  // "active" account (already has downloads/letters) doesn't need one, but
  // still shouldn't be re-checked by every future run.
  const { error: markError } = await service
    .from("account_credits")
    .update({ inactivity_reminder_sent_at: new Date().toISOString() })
    .in("user_id", ids);
  if (markError) throw markError;

  return NextResponse.json({ evaluated: notYetEvaluated.length, reminded });
}
