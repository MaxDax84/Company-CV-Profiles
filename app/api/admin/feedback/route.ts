import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { createServiceSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/service";

interface FeedbackRow {
  action_type: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

const MAX_ROWS = 2000;

export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase
    .from("action_feedback")
    .select("action_type, rating, comment, created_at")
    .order("created_at", { ascending: false })
    .limit(MAX_ROWS);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as FeedbackRow[];

  const byType = new Map<string, { count: number; ratingSum: number }>();
  for (const row of rows) {
    const stat = byType.get(row.action_type) ?? { count: 0, ratingSum: 0 };
    stat.count += 1;
    stat.ratingSum += row.rating;
    byType.set(row.action_type, stat);
  }

  const byActionType = Array.from(byType.entries())
    .map(([actionType, stat]) => ({ actionType, count: stat.count, avgRating: stat.ratingSum / stat.count }))
    .sort((a, b) => b.count - a.count);

  const overallAvgRating = rows.length > 0 ? rows.reduce((sum, r) => sum + r.rating, 0) / rows.length : 0;

  return NextResponse.json({
    totalResponses: rows.length,
    overallAvgRating,
    byActionType,
    entries: rows,
    truncated: rows.length === MAX_ROWS,
  });
}
