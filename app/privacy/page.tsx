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

        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-12">
          {lang === 'it' ? 'Ultimo aggiornamento: Agosto 2026' : 'Last updated: August 2026'}
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
                  Il titolare del trattamento è <strong className="text-foreground">Jobly</strong>,
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
                <p>Tramite il modulo di contatto raccogliamo:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Nome e cognome</li>
                  <li>Indirizzo email</li>
                  <li>Testo del messaggio</li>
                  <li>Eventuale curriculum vitae in formato PDF allegato (facoltativo)</li>
                </ul>
                <p className="mt-3">Se crei un account raccogliamo inoltre:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Indirizzo email e password (la password è gestita dal nostro fornitore di autenticazione, Supabase, e non è mai visibile a noi in chiaro)</li>
                  <li>Data di creazione dell&apos;account</li>
                  <li>Saldo crediti e storico delle transazioni (es. &quot;download PDF&quot;, &quot;adattamento annuncio&quot;, con data)</li>
                </ul>
                <p className="mt-3">Quando carichi un CV tramite il generatore di profili raccogliamo:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Il contenuto del CV caricato (esperienze, formazione, competenze, progetti, ecc.), estratto ed elaborato tramite intelligenza artificiale per costruire il tuo profilo</li>
                  <li>Nome del file PDF caricato, utilizzato per generare l&apos;indirizzo web della tua pagina profilo (modificabile in qualsiasi momento dal tuo account)</li>
                  <li>Email e numero di telefono reali (non oscurati), utilizzati esclusivamente per il PDF scaricabile privatamente — la pagina web pubblica mostra sempre versioni oscurate di questi dati per limitare la raccolta automatizzata da parte di terzi</li>
                  <li>Eventuali link a profili social (es. LinkedIn) se forniti</li>
                </ul>
                <p className="mt-3">
                  Se utilizzi la funzione di adattamento del CV a un annuncio di lavoro, il testo
                  dell&apos;annuncio (incollato o recuperato da un link fornito) viene inviato al
                  nostro fornitore di intelligenza artificiale per generare la versione adattata del
                  CV, ma non viene conservato da noi oltre il tempo necessario a completare
                  l&apos;elaborazione.
                </p>
                <p className="mt-3">
                  Non vengono raccolti dati sensibili ai sensi dell&apos;art. 9 GDPR.
                  Non vengono effettuate profilazioni automatizzate a fini commerciali né decisioni
                  automatizzate con effetti giuridici sull&apos;utente.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Finalità e Base Giuridica</h3>
                <p>
                  I dati del modulo di contatto sono trattati sulla base del consenso esplicito
                  dell&apos;interessato (art. 6(1)(a) GDPR). I dati legati alla creazione e gestione
                  dell&apos;account, alla generazione del profilo e all&apos;adattamento del CV sono
                  trattati per l&apos;esecuzione del servizio richiesto dall&apos;utente (art. 6(1)(b)
                  GDPR — esecuzione di un contratto/misure precontrattuali su richiesta
                  dell&apos;interessato).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Conservazione dei Dati</h3>
                <p>
                  I dati del modulo di contatto vengono ricevuti via email e non sono archiviati in
                  alcun database.
                </p>
                <p className="mt-2">
                  Un CV appena caricato ma non ancora collegato a un account (&quot;anteprima&quot;)
                  viene conservato per un massimo di <strong className="text-foreground">1 ora</strong>,
                  trascorsa la quale viene eliminato automaticamente se non registri un account.
                </p>
                <p className="mt-2">
                  Un CV collegato a un account (registrandoti o accedendo dopo averlo caricato) viene
                  invece conservato <strong className="text-foreground">senza scadenza automatica</strong>,
                  fino a quando tu stesso non lo elimini. Puoi eliminare un singolo CV, o l&apos;intero
                  account (con tutti i CV, gli adattamenti e i crediti collegati) in qualsiasi momento,
                  in autonomia, dalla pagina del tuo account — l&apos;eliminazione è immediata e
                  irreversibile.
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
                  <li>Vercel Inc. — hosting dell&apos;applicazione e conservazione temporanea delle anteprime non ancora collegate a un account</li>
                  <li>Supabase Inc. — gestione degli account, autenticazione e conservazione permanente dei profili e dei dati dei CV collegati a un account</li>
                  <li>Anthropic PBC — elaborazione del testo del CV per l&apos;estrazione, il miglioramento e l&apos;adattamento del profilo</li>
                  <li>Cloudflare Inc. — verifica anti-bot (Turnstile) sui moduli di caricamento CV e adattamento annuncio</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">6. Trasferimento Dati Extra-UE</h3>
                <p>
                  I fornitori sopra indicati hanno sede negli Stati Uniti (l&apos;infrastruttura dati
                  di Supabase può essere configurata in diverse regioni, incluse quelle europee). I
                  trasferimenti extra-UE sono effettuati nel rispetto delle garanzie previste dagli
                  artt. 44–49 GDPR, tramite le Standard Contractual Clauses (SCC) adottate dalla
                  Commissione Europea.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">7. Diritti dell&apos;Interessato</h3>
                <p>Ai sensi degli artt. 15–22 GDPR, l&apos;interessato ha il diritto di:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Accedere ai propri dati personali (art. 15)</li>
                  <li>Rettificarli (art. 16) — i dati anagrafici del tuo CV sono modificabili direttamente dalla pagina del tuo account</li>
                  <li>Ottenerne la cancellazione (art. 17, &quot;diritto all&apos;oblio&quot;) — puoi eliminare un singolo CV o l&apos;intero account autonomamente, senza bisogno di richiederlo a noi</li>
                  <li>Limitarne il trattamento (art. 18)</li>
                  <li>Ricevere i propri dati in formato portabile (art. 20)</li>
                  <li>Opporsi al trattamento (art. 21)</li>
                  <li>Revocare il consenso in qualsiasi momento (art. 7(3))</li>
                </ul>
                <p className="mt-2">
                  Per esercitare i diritti non disponibili in autonomia dalla pagina del tuo account,
                  scrivere a{' '}
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
                  Questo sito utilizza esclusivamente cookie strettamente necessari al funzionamento
                  del servizio (es. mantenimento della sessione di accesso, verifica anti-bot). Non
                  utilizza cookie di profilazione né strumenti di analisi di terze parti. Per maggiori
                  informazioni consulta la nostra{' '}
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
                  The data controller is <strong className="text-foreground">Jobly</strong>,
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
                <p>When you submit the contact form, we collect:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>First and last name</li>
                  <li>Email address</li>
                  <li>Message content</li>
                  <li>Optionally, a CV/résumé in PDF format</li>
                </ul>
                <p className="mt-3">If you create an account, we also collect:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Email address and password (your password is handled by our authentication provider, Supabase, and is never visible to us in plain text)</li>
                  <li>Account creation date</li>
                  <li>Credit balance and transaction history (e.g. &quot;PDF download&quot;, &quot;job tailoring&quot;, with date)</li>
                </ul>
                <p className="mt-3">When you upload a CV via the profile generator, we collect:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>The uploaded CV&apos;s content (experience, education, skills, projects, etc.), extracted and processed by AI to build your profile</li>
                  <li>The uploaded PDF&apos;s filename, used to generate your profile page&apos;s web address (editable at any time from your account)</li>
                  <li>Your real (unredacted) email and phone number, used solely for the privately downloadable PDF — the public web page always shows redacted versions of these to limit automated scraping by third parties</li>
                  <li>Any social profile links (e.g. LinkedIn) you provide</li>
                </ul>
                <p className="mt-3">
                  If you use the job-tailoring feature, the job posting text (pasted or fetched from
                  a link you provide) is sent to our AI provider to generate the tailored version of
                  your CV, but is not retained by us beyond the time needed to complete that processing.
                </p>
                <p className="mt-3">
                  No special category data (Art. 9 GDPR) is collected. No automated decision-making
                  with legal effects on you takes place, and no profiling for commercial purposes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Purpose and Legal Basis</h3>
                <p>
                  Contact form data is processed on the basis of your explicit consent (Art. 6(1)(a)
                  GDPR). Data related to your account, profile generation, and CV tailoring is
                  processed to perform the service you requested (Art. 6(1)(b) GDPR — performance of
                  a contract / pre-contractual steps taken at your request).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Data Retention</h3>
                <p>
                  Contact form data is received by email and is not stored in any database.
                </p>
                <p className="mt-2">
                  A CV you&apos;ve just uploaded but not yet linked to an account (a &quot;preview&quot;)
                  is kept for a maximum of <strong className="text-foreground">1 hour</strong>, after
                  which it is deleted automatically if you don&apos;t create or sign in to an account.
                </p>
                <p className="mt-2">
                  A CV linked to an account (by signing up or logging in after uploading it) is kept{' '}
                  <strong className="text-foreground">indefinitely</strong>, until you delete it
                  yourself. You can delete a single CV, or your entire account (with every CV, every
                  tailored version, and your credits) at any time, on your own, from your account
                  page — deletion is immediate and irreversible.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Data Recipients</h3>
                <p>
                  Your data is not sold or shared with third parties. The processors (Art. 28 GDPR) are:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Google LLC (Gmail) — receipt of contact form messages</li>
                  <li>Vercel Inc. — application hosting and temporary storage of previews not yet linked to an account</li>
                  <li>Supabase Inc. — account management, authentication, and permanent storage of profiles and CV data linked to an account</li>
                  <li>Anthropic PBC — processing of CV text for profile extraction, improvement, and job tailoring</li>
                  <li>Cloudflare Inc. — bot verification (Turnstile) on the CV upload and job-tailoring forms</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">6. International Transfers</h3>
                <p>
                  The processors listed above are based in the United States (Supabase&apos;s data
                  infrastructure can be configured in various regions, including within the EU). Non-EU
                  transfers are carried out under the safeguards of Arts. 44–49 GDPR via Standard
                  Contractual Clauses (SCC) adopted by the European Commission.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">7. Your Rights</h3>
                <p>Under Arts. 15–22 GDPR, you have the right to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Access your personal data (Art. 15)</li>
                  <li>Rectify inaccurate data (Art. 16) — your CV&apos;s personal details can be edited directly from your account page</li>
                  <li>Erasure / right to be forgotten (Art. 17) — you can delete a single CV or your entire account yourself, without needing to request it from us</li>
                  <li>Restriction of processing (Art. 18)</li>
                  <li>Data portability (Art. 20)</li>
                  <li>Object to processing (Art. 21)</li>
                  <li>Withdraw consent at any time without affecting prior lawful processing (Art. 7(3))</li>
                </ul>
                <p className="mt-2">
                  To exercise rights not available directly from your account page, write to{' '}
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
                  This website only uses cookies strictly necessary for the service to function
                  (e.g. keeping you signed in, bot verification). It does not use profiling cookies
                  or third-party analytics tools. For full details see our{' '}
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
