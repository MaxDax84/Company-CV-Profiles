'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/language-provider'

export default function PrivacyPage() {
  const { lang } = useLanguage()

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

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-12">
          {lang === 'it' ? 'Ultimo aggiornamento: Marzo 2025' : 'Last updated: March 2025'}
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
          {lang === 'it' ? (
            <>
              <p>
                Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14 del
                Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018.
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
                <p>Tramite il modulo di contatto raccogliamo i seguenti dati personali:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Nome e cognome</li>
                  <li>Indirizzo email</li>
                  <li>Testo del messaggio</li>
                  <li>Eventuale curriculum vitae in formato PDF allegato (facoltativo)</li>
                </ul>
                <p className="mt-2">
                  Tramite il generatore di profili raccogliamo inoltre il contenuto del CV in PDF
                  caricato dall&apos;utente, utilizzato esclusivamente per generare la pagina profilo
                  richiesta.
                </p>
                <p className="mt-2">
                  Non vengono raccolti dati sensibili ai sensi dell&apos;art. 9 GDPR.
                  Non vengono effettuate profilazioni automatizzate né decisioni automatizzate.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Finalità e Base Giuridica</h3>
                <p>
                  I dati sono trattati esclusivamente per rispondere alla richiesta inviata tramite
                  il modulo di contatto o per generare la pagina profilo richiesta tramite il
                  generatore. La base giuridica è il consenso esplicito dell&apos;interessato,
                  manifestato tramite la casella di consenso obbligatoria prima dell&apos;invio
                  (art. 6(1)(a) GDPR).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Conservazione dei Dati</h3>
                <p>
                  I dati del modulo di contatto vengono ricevuti via email e non sono archiviati
                  in alcun database. I dati del CV caricati tramite il generatore vengono conservati
                  su infrastruttura Vercel KV esclusivamente per rendere disponibile la pagina
                  profilo generata, per un periodo massimo di <strong className="text-foreground">90 giorni</strong> dalla
                  generazione, trascorsi i quali il profilo e i relativi dati vengono eliminati automaticamente.
                  È possibile richiedere la cancellazione anticipata in qualsiasi momento scrivendo
                  all&apos;indirizzo indicato nella sezione 7.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Destinatari dei Dati</h3>
                <p>
                  I dati non vengono ceduti né venduti a terzi. I soggetti che trattano i dati in
                  qualità di responsabili del trattamento ai sensi dell&apos;art. 28 GDPR sono:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Google LLC (Gmail) — ricezione messaggi dal modulo di contatto</li>
                  <li>Vercel Inc. — hosting e archiviazione dei profili generati</li>
                  <li>Anthropic PBC — elaborazione del testo del CV per la generazione del profilo</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">6. Trasferimento Dati Extra-UE</h3>
                <p>
                  I fornitori sopra indicati hanno sede negli Stati Uniti. I trasferimenti sono
                  effettuati nel rispetto delle garanzie previste dagli artt. 44–49 GDPR, tramite
                  le Standard Contractual Clauses (SCC) adottate dalla Commissione Europea.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">7. Diritti dell&apos;Interessato</h3>
                <p>Ai sensi degli artt. 15–22 GDPR, l&apos;interessato ha il diritto di:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Accedere ai propri dati personali (art. 15)</li>
                  <li>Rettificarli (art. 16)</li>
                  <li>Ottenerne la cancellazione (art. 17, &quot;diritto all&apos;oblio&quot;)</li>
                  <li>Limitarne il trattamento (art. 18)</li>
                  <li>Ricevere i propri dati in formato portabile (art. 20)</li>
                  <li>Opporsi al trattamento (art. 21)</li>
                  <li>Revocare il consenso in qualsiasi momento (art. 7(3))</li>
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
                  <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
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
                  <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
                </p>
              </div>
            </>
          ) : (
            <>
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
                <p>When you submit the contact form, we collect the following personal data:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>First and last name</li>
                  <li>Email address</li>
                  <li>Message content</li>
                  <li>Optionally, a CV/résumé in PDF format</li>
                </ul>
                <p className="mt-2">
                  When using the profile generator, we also process the content of the uploaded PDF CV,
                  used solely to generate the requested profile page.
                </p>
                <p className="mt-2">
                  No special category data (Art. 9 GDPR) is collected. No automated decision-making
                  or profiling takes place.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Purpose and Legal Basis</h3>
                <p>
                  Your data is used exclusively to respond to your enquiry or to generate your
                  profile page via the generator. The legal basis is your explicit consent, given
                  by ticking the mandatory consent checkbox before submitting (Art. 6(1)(a) GDPR).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Data Retention</h3>
                <p>
                  Contact form data is received by email and is not stored in any database. CV data
                  uploaded via the generator is stored on Vercel KV infrastructure solely to make
                  the generated profile page available, for a maximum period of{' '}
                  <strong className="text-foreground">90 days</strong> from generation, after which
                  the profile and associated data are deleted automatically. You may request early
                  deletion at any time by writing to the address in section 7.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Data Recipients</h3>
                <p>
                  Your data is not sold or shared with third parties. The processors (Art. 28 GDPR) are:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Google LLC (Gmail) — receipt of contact form messages</li>
                  <li>Vercel Inc. — hosting and storage of generated profiles</li>
                  <li>Anthropic PBC — processing of CV text for profile generation</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">6. International Transfers</h3>
                <p>
                  The processors listed above are based in the United States. Data transfers are
                  carried out under the safeguards of Arts. 44–49 GDPR via Standard Contractual
                  Clauses (SCC) adopted by the European Commission.
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
                  <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
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
                  <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
