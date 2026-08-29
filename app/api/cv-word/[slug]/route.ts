import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileBySlug } from "@/lib/profile-store";
import { spendCredits, CREDIT_COSTS, InsufficientCreditsError } from "@/lib/credits";
import { hasPaidDownload, recordPaidDownload } from "@/lib/paid-downloads";
import { buildCvDocxBuffer } from "@/lib/word-cv-document";
import { buildCvWordFilename } from "@/lib/download-filename";

// docx generation is pure Node (no Claude call, no react-pdf), so this stays
// well under the default duration limit — no maxDuration override needed.

// Shares the same "template" dedup slot used by /api/pdf/[slug] (see
// supabase/migrations/0006_paid_downloads.sql) — "docx" is just another
// value in that free-text column, so a first Word download is billed and
// every later one (e.g. from the account's Download list) is a free
// re-render, exactly like the PDF templates.
const WORD_TEMPLATE_KEY = "docx";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const row = await getOwnedProfileBySlug(supabase, user.id, slug);
  if (!row) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  const detail = `${row.data.personal_info.full_name} · Word${row.kind === "tailored" ? " · versione adattata" : ""}`;

  const alreadyPaid = await hasPaidDownload(supabase, row.id, WORD_TEMPLATE_KEY);
  if (!alreadyPaid) {
    try {
      await spendCredits(supabase, CREDIT_COSTS.wordDownload, "word_download", detail);
    } catch (err) {
      if (err instanceof InsufficientCreditsError) {
        return NextResponse.json(
          { error: "Not enough credits to download a Word document.", code: "INSUFFICIENT_CREDITS" },
          { status: 402 }
        );
      }
      throw err;
    }
    await recordPaidDownload(user.id, row.id, WORD_TEMPLATE_KEY);
  }

  const buffer = await buildCvDocxBuffer(row.data);

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${buildCvWordFilename(row.data, row.slug)}"`,
    },
  });
}
