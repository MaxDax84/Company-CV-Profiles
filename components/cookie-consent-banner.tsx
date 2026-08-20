"use client";

import { useEffect, useState } from "react";
import { useConsent } from "@/components/consent-provider";
import { useLanguage } from "@/components/language-provider";

const content = {
  it: {
    title: "La tua privacy",
    body: "Usiamo solo i cookie strettamente necessari al funzionamento del sito (accesso e sicurezza anti-bot). Con il tuo consenso, vorremmo usare anche cookie di analisi e marketing per capire come viene usato il sito e migliorarlo — puoi cambiare idea in qualsiasi momento dal link \"Preferenze cookie\" in fondo alla pagina.",
    learnMore: "Leggi la Cookie Policy",
    customize: "Personalizza",
    rejectAll: "Rifiuta non necessari",
    acceptAll: "Accetta tutti",
    prefsTitle: "Preferenze cookie",
    prefsBody: "Scegli quali categorie di cookie autorizzare. I cookie necessari non possono essere disattivati perché indispensabili al funzionamento del sito.",
    categories: {
      necessary: { label: "Necessari", desc: "Accesso all'account (Supabase) e verifica anti-bot (Cloudflare Turnstile). Sempre attivi." },
      analytics: { label: "Analytics", desc: "Ci aiutano a capire come viene usato il sito (Google Analytics), in forma aggregata." },
      marketing: { label: "Marketing", desc: "Usati per misurare l'efficacia di eventuali future campagne pubblicitarie. Non ancora attivi." },
    },
    alwaysOn: "Sempre attivo",
    savePreferences: "Salva preferenze",
    close: "Chiudi",
  },
  en: {
    title: "Your privacy",
    body: "We only use cookies strictly necessary for the site to work (login and anti-bot security). With your consent, we'd also like to use analytics and marketing cookies to understand how the site is used and improve it — you can change your mind any time from the \"Cookie preferences\" link at the bottom of the page.",
    learnMore: "Read the Cookie Policy",
    customize: "Customize",
    rejectAll: "Reject non-essential",
    acceptAll: "Accept all",
    prefsTitle: "Cookie preferences",
    prefsBody: "Choose which cookie categories to allow. Necessary cookies can't be turned off since they're required for the site to work.",
    categories: {
      necessary: { label: "Necessary", desc: "Account login (Supabase) and anti-bot verification (Cloudflare Turnstile). Always active." },
      analytics: { label: "Analytics", desc: "Help us understand how the site is used (Google Analytics), in aggregate form." },
      marketing: { label: "Marketing", desc: "Used to measure the effectiveness of any future ad campaigns. Not active yet." },
    },
    alwaysOn: "Always on",
    savePreferences: "Save preferences",
    close: "Close",
  },
};

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="relative w-10 h-6 rounded-full shrink-0 transition-colors duration-200 disabled:cursor-not-allowed"
      style={{ background: checked ? "var(--primary)" : "var(--border)", opacity: disabled ? 0.6 : 1 }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }}
      />
    </button>
  );
}

export default function CookieConsentBanner() {
  const { lang } = useLanguage();
  const t = content[lang];
  const { consent, hasResponded, bannerOpen, closeBanner, savePreferences, acceptAll, rejectAll } = useConsent();
  const [customizing, setCustomizing] = useState(false);
  const [draft, setDraft] = useState({ analytics: consent.analytics, marketing: consent.marketing });

  // Re-sync the draft toggles from the real stored consent every time the
  // panel opens — the initial useState above only ever captures whatever
  // `consent` happened to be at first mount (often the pre-cookie-read
  // default), which would otherwise silently reset a returning visitor's
  // saved choices back to "off" in the panel.
  useEffect(() => {
    if (bannerOpen) setDraft({ analytics: consent.analytics, marketing: consent.marketing });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bannerOpen]);

  if (!bannerOpen) return null;

  // A returning visitor reopening "Cookie preferences" from the footer
  // jumps straight to the panel, not the first-visit pitch bar.
  const showPanel = customizing || hasResponded;

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center pointer-events-none">
      {showPanel ? (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
          onClick={() => { if (hasResponded) { setCustomizing(false); closeBanner(); } }}
        />
      ) : null}

      {!showPanel ? (
        /* ── First-visit bar ── */
        <div className="glass-card w-full sm:max-w-xl sm:mb-6 sm:rounded-2xl rounded-t-2xl p-5 space-y-4 pointer-events-auto shadow-2xl">
          <div>
            <p className="text-sm font-semibold mb-1.5">{t.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t.body}{" "}
              <a href="/cookies" className="underline underline-offset-2 hover:text-foreground">{t.learnMore}</a>
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              type="button"
              onClick={() => setCustomizing(true)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.customize}
            </button>
            <button
              type="button"
              onClick={rejectAll}
              className="px-4 py-2 rounded-lg text-xs font-semibold border border-foreground/15 hover:bg-foreground/[0.06] transition-colors"
            >
              {t.rejectAll}
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="px-4 py-2 rounded-lg text-xs font-semibold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {t.acceptAll}
            </button>
          </div>
        </div>
      ) : (
        /* ── Preferences panel ── */
        <div className="glass-card w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 space-y-5 pointer-events-auto shadow-2xl max-h-[85vh] overflow-y-auto">
          <div>
            <p className="text-sm font-semibold mb-1.5">{t.prefsTitle}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{t.prefsBody}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{t.categories.necessary.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.categories.necessary.desc}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <Toggle checked={true} onChange={() => {}} disabled />
                <span className="text-[10px] text-muted-foreground/60">{t.alwaysOn}</span>
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{t.categories.analytics.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.categories.analytics.desc}</p>
              </div>
              <Toggle checked={draft.analytics} onChange={(v) => setDraft(d => ({ ...d, analytics: v }))} />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{t.categories.marketing.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.categories.marketing.desc}</p>
              </div>
              <Toggle checked={draft.marketing} onChange={(v) => setDraft(d => ({ ...d, marketing: v }))} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-end pt-1">
            {hasResponded && (
              <button
                type="button"
                onClick={() => { setCustomizing(false); closeBanner(); }}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {t.close}
              </button>
            )}
            <button
              type="button"
              onClick={rejectAll}
              className="px-4 py-2 rounded-lg text-xs font-semibold border border-foreground/15 hover:bg-foreground/[0.06] transition-colors"
            >
              {t.rejectAll}
            </button>
            <button
              type="button"
              onClick={() => savePreferences(draft)}
              className="px-4 py-2 rounded-lg text-xs font-semibold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {t.savePreferences}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
