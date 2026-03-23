import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy | BeOnWeb',
  description: 'Informativa sull\'uso dei cookie ai sensi del D.Lgs. 69/2012 e delle Linee Guida del Garante — Cookie Policy for BeOnWeb.',
}

export default function CookiePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-24">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          ← Back to BeOnWeb
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Cookie Policy</h1>
        <p className="text-muted-foreground text-sm mb-12">
          Ultimo aggiornamento / Last updated: March 2025
        </p>

        <div className="space-y-12 text-sm leading-relaxed text-muted-foreground">

          {/* ── ITALIANO ── */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Cookie Policy (Italiano)</h2>
            <p>
              Informativa sull&apos;uso dei cookie ai sensi dell&apos;art. 122 del D.Lgs. 196/2003
              (Codice Privacy), come modificato dal D.Lgs. 101/2018, e delle{' '}
              <em>Linee guida cookie e altri strumenti di tracciamento</em> del Garante per la
              Protezione dei Dati Personali del 10 giugno 2021.
            </p>

            <div>
              <h3 className="font-semibold text-foreground mb-2">1. Cosa sono i cookie</h3>
              <p>
                I cookie sono piccoli file di testo che i siti web salvano sul dispositivo
                dell&apos;utente durante la navigazione. Possono essere classificati in:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                  <strong className="text-foreground">Cookie tecnici</strong> — necessari al
                  funzionamento del sito e non richiedono consenso.
                </li>
                <li>
                  <strong className="text-foreground">Cookie di profilazione / marketing</strong>{' '}
                  — tracciano il comportamento dell&apos;utente a fini commerciali e richiedono
                  consenso preventivo.
                </li>
                <li>
                  <strong className="text-foreground">Cookie analitici di terze parti</strong>{' '}
                  — raccolgono statistiche aggregate sulla navigazione e richiedono consenso (salvo
                  anonimizzazione).
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">2. Cookie utilizzati da questo sito</h3>
              <p>
                Il sito <strong className="text-foreground">beonweb.it</strong> non utilizza:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Cookie di profilazione o marketing</li>
                <li>Cookie analitici di terze parti (es. Google Analytics, Meta Pixel)</li>
                <li>Cookie di social network</li>
              </ul>
              <p className="mt-3">
                Il sito <strong className="text-foreground">non rilascia cookie</strong> di alcun
                tipo. Non è pertanto richiesto il banner di consenso ai sensi delle Linee Guida
                del Garante del 2021, in quanto non vengono depositati cookie sul dispositivo
                dell&apos;utente al di fuori di quelli strettamente tecnici eventualmente generati
                dal browser stesso o dall&apos;infrastruttura di hosting.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">3. Cookie tecnici dell&apos;infrastruttura di hosting</h3>
              <p>
                Il sito è ospitato su infrastruttura cloud (Vercel Inc., San Francisco, USA). La
                piattaforma di hosting potrebbe impostare cookie tecnici di sessione necessari al
                corretto funzionamento dell&apos;applicazione web (es. bilanciamento del carico).
                Tali cookie non identificano l&apos;utente e non vengono trasmessi a terzi per
                finalità di marketing.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">4. Come gestire i cookie dal browser</h3>
              <p>
                L&apos;utente può in qualsiasi momento disabilitare o eliminare i cookie tramite
                le impostazioni del proprio browser. Di seguito i link alle istruzioni dei
                principali browser:
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
              <p className="mt-2">
                La disabilitazione dei cookie tecnici potrebbe compromettere la fruibilità del sito.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">5. Modifiche alla Cookie Policy</h3>
              <p>
                Il Titolare si riserva il diritto di aggiornare la presente Cookie Policy in
                qualsiasi momento, in particolare in caso di modifiche normative o tecnologiche.
                La versione aggiornata sarà pubblicata su questa pagina con indicazione della data
                di aggiornamento.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">6. Contatti</h3>
              <p>
                Per qualsiasi domanda relativa alla presente Cookie Policy, scrivere a{' '}
                <a href="mailto:massimo.dassano@gmail.com" className="text-primary hover:underline">
                  massimo.dassano@gmail.com
                </a>
                .
              </p>
            </div>

            <p>
              Per il trattamento dei dati personali, consulta la nostra{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <hr className="border-border/40" />

          {/* ── ENGLISH ── */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Cookie Policy (English)</h2>
            <p>
              This policy explains how <strong className="text-foreground">BeOnWeb</strong> uses
              cookies and similar technologies on this website, in accordance with Italian and EU
              law.
            </p>

            <div>
              <h3 className="font-semibold text-foreground mb-2">1. What are cookies?</h3>
              <p>
                Cookies are small text files stored on your device when you visit a website. They
                can be classified as:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                  <strong className="text-foreground">Technical cookies</strong> — necessary for
                  the site to function correctly; no consent is required.
                </li>
                <li>
                  <strong className="text-foreground">Profiling / marketing cookies</strong> —
                  track user behaviour for commercial purposes; prior consent is required.
                </li>
                <li>
                  <strong className="text-foreground">Third-party analytics cookies</strong> —
                  collect aggregate browsing statistics; consent is required unless fully
                  anonymised.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">2. Cookies used on this site</h3>
              <p>
                <strong className="text-foreground">BeOnWeb does not use</strong>:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Profiling or marketing cookies</li>
                <li>Third-party analytics tools (e.g. Google Analytics, Meta Pixel)</li>
                <li>Social network cookies</li>
              </ul>
              <p className="mt-3">
                <strong className="text-foreground">No cookies are set</strong> by this website.
                Therefore, no cookie consent banner is required under the Italian Data Protection
                Authority&apos;s 2021 Guidelines, as no cookies are deposited on the user&apos;s
                device beyond those technically generated by the browser or hosting infrastructure.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">3. Hosting infrastructure cookies</h3>
              <p>
                This site is hosted on Vercel Inc. (San Francisco, USA). The hosting platform may
                set technical session cookies required for the correct operation of the web
                application (e.g. load balancing). These cookies do not identify the user and are
                not shared with third parties for marketing purposes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">4. Managing cookies in your browser</h3>
              <p>
                You can disable or delete cookies at any time through your browser settings:
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
              <p className="mt-2">
                Disabling technical cookies may affect the usability of the site.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">5. Changes to this policy</h3>
              <p>
                We reserve the right to update this Cookie Policy at any time, particularly in
                response to regulatory or technological changes. The updated version will be
                published on this page with the revision date.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">6. Contact</h3>
              <p>
                For any questions about this Cookie Policy, write to{' '}
                <a href="mailto:massimo.dassano@gmail.com" className="text-primary hover:underline">
                  massimo.dassano@gmail.com
                </a>
                .
              </p>
            </div>

            <p>
              For personal data processing, see our{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
