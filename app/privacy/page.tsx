import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | BeOnWeb',
  description: 'Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR) — Privacy Policy for BeOnWeb.',
}

export default function PrivacyPage() {
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

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-12">
          Ultimo aggiornamento / Last updated: March 2025
        </p>

        <div className="space-y-12 text-sm leading-relaxed text-muted-foreground">

          {/* ── ITALIANO ── */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Informativa Privacy (Italiano)</h2>
            <p>
              Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14 del
              Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003 come modificato dal D.Lgs.
              101/2018.
            </p>

            <div>
              <h3 className="font-semibold text-foreground mb-2">1. Titolare del Trattamento</h3>
              <p>
                Il titolare del trattamento è <strong className="text-foreground">BeOnWeb</strong>,
                gestito da Massimo Dassano, con sede in Italia.
                <br />
                Email di contatto:{' '}
                <a href="mailto:massimo.dassano@gmail.com" className="text-primary hover:underline">
                  massimo.dassano@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">2. Dati Raccolti</h3>
              <p>
                Tramite il modulo di contatto raccogliamo i seguenti dati personali:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Nome e cognome</li>
                <li>Indirizzo email</li>
                <li>Testo del messaggio</li>
                <li>Eventuale curriculum vitae in formato PDF allegato (facoltativo)</li>
              </ul>
              <p className="mt-2">
                Non vengono raccolti dati sensibili ai sensi dell&apos;art. 9 GDPR.
                Non vengono effettuate profilazioni automatizzate né decisioni automatizzate.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">3. Finalità e Base Giuridica</h3>
              <p>
                I dati sono trattati esclusivamente per rispondere alla richiesta inviata tramite
                il modulo di contatto. La base giuridica è il consenso esplicito
                dell&apos;interessato, manifestato tramite la casella di consenso obbligatoria
                prima dell&apos;invio (art. 6(1)(a) GDPR).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">4. Conservazione dei Dati</h3>
              <p>
                I dati vengono ricevuti via email e non sono archiviati in alcun database. Vengono
                conservati solo per il tempo strettamente necessario a gestire la richiesta e
                successivamente eliminati. Non è prevista conservazione sistematica.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">5. Destinatari dei Dati</h3>
              <p>
                I dati non vengono ceduti né venduti a terzi. L&apos;unico soggetto che tratta i
                dati, in qualità di responsabile del trattamento ai sensi dell&apos;art. 28 GDPR,
                è Google LLC (infrastruttura Gmail/Google Workspace) utilizzata per la ricezione
                del messaggio. Google tratta i dati nel rispetto della propria{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">6. Trasferimento Dati Extra-UE</h3>
              <p>
                Google LLC ha sede negli Stati Uniti. Il trasferimento dei dati è effettuato nel
                rispetto delle garanzie previste dagli artt. 44-49 GDPR, tramite le Standard
                Contractual Clauses (SCC) adottate dalla Commissione Europea.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">7. Diritti dell&apos;Interessato</h3>
              <p>Ai sensi degli artt. 15-22 GDPR, l&apos;interessato ha il diritto di:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Accedere ai propri dati personali (art. 15)</li>
                <li>Rettificarli (art. 16)</li>
                <li>Ottenerne la cancellazione (art. 17, &quot;diritto all&apos;oblio&quot;)</li>
                <li>Limitarne il trattamento (art. 18)</li>
                <li>Ricevere i propri dati in formato portabile (art. 20)</li>
                <li>Opporsi al trattamento (art. 21)</li>
                <li>Revocare il consenso in qualsiasi momento, senza pregiudizio per la liceità del trattamento precedente alla revoca (art. 7(3))</li>
              </ul>
              <p className="mt-2">
                Per esercitare tali diritti, scrivere a{' '}
                <a href="mailto:massimo.dassano@gmail.com" className="text-primary hover:underline">
                  massimo.dassano@gmail.com
                </a>
                . Il titolare risponderà entro 30 giorni dalla richiesta.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">8. Reclamo all&apos;Autorità di Controllo</h3>
              <p>
                L&apos;interessato ha il diritto di proporre reclamo al Garante per la Protezione
                dei Dati Personali (
                <a
                  href="https://www.garanteprivacy.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  www.garanteprivacy.it
                </a>
                ) qualora ritenga che il trattamento violi il GDPR.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">9. Cookie</h3>
              <p>
                Questo sito non utilizza cookie di profilazione né strumenti di analisi di terze
                parti. Per maggiori informazioni consulta la nostra{' '}
                <Link href="/cookies" className="text-primary hover:underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
          </section>

          <hr className="border-border/40" />

          {/* ── ENGLISH ── */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Privacy Policy (English)</h2>
            <p>
              Privacy notice pursuant to Arts. 13 and 14 of EU Regulation 2016/679 (GDPR).
            </p>

            <div>
              <h3 className="font-semibold text-foreground mb-2">1. Data Controller</h3>
              <p>
                The data controller is <strong className="text-foreground">BeOnWeb</strong>,
                operated by Massimo Dassano, based in Italy.
                <br />
                Contact email:{' '}
                <a href="mailto:massimo.dassano@gmail.com" className="text-primary hover:underline">
                  massimo.dassano@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">2. Data Collected</h3>
              <p>
                When you submit the contact form, we collect the following personal data:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>First and last name</li>
                <li>Email address</li>
                <li>Message content</li>
                <li>Optionally, a CV/résumé in PDF format</li>
              </ul>
              <p className="mt-2">
                No special category data (Art. 9 GDPR) is collected. No automated decision-making
                or profiling takes place.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">3. Purpose and Legal Basis</h3>
              <p>
                Your data is used exclusively to respond to your enquiry. The legal basis is your
                explicit consent, given by ticking the mandatory consent checkbox before submitting
                the form (Art. 6(1)(a) GDPR).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">4. Data Retention</h3>
              <p>
                Data is received by email and is not stored in any database. It is kept only for
                as long as necessary to handle your request, then deleted. No systematic archiving
                takes place.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">5. Data Recipients</h3>
              <p>
                Your data is not sold or shared with third parties. The only processor (Art. 28
                GDPR) is Google LLC (Gmail/Google Workspace), used to receive your message.
                Google processes data in accordance with its own{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">6. International Transfers</h3>
              <p>
                Google LLC is based in the United States. Data transfers are carried out under the
                safeguards of Arts. 44–49 GDPR via Standard Contractual Clauses (SCC) adopted by
                the European Commission.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">7. Your Rights</h3>
              <p>Under Arts. 15–22 GDPR, you have the right to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Access your personal data (Art. 15)</li>
                <li>Rectify inaccurate data (Art. 16)</li>
                <li>Erasure / right to be forgotten (Art. 17)</li>
                <li>Restriction of processing (Art. 18)</li>
                <li>Data portability (Art. 20)</li>
                <li>Object to processing (Art. 21)</li>
                <li>Withdraw consent at any time without affecting prior lawful processing (Art. 7(3))</li>
              </ul>
              <p className="mt-2">
                To exercise these rights, write to{' '}
                <a href="mailto:massimo.dassano@gmail.com" className="text-primary hover:underline">
                  massimo.dassano@gmail.com
                </a>
                . We will respond within 30 days.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">8. Supervisory Authority</h3>
              <p>
                You have the right to lodge a complaint with the Italian Data Protection Authority
                (Garante per la Protezione dei Dati Personali,{' '}
                <a
                  href="https://www.garanteprivacy.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  www.garanteprivacy.it
                </a>
                ) if you believe the processing infringes the GDPR.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">9. Cookies</h3>
              <p>
                This website does not use profiling cookies or third-party analytics tools. For
                full details see our{' '}
                <Link href="/cookies" className="text-primary hover:underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}
