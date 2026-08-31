import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service";
import { getAccountCode, getCreditBalance, getCreditsLastRequestedAt, CREDITS_REQUEST_COOLDOWN_HOURS } from "@/lib/credits";
import { requestCreditsRatelimit } from "@/lib/rate-limit";
import { sendMail, emailShell, escapeHtml } from "@/lib/email";

export const runtime = "nodejs";

const EXTRA_CREDITS = 10;

// One-click replacement for the plain "email us to top up" ask in the
// account's Crediti tab (see the UX audit) — no payment involved, the owner
// still grants credits by hand exactly as before. This just removes the
// friction of composing an email and gives the button a real pending state.
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { success } = await requestCreditsRatelimit.limit(user.id);
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const lastRequestedAt = await getCreditsLastRequestedAt(supabase, user.id);
    if (lastRequestedAt) {
      const hoursSince = (Date.now() - new Date(lastRequestedAt).getTime()) / (1000 * 60 * 60);
      if (hoursSince < CREDITS_REQUEST_COOLDOWN_HOURS) {
        return NextResponse.json(
          { error: "You already have a request pending review.", code: "REQUEST_PENDING", lastRequestedAt },
          { status: 429 }
        );
      }
    }

    const [accountCode, credits] = await Promise.all([
      getAccountCode(supabase, user.id),
      getCreditBalance(supabase, user.id),
    ]);

    const now = new Date().toISOString();
    const service = createServiceSupabaseClient();
    const { error } = await service
      .from("account_credits")
      .update({ credits_last_requested_at: now })
      .eq("user_id", user.id);
    if (error) throw error;

    await sendMail({
      to: process.env.GMAIL_USER ?? "",
      replyTo: user.email,
      fromLabel: "Jobli — Richieste crediti",
      subject: `Richiesta di ${EXTRA_CREDITS} crediti — ${user.email}`,
      text: `Account: ${user.email} (codice ${accountCode})\nSaldo attuale: ${credits} crediti\nRichiede: +${EXTRA_CREDITS} crediti`,
      html: emailShell({
        title: `Richiesta di ${EXTRA_CREDITS} crediti`,
        bodyHtml: `
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Account</td>
              <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${escapeHtml(user.email)}" style="color: #123bff;">${escapeHtml(user.email)}</a> (codice ${escapeHtml(accountCode)})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Saldo attuale</td>
              <td style="padding: 8px 0; font-size: 14px;">${credits} crediti</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Richiede</td>
              <td style="padding: 8px 0; font-size: 14px; font-weight: 600;">+${EXTRA_CREDITS} crediti</td>
            </tr>
          </table>
        `,
      }),
    });

    return NextResponse.json({ success: true, requestedAt: now });
  } catch (err) {
    console.error("[account/request-credits]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
