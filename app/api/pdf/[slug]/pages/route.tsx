import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { PDFDocument } from "pdf-lib";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileBySlug } from "@/lib/profile-store";
import { AtsResumeDocument, PDF_TEMPLATES, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";

export const maxDuration = 15;

function parseTemplate(value: string | null): PdfTemplate {
  return PDF_TEMPLATES.some(t => t.id === value) ? (value as PdfTemplate) : "ats-core";
}

// Cheap, free, no-charge probe: renders the CV once at normal density just
// to count pages, so the client knows whether to even offer the "compact to
// one page" choice. The real, billed compaction happens in
// /api/pdf/[slug]?compact=1 — this route never charges credits.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const template = parseTemplate(req.nextUrl.searchParams.get("template"));

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const row = await getOwnedProfileBySlug(supabase, user.id, slug);
    if (!row) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const buffer = await renderToBuffer(<AtsResumeDocument profile={row.data} template={template} />);
    const doc = await PDFDocument.load(buffer);
    return NextResponse.json({ pages: doc.getPageCount() });
  } catch (err) {
    console.error("[pdf/[slug]/pages]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
