'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/language-provider'
import { useConsent } from '@/components/consent-provider'
import { SUPPORT_EMAIL } from '@/lib/contact'

const USING_COOKIEBOT = process.env.NEXT_PUBLIC_COOKIE_CMP === 'cookiebot'

export default function CookiePage() {
  const { lang } = useLanguage()
  const { openBanner } = useConsent()

  // Mirrors components/footer.tsx: while Cookiebot is active our own
  // ConsentProvider isn't mounted (see app/layout.tsx), so openBanner()
  // would be a dead no-op — Cookiebot's own renew() reopens its banner
  // instead.
  function openCookiePreferences() {
    if (USING_COOKIEBOT) {
      (window as unknown as { Cookiebot?: { renew?: () => void } }).Cookiebot?.renew?.();
    } else {
      openBanner();
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-24">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          {lang === 'it' ? '← Torna al sito' : '← Back to site'}
        </Link>

        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-2">Cookie Policy</h1>
        <p className="text-muted-foreground text-sm mb-12">
          {lang === 'it' ? 'Ultimo aggiornamento: Settembre 2026' : 'Last updated: September 2026'}
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
          {lang === 'it' ? (
            <>
              <p>
                Informativa sull&apos;uso dei cookie ai sensi dell&apos;art. 122 del D.Lgs. 196/2003
                (Codice Privacy), come modificato dal D.Lgs. 101/2018, e delle{' '}
                <em>Linee guida cookie e altri strumenti di tracciamento</em> del Garante per la
                Protezione dei Dati Personali del 10 giugno 2021.
              </p>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-foreground font-medium mb-2">Gestisci le tue preferenze</p>
                <p className="mb-3">
                  Puoi scegliere in qualsiasi momento quali categorie di cookie autorizzare, oltre a
                  quelli strettamente necessari.{' '}
                  {USING_COOKIEBOT && (
                    <>Il banner di consenso è oggi gestito da Cookiebot (Usercentrics A/S), non
                    direttamente da noi.</>
                  )}
                </p>
                <button
                  onClick={openCookiePreferences}
                  className="inline-flex px-4 py-2 rounded-lg text-xs font-semibold"
                  style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                >
                  Apri le preferenze cookie
                </button>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Cosa sono i cookie</h3>
                <p>
                  I cookie sono piccoli file di testo che i siti web salvano sul dispositivo
                  dell&apos;utente durante la navigazione. Questo sito li raggruppa in quattro categorie:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong className="text-foreground">Necessari</strong>, indispensabili al
                    funzionamento del sito; non richiedono consenso e non possono essere disattivati.
                  </li>
                  <li>
                    <strong className="text-foreground">Preferenze</strong>, ricorderebbero scelte di
                    visualizzazione (es. lingua, tema) tra una visita e l&apos;altra; richiedono il tuo
                    consenso preventivo. Nessun cookie di questa categoria è attivo al momento.
                  </li>
                  <li>
                    <strong className="text-foreground">Statistiche</strong>, ci aiutano a capire come
                    viene usato il sito, in forma aggregata; richiedono il tuo consenso preventivo.
                  </li>
                  <li>
                    <strong className="text-foreground">Marketing</strong>, utilizzati per misurare
                    l&apos;efficacia di eventuali campagne pubblicitarie; richiedono il tuo consenso
                    preventivo.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Cookie necessari (sempre attivi)</h3>
                <p>
                  Questi cookie sono esentati dall&apos;obbligo di consenso preventivo ai sensi delle
                  Linee Guida del Garante del 2021, in quanto strettamente necessari al servizio
                  richiesto dall&apos;utente.
                </p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-foreground/15 text-left">
                        <th className="py-2 pr-3 font-semibold text-foreground">Nome</th>
                        <th className="py-2 pr-3 font-semibold text-foreground">Provider</th>
                        <th className="py-2 pr-3 font-semibold text-foreground">Finalità</th>
                        <th className="py-2 pr-3 font-semibold text-foreground">Durata</th>
                        <th className="py-2 font-semibold text-foreground">Parte</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-foreground/5">
                        <td className="py-2 pr-3 align-top">sb-&lt;progetto&gt;-auth-token</td>
                        <td className="py-2 pr-3 align-top">Supabase</td>
                        <td className="py-2 pr-3 align-top">Mantiene l&apos;accesso al tuo account. Impostato solo se hai effettuato l&apos;accesso o creato un account.</td>
                        <td className="py-2 pr-3 align-top">Logout o inattività prolungata</td>
                        <td className="py-2 align-top">Prima</td>
                      </tr>
                      {USING_COOKIEBOT ? (
                        <tr>
                          <td className="py-2 pr-3 align-top">CookieConsent</td>
                          <td className="py-2 pr-3 align-top">Usercentrics A/S (Cookiebot)</td>
                          <td className="py-2 pr-3 align-top">Memorizza le tue scelte sul banner cookie attualmente in uso, così non te lo richiediamo a ogni visita.</td>
                          <td className="py-2 pr-3 align-top">1 anno</td>
                          <td className="py-2 align-top">Terza</td>
                        </tr>
                      ) : (
                        <tr>
                          <td className="py-2 pr-3 align-top">jobli_cookie_consent</td>
                          <td className="py-2 pr-3 align-top">Jobli</td>
                          <td className="py-2 pr-3 align-top">Memorizza le tue scelte su questo banner, così non te lo richiediamo a ogni visita.</td>
                          <td className="py-2 pr-3 align-top">6 mesi</td>
                          <td className="py-2 align-top">Prima</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {USING_COOKIEBOT ? (
                  <p className="mt-3">
                    Il nostro sistema interno di gestione del consenso (incluso il registro di prova
                    tecnica del consenso) è temporaneamente in stand-by mentre usiamo Cookiebot: non
                    riceve nuove scelte finché questa configurazione resta attiva.
                  </p>
                ) : (
                  <p className="mt-3">
                    Oltre al cookie, conserviamo sui nostri server una prova tecnica di ogni scelta di consenso
                    (un identificativo anonimo, data e ora, le categorie scelte), per poterla esibire in caso di
                    verifica. Questo registro non ti identifica come persona: è collegato al tuo account solo se
                    hai effettuato l&apos;accesso nel momento in cui scegli. Conserviamo questo registro per
                    5 anni dalla data della scelta, in linea con gli ordinari termini di prescrizione, decorsi
                    i quali viene eliminato automaticamente.
                  </p>
                )}
                <p className="mt-3">
                  I moduli di caricamento CV e adattamento a un annuncio usano inoltre Cloudflare
                  Turnstile per la verifica anti-bot: per come è progettato da Cloudflare, Turnstile
                  non imposta un cookie sul tuo browser, quindi non compare in questa tabella.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Cookie di Preferenze (previo consenso)</h3>
                <p>
                  Questa categoria è riservata a eventuali cookie funzionali futuri (es. ricordare la
                  lingua o il tema scelti tra una visita e l&apos;altra, oggi già gestiti senza cookie).{' '}
                  <strong className="text-foreground">Al momento nessun cookie di questa categoria è
                  attivo</strong> sul sito, anche se hai concesso il consenso a questa categoria (la
                  sezione verrà aggiornata con l&apos;elenco specifico non appena un cookie verrà
                  effettivamente introdotto).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Cookie di Statistiche (previo consenso)</h3>
                <p>
                  Se acconsenti alla categoria Statistiche, attiviamo{' '}
                  <strong className="text-foreground">Google Analytics 4</strong>, fornito da Google
                  Ireland Limited, per raccogliere statistiche aggregate e anonimizzate sulla
                  navigazione (pagine visitate, provenienza del traffico, durata della sessione).
                  L&apos;indirizzo IP viene troncato prima della memorizzazione (IP anonymization) e
                  non viene usato per la personalizzazione di annunci pubblicitari.
                </p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-foreground/15 text-left">
                        <th className="py-2 pr-3 font-semibold text-foreground">Nome</th>
                        <th className="py-2 pr-3 font-semibold text-foreground">Provider</th>
                        <th className="py-2 pr-3 font-semibold text-foreground">Finalità</th>
                        <th className="py-2 pr-3 font-semibold text-foreground">Durata</th>
                        <th className="py-2 font-semibold text-foreground">Parte</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-foreground/5">
                        <td className="py-2 pr-3 align-top">_ga</td>
                        <td className="py-2 pr-3 align-top">Google Ireland Limited</td>
                        <td className="py-2 pr-3 align-top">Distingue gli utenti tra loro.</td>
                        <td className="py-2 pr-3 align-top">~2 anni</td>
                        <td className="py-2 align-top">Terza</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 align-top">_ga_&lt;container-id&gt;</td>
                        <td className="py-2 pr-3 align-top">Google Ireland Limited</td>
                        <td className="py-2 pr-3 align-top">Mantiene lo stato della sessione di navigazione.</td>
                        <td className="py-2 pr-3 align-top">~2 anni</td>
                        <td className="py-2 align-top">Terza</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3">
                  Se rifiuti questa categoria (o non rispondi), Google Analytics non viene caricato e
                  nessuno di questi cookie viene impostato. Maggiori informazioni nella{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Privacy Policy di Google
                  </a>.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Cookie di Marketing (previo consenso)</h3>
                <p>
                  Questa categoria è riservata per eventuali strumenti pubblicitari futuri (es. pixel
                  di remarketing). <strong className="text-foreground">Al momento nessuno strumento di
                  marketing è attivo</strong> sul sito, anche se hai concesso il consenso a questa
                  categoria (la sezione verrà aggiornata con l&apos;elenco specifico dei cookie non
                  appena uno strumento verrà effettivamente introdotto).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">6. Cookie tecnici dell&apos;infrastruttura di hosting</h3>
                <p>
                  Il sito è ospitato su infrastruttura cloud (Vercel Inc., San Francisco, USA). La
                  piattaforma di hosting potrebbe impostare cookie tecnici di sessione necessari al
                  corretto funzionamento dell&apos;applicazione web (es. bilanciamento del carico).
                  Tali cookie non identificano l&apos;utente e non vengono trasmessi a terzi per
                  finalità di marketing.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">7. Come gestire i cookie dal browser</h3>
                <p>
                  Oltre al pannello preferenze di questo sito, puoi disabilitare o eliminare i cookie
                  in qualsiasi momento tramite le impostazioni del tuo browser. Nota: disabilitare i
                  cookie necessari impedirà l&apos;accesso al tuo account.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a>
                  </li>
                  <li>
                    <a href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a>
                  </li>
                  <li>
                    <a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Apple Safari</a>
                  </li>
                  <li>
                    <a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">8. Modifiche alla Cookie Policy</h3>
                <p>
                  Il Titolare si riserva il diritto di aggiornare la presente Cookie Policy in
                  qualsiasi momento, in particolare in caso di modifiche normative, tecnologiche o
                  all&apos;infrastruttura del sito. La versione aggiornata sarà pubblicata su questa
                  pagina con indicazione della data di aggiornamento.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">9. Contatti</h3>
                <p>
                  Per qualsiasi domanda relativa alla presente Cookie Policy, scrivere a{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
                    {SUPPORT_EMAIL}
                  </a>
                  .
                </p>
              </div>

              <p>
                Per il trattamento dei dati personali, consulta la nostra{' '}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </>
          ) : (
            <>
              <p>
                This policy explains how <strong className="text-foreground">Jobli</strong> uses
                cookies and similar technologies on this website, in accordance with Italian and EU law.
              </p>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-foreground font-medium mb-2">Manage your preferences</p>
                <p className="mb-3">
                  You can choose at any time which cookie categories to allow, beyond the strictly
                  necessary ones.{' '}
                  {USING_COOKIEBOT && (
                    <>The consent banner is currently managed by Cookiebot (Usercentrics A/S), not
                    directly by us.</>
                  )}
                </p>
                <button
                  onClick={openCookiePreferences}
                  className="inline-flex px-4 py-2 rounded-lg text-xs font-semibold"
                  style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                >
                  Open cookie preferences
                </button>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">1. What are cookies?</h3>
                <p>
                  Cookies are small text files stored on your device when you visit a website. This
                  site groups them into four categories:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong className="text-foreground">Necessary</strong>, required for the site to
                    function; no consent is needed and they can&apos;t be turned off.
                  </li>
                  <li>
                    <strong className="text-foreground">Preferences</strong>, would remember display
                    choices (e.g. language, theme) between visits; require your prior consent. No
                    cookie in this category is active at this time.
                  </li>
                  <li>
                    <strong className="text-foreground">Statistics</strong>, help us understand how the
                    site is used, in aggregate form; require your prior consent.
                  </li>
                  <li>
                    <strong className="text-foreground">Marketing</strong>, used to measure the
                    effectiveness of any advertising campaigns; require your prior consent.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Necessary cookies (always active)</h3>
                <p>
                  These cookies are exempt from the prior-consent requirement under the Italian Data
                  Protection Authority&apos;s 2021 Guidelines, as they are strictly necessary for the
                  service you requested.
                </p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-foreground/15 text-left">
                        <th className="py-2 pr-3 font-semibold text-foreground">Name</th>
                        <th className="py-2 pr-3 font-semibold text-foreground">Provider</th>
                        <th className="py-2 pr-3 font-semibold text-foreground">Purpose</th>
                        <th className="py-2 pr-3 font-semibold text-foreground">Duration</th>
                        <th className="py-2 font-semibold text-foreground">Party</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-foreground/5">
                        <td className="py-2 pr-3 align-top">sb-&lt;project&gt;-auth-token</td>
                        <td className="py-2 pr-3 align-top">Supabase</td>
                        <td className="py-2 pr-3 align-top">Keeps you signed in to your account. Only set if you&apos;ve logged in or created an account.</td>
                        <td className="py-2 pr-3 align-top">Logout or prolonged inactivity</td>
                        <td className="py-2 align-top">First</td>
                      </tr>
                      {USING_COOKIEBOT ? (
                        <tr>
                          <td className="py-2 pr-3 align-top">CookieConsent</td>
                          <td className="py-2 pr-3 align-top">Usercentrics A/S (Cookiebot)</td>
                          <td className="py-2 pr-3 align-top">Stores your choices on the cookie banner currently in use, so it doesn&apos;t ask again on every visit.</td>
                          <td className="py-2 pr-3 align-top">1 year</td>
                          <td className="py-2 align-top">Third</td>
                        </tr>
                      ) : (
                        <tr>
                          <td className="py-2 pr-3 align-top">jobli_cookie_consent</td>
                          <td className="py-2 pr-3 align-top">Jobli</td>
                          <td className="py-2 pr-3 align-top">Stores your choices on this banner, so we don&apos;t ask again on every visit.</td>
                          <td className="py-2 pr-3 align-top">6 months</td>
                          <td className="py-2 align-top">First</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {USING_COOKIEBOT ? (
                  <p className="mt-3">
                    Our own in-house consent-management system (including the technical proof-of-consent
                    record) is temporarily in standby while we use Cookiebot — it doesn&apos;t receive new
                    choices while this configuration is active.
                  </p>
                ) : (
                  <p className="mt-3">
                    Besides the cookie, we keep a technical record of every consent choice on our servers (an
                    anonymous identifier, date and time, the categories chosen), so we can produce it if ever
                    needed. This record doesn&apos;t identify you as a person — it&apos;s only linked to your
                    account if you happened to be signed in at the moment you chose. We keep this record for
                    5 years from the date of the choice, in line with ordinary statute-of-limitations periods,
                    after which it is automatically deleted.
                  </p>
                )}
                <p className="mt-3">
                  The CV upload and job-tailoring forms also use Cloudflare Turnstile for bot
                  verification: by Cloudflare&apos;s own design, Turnstile does not set a cookie in
                  your browser, so it doesn&apos;t appear in this table.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Preferences cookies (opt-in)</h3>
                <p>
                  This category is reserved for any future functional cookies (e.g. remembering the
                  language or theme you chose between visits, both currently handled without a
                  cookie). <strong className="text-foreground">No cookie in this category is active</strong>{' '}
                  on the site at this time, even if you&apos;ve consented to this category (this
                  section will be updated with the specific list as soon as a cookie is actually
                  introduced).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Statistics cookies (opt-in)</h3>
                <p>
                  If you consent to the Statistics category, we activate{' '}
                  <strong className="text-foreground">Google Analytics 4</strong>, provided by Google
                  Ireland Limited, to collect aggregated, anonymised statistics about site usage
                  (pages visited, traffic source, session duration). Your IP address is truncated
                  before storage (IP anonymization) and is not used for ad personalization.
                </p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-foreground/15 text-left">
                        <th className="py-2 pr-3 font-semibold text-foreground">Name</th>
                        <th className="py-2 pr-3 font-semibold text-foreground">Provider</th>
                        <th className="py-2 pr-3 font-semibold text-foreground">Purpose</th>
                        <th className="py-2 pr-3 font-semibold text-foreground">Duration</th>
                        <th className="py-2 font-semibold text-foreground">Party</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-foreground/5">
                        <td className="py-2 pr-3 align-top">_ga</td>
                        <td className="py-2 pr-3 align-top">Google Ireland Limited</td>
                        <td className="py-2 pr-3 align-top">Distinguishes users from one another.</td>
                        <td className="py-2 pr-3 align-top">~2 years</td>
                        <td className="py-2 align-top">Third</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 align-top">_ga_&lt;container-id&gt;</td>
                        <td className="py-2 pr-3 align-top">Google Ireland Limited</td>
                        <td className="py-2 pr-3 align-top">Persists browsing session state.</td>
                        <td className="py-2 pr-3 align-top">~2 years</td>
                        <td className="py-2 align-top">Third</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3">
                  If you decline this category (or don&apos;t respond), Google Analytics is never
                  loaded and none of these cookies are set. See{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Google&apos;s Privacy Policy
                  </a>{' '}
                  for details.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Marketing cookies (opt-in)</h3>
                <p>
                  This category is reserved for any future advertising tools (e.g. remarketing
                  pixels). <strong className="text-foreground">No marketing tool is active</strong> on
                  the site at this time, even if you&apos;ve consented to this category (this section
                  will be updated with the specific cookie list as soon as a tool is actually
                  introduced).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">6. Hosting infrastructure cookies</h3>
                <p>
                  This site is hosted on Vercel Inc. (San Francisco, USA). The hosting platform may
                  set technical session cookies required for the correct operation of the web
                  application (e.g. load balancing). These cookies do not identify the user and are
                  not shared with third parties for marketing purposes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">7. Managing cookies in your browser</h3>
                <p>
                  Besides this site&apos;s preferences panel, you can disable or delete cookies at any
                  time through your browser settings. Note: disabling necessary cookies will prevent
                  you from accessing your account.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a>
                  </li>
                  <li>
                    <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a>
                  </li>
                  <li>
                    <a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Apple Safari</a>
                  </li>
                  <li>
                    <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">8. Changes to this policy</h3>
                <p>
                  We reserve the right to update this Cookie Policy at any time, particularly in
                  response to regulatory, technological, or infrastructure changes. The updated
                  version will be published on this page with the revision date.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">9. Contact</h3>
                <p>
                  For any questions about this Cookie Policy, write to{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
                    {SUPPORT_EMAIL}
                  </a>
                  .
                </p>
              </div>

              <p>
                For personal data processing, see our{' '}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
