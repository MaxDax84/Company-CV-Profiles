import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getProfileBySlug } from "@/lib/profile-store";
import { AtsResumeDocument } from "@/components/pdf/AtsResumeDocument";

// react-pdf needs Node APIs (fontkit etc.), so this stays off the edge
// runtime — same reasoning as send-manage-email/route.ts.
export const maxDuration = 15;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const profile = await getProfileBySlug(slug);
  if (!profile) {
    return NextResponse.json({ error: "Profile not found or expired." }, { status: 404 });
  }

  const buffer = await renderToBuffer(<AtsResumeDocument profile={profile} />);

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}.pdf"`,
    },
  });
}
