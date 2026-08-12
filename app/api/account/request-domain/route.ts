import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAccountCode } from "@/lib/credits";

export const runtime = "nodejs";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Authenticated users ask for a custom domain on their CV page — this is a
// manual request routed to the site owner's inbox, not a self-service flow
// (no domain registrar/DNS automation exists yet).
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const desiredDomain = (body?.desiredDomain as string | undefined)?.trim() ?? "";
    const note = (body?.note as string | undefined)?.trim() ?? "";

    const accountCode = await getAccountCode(supabase, user.id);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"GoOnWeb — Richieste dominio" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: user.email,
      subject: `Richiesta dominio personalizzato — ${user.email}`,
      text: `Account: ${user.email} (codice ${accountCode})\nDominio desiderato: ${desiredDomain || "non specificato"}\n\nNote:\n${note || "—"}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; background: #ffffff; color: #0f172a; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h2 style="margin: 0 0 4px; color: #6366f1; font-size: 20px;">Richiesta dominio personalizzato</h2>
          <p style="margin: 0 0 24px; color: #64748b; font-size: 14px;">Ricevuta dal pannello account di GoOnWeb</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Account</td>
              <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${escapeHtml(user.email)}" style="color: #6366f1;">${escapeHtml(user.email)}</a> (codice ${escapeHtml(accountCode)})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Dominio desiderato</td>
              <td style="padding: 8px 0; font-size: 14px;">${desiredDomain ? escapeHtml(desiredDomain) : "non specificato"}</td>
            </tr>
          </table>
          <div style="background: #f8fafc; border-radius: 8px; padding: 16px; border-left: 3px solid #6366f1;">
            <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Note</p>
            <p style="margin: 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${note ? escapeHtml(note) : "—"}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[account/request-domain]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
