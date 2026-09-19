import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const maxDuration = 60;

// Both the Cookie Policy and the Privacy Policy promise that consent and
// policy-acceptance records are kept for 5 years and then deleted
// automatically — this is the job that actually does it. Daily Vercel Cron
// (see vercel.json), so a row is gone within a day of turning 5 years old.
// 5 years matches the ordinary Italian limitation period for the claims
// these records exist to answer (proving that consent was given).
const RETENTION_YEARS = 5;

// The two insert-only audit tables (RLS enabled, no policies — see
// supabase/migrations/0019_cookie_consent_log.sql and
// 0033_policy_acceptance_log.sql). Only the service-role client can touch
// them, which is also why this runs server-side as a cron rather than as
// a database trigger the anon/authenticated roles could never fire.
const TABLES = ["cookie_consent_log", "policy_acceptance_log"] as const;

// Protected by CRON_SECRET, Vercel's own documented pattern for
// authenticating its cron invocations — same check as
// app/api/cron/inactivity-reminder/route.ts.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - RETENTION_YEARS);
  const cutoffIso = cutoff.toISOString();

  const service = createServiceSupabaseClient();
  const deleted: Record<string, number> = {};
  for (const table of TABLES) {
    const { count, error } = await service
      .from(table)
      .delete({ count: "exact" })
      .lt("created_at", cutoffIso);
    if (error) {
      console.error(`[cron/purge-old-consent-logs] ${table} purge failed`, error);
      return NextResponse.json({ error: `${table}: ${error.message}`, cutoff: cutoffIso, deleted }, { status: 500 });
    }
    deleted[table] = count ?? 0;
  }

  return NextResponse.json({ cutoff: cutoffIso, deleted });
}
