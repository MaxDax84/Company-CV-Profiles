import nodemailer from "nodemailer";

// Only used to build links inside emails sent from places with no request
// object to read the real origin from (e.g. lib/credits.ts, mid-spend).
// Routes that do have one (app/auth/callback) pass their own origin instead.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jobli.it";

// Shared by every route that sends mail through the site's own Gmail
// account (app/api/contact, app/api/account/request-domain keep their own
// copies of this — this module exists for the request-credits/lifecycle
// email routes added afterwards, so as not to touch those two already-
// verified flows without a reason).

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// A raw CR/LF in a value that ends up inside an email header (subject, etc.)
// lets attacker- or user-supplied text inject extra header lines into the
// outgoing message — see app/api/contact/route.ts's stripHeaderInjection.
export function stripHeaderInjection(text: string): string {
  return text.replace(/[\r\n]+/g, " ").trim();
}

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  fromLabel?: string;
}

// Fire-and-log, never throws — every caller of this treats email as a
// courtesy notification, not something worth failing the whole request
// over (a spend or a signup must still succeed even if Gmail is down).
export async function sendMail(opts: SendMailOptions): Promise<void> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("[email] GMAIL_USER/GMAIL_APP_PASSWORD not configured, skipping send");
    return;
  }
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"${opts.fromLabel ?? "Jobli"}" <${process.env.GMAIL_USER}>`,
      to: opts.to,
      replyTo: opts.replyTo,
      subject: stripHeaderInjection(opts.subject),
      text: opts.text,
      html: opts.html,
    });
  } catch (err) {
    console.error("[email] send failed", err);
  }
}

// Shared visual wrapper so every lifecycle/notification email looks like it
// came from the same product instead of each route hand-rolling its own
// inline-styled div (see contact/request-domain's own copies of this shape).
export function emailShell(opts: { title: string; bodyHtml: string }): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; background: #ffffff; color: #0f172a; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h2 style="margin: 0 0 4px; color: #123bff; font-size: 20px;">${escapeHtml(opts.title)}</h2>
      <p style="margin: 0 0 24px; color: #64748b; font-size: 14px;">Jobli</p>
      ${opts.bodyHtml}
    </div>
  `;
}

function ctaButtonHtml(label: string, url: string): string {
  return `<a href="${url}" style="display: inline-block; margin-top: 20px; padding: 12px 22px; border-radius: 10px; background: #123bff; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">${escapeHtml(label)}</a>`;
}

// UX audit finding: the only emails this project sent went to the site
// owner, never to users — no welcome email beyond Supabase's own signup
// confirmation. Triggered once per account from app/auth/callback/route.ts.
export async function sendWelcomeEmail(to: string, siteUrl: string): Promise<void> {
  await sendMail({
    to,
    fromLabel: "Jobli",
    subject: "Benvenuto su Jobli — ecco da dove iniziare",
    text:
      "Benvenuto su Jobli! Hai 3 crediti gratuiti pronti da usare.\n\n" +
      "Cosa fare ora:\n" +
      "1. Se non l'hai ancora fatto, carica il PDF del tuo CV su " + siteUrl + "/generate\n" +
      "2. Guarda il punteggio e lascia che l'AI ti segnali cosa migliorare\n" +
      "3. Prova ad adattarlo a un annuncio specifico: è sempre gratis, paghi solo se scarichi il risultato\n\n" +
      "Il tuo account: " + siteUrl + "/account",
    html: emailShell({
      title: "Benvenuto su Jobli 👋",
      bodyHtml: `
        <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6;">
          Hai <strong>3 crediti gratuiti</strong> pronti da usare. Ecco da dove iniziare:
        </p>
        <ol style="margin: 0 0 16px; padding-left: 20px; font-size: 15px; line-height: 1.8; color: #1e293b;">
          <li>Se non l'hai ancora fatto, carica il PDF del tuo CV</li>
          <li>Guarda il punteggio e lascia che l'AI ti segnali cosa migliorare</li>
          <li>Prova ad adattarlo a un annuncio specifico — è sempre gratis, paghi solo se scarichi il risultato</li>
        </ol>
        ${ctaButtonHtml("Vai al tuo account", `${siteUrl}/account`)}
      `,
    }),
  });
}

// Sent once per account, at most, by the daily inactivity-reminder cron
// (app/api/cron/inactivity-reminder/route.ts) to anyone who signed up 7+
// days ago and never downloaded a PDF/Word file or generated a cover letter.
export async function sendInactivityReminderEmail(to: string, siteUrl: string): Promise<void> {
  await sendMail({
    to,
    fromLabel: "Jobli",
    subject: "Il tuo CV su Jobli ti aspetta ancora",
    text:
      "Hai iniziato a creare il tuo profilo su Jobli ma non hai ancora scaricato nulla.\n\n" +
      "Torna al tuo account per continuare: " + siteUrl + "/account\n" +
      "Hai ancora crediti gratuiti pronti da usare.",
    html: emailShell({
      title: "Il tuo CV ti aspetta ancora",
      bodyHtml: `
        <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6;">
          Hai iniziato a creare il tuo profilo su Jobli ma non hai ancora scaricato nulla.
          Hai ancora crediti gratuiti pronti da usare per il PDF, la lettera di presentazione
          o l'adattamento a un annuncio specifico.
        </p>
        ${ctaButtonHtml("Torna al tuo account", `${siteUrl}/account`)}
      `,
    }),
  });
}

// Fires once per exhaustion event (see 0026_lifecycle_email_tracking.sql's
// comment on why no dedup column is needed) from lib/credits.ts right after
// a spend brings the balance to 0.
export async function sendZeroBalanceEmail(to: string, siteUrl: string): Promise<void> {
  await sendMail({
    to,
    fromLabel: "Jobli",
    subject: "Hai finito i crediti su Jobli",
    text:
      "Hai usato tutti i tuoi crediti Jobli.\n\n" +
      "Puoi richiederne altri 10 gratis dalla sezione Crediti del tuo account: " + siteUrl + "/account?tab=credits\n" +
      "Verifichiamo la richiesta a mano e te li accreditiamo.",
    html: emailShell({
      title: "Hai finito i crediti",
      bodyHtml: `
        <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6;">
          Hai usato tutti i tuoi crediti Jobli. Siamo in fase beta: puoi richiederne altri
          <strong>10 gratis</strong> con un click — verifichiamo la richiesta a mano e te li accreditiamo.
        </p>
        ${ctaButtonHtml("Richiedi altri crediti", `${siteUrl}/account?tab=credits`)}
      `,
    }),
  });
}
