import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";
import { unsubscribeRatelimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Deliberately unauthenticated (no login required) — clicked from an email,
// where forcing a sign-in first would defeat the point. Legal audit finding:
// Art. 130 Codice Privacy requires being able to object to each
// communication "easily and free of charge"; this is that mechanism for the
// 3 lifecycle emails (see lib/email.ts). A GET request that mutates state is
// the accepted, universal shape for one-click email unsubscribe links —
// the token is an unguessable per-user HMAC (lib/unsubscribe.ts), so the
// worst case of it being triggered unexpectedly is a false "unsubscribed",
// never anything more sensitive.
function htmlPage(title: string, body: string): NextResponse {
  return new NextResponse(
    `<!doctype html><html lang="it"><head><meta charset="utf-8"><title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { font-family: system-ui, sans-serif; background: #f8fafc; color: #0f172a; display: flex; min-height: 100vh; align-items: center; justify-content: center; margin: 0; padding: 24px; }
      .card { max-width: 420px; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; text-align: center; }
      h1 { font-size: 1.2rem; margin: 0 0 12px; }
      p { color: #64748b; font-size: 0.9rem; line-height: 1.6; margin: 0 0 20px; }
      a { display: inline-block; padding: 10px 20px; border-radius: 10px; background: #123bff; color: #fff; text-decoration: none; font-weight: 600; font-size: 0.9rem; }
    </style></head>
    <body><div class="card"><h1>${title}</h1><p>${body}</p><a href="/account">Torna al tuo account</a></div></body></html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function GET(req: NextRequest) {
  const clientIp = getClientIp(req);
  const { success } = await unsubscribeRatelimit.limit(clientIp);
  if (!success) {
    return htmlPage("Troppi tentativi", "Riprova tra qualche minuto.");
  }

  const uid = req.nextUrl.searchParams.get("uid");
  const token = req.nextUrl.searchParams.get("token");
  if (!uid || !token || !verifyUnsubscribeToken(uid, token)) {
    return htmlPage("Link non valido", "Questo link di disiscrizione non è valido o è scaduto.");
  }

  const service = createServiceSupabaseClient();
  const { error } = await service
    .from("account_settings")
    .upsert({ user_id: uid, lifecycle_emails_opt_out: true }, { onConflict: "user_id" });
  if (error) {
    console.error("[account/unsubscribe]", error);
    return htmlPage("Errore", "Non siamo riusciti a completare la richiesta. Riprova più tardi.");
  }

  return htmlPage(
    "Disiscrizione completata",
    "Non riceverai più queste email. Puoi continuare a usare il tuo account normalmente e riattivarle in qualsiasi momento dalle impostazioni."
  );
}
