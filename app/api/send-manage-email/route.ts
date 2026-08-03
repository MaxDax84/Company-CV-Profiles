import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { kv } from "@/lib/kv";
import { sendEmailRatelimit, getClientIp } from "@/lib/rate-limit";

// Nodemailer needs Node APIs, so this runs on the default Node runtime —
// deliberately kept separate from the edge-runtime parse-resume route.

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    const { success, reset } = await sendEmailRatelimit.limit(getClientIp(req));
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a bit." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)) } }
      );
    }

    const { email, token } = await req.json();

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Missing token." }, { status: 400 });
    }

    // Only send for a token we actually just issued — prevents this
    // endpoint being used to spam arbitrary addresses.
    const slug = await kv.get<string>(`manage:${token}`);
    if (!slug) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 404 });
    }

    const origin = req.nextUrl.origin;
    const profileUrl = `${origin}/profile/${slug}`;
    const manageUrl = `${origin}/manage/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Career Profile AI" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Il tuo profilo professionale è pronto",
      text: `Il tuo profilo è online: ${profileUrl}\n\nPer gestirlo (cambiare template o eliminarlo) usa questo link: ${manageUrl}\n\nConservalo: è l'unico modo per gestire il profilo senza doverti registrare.`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; background: #0a0b14; color: #f0f0f5; padding: 32px; border-radius: 12px; border: 1px solid #2a2d3e;">
          <h2 style="margin: 0 0 16px; color: #5b9cf6; font-size: 20px;">Il tuo profilo è pronto</h2>
          <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6;">
            <a href="${escapeHtml(profileUrl)}" style="color: #5b9cf6;">${escapeHtml(profileUrl)}</a>
          </p>
          <div style="background: #161825; border-radius: 8px; padding: 16px; border-left: 3px solid #5b9cf6;">
            <p style="margin: 0 0 8px; color: #9ca3af; font-size: 13px;">Per cambiare template o eliminare il profilo, usa questo link personale:</p>
            <a href="${escapeHtml(manageUrl)}" style="color: #5b9cf6; font-size: 14px;">${escapeHtml(manageUrl)}</a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[send-manage-email]", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
