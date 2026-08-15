'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/language-provider'

export default function TermsPage() {
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

        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {lang === 'it' ? 'Termini di Servizio' : 'Terms of Service'}
        </h1>
        <p className="text-muted-foreground text-sm mb-12">
          {lang === 'it' ? 'Ultimo aggiornamento: Agosto 2026' : 'Last updated: August 2026'}
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
          {lang === 'it' ? (
            <>
              <p>
                I presenti Termini di Servizio regolano l&apos;utilizzo della piattaforma{' '}
                <strong className="text-foreground">Jobli</strong>, gestita da Massimo Dassano
                (di seguito &quot;Fornitore&quot;), da parte di chiunque acceda o utilizzi i servizi
                offerti tramite il sito.
              </p>

              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Descrizione del Servizio</h3>
                <p>Jobli è una piattaforma che utilizza l&apos;intelligenza artificiale per:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Analizzare un CV caricato in formato PDF e assegnargli un punteggio su criteri oggettivi (risultati misurabili, chiarezza, struttura ATS, competenze specifiche);</li>
                  <li>Migliorarne i contenuti senza inventare informazioni non presenti nel documento originale;</li>
                  <li>Generare una pagina web personale, pubblica e condivisibile, a partire dal CV;</li>
                  <li>Generare un PDF ottimizzato per i sistemi di selezione automatica (ATS);</li>
                  <li>Adattare il CV a uno specifico annuncio di lavoro fornito dall&apos;utente.</li>
                </ul>
                <p className="mt-2">
                  Il servizio è attualmente in fase beta ed è gratuito. Il Fornitore si riserva il
                  diritto di introdurre in futuro funzionalità o crediti aggiuntivi a pagamento; in
                  tal caso i presenti Termini saranno aggiornati con condizioni economiche specifiche
                  prima dell&apos;attivazione di qualsiasi pagamento.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Account e Crediti</h3>
                <p>
                  L&apos;utilizzo di alcune funzionalità (salvataggio permanente del CV, download del
                  PDF, adattamento a un annuncio) richiede la creazione di un account con email e
                  password. Ogni nuovo account riceve un credito gratuito; il download del PDF e
                  l&apos;adattamento a un annuncio consumano un credito ciascuno. L&apos;utente è
                  responsabile della riservatezza delle proprie credenziali di accesso.
                </p>
                <p className="mt-2">
                  L&apos;utente può eliminare in autonomia un singolo CV o l&apos;intero account, con
                  effetto immediato e irreversibile, dalla pagina del proprio account.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Natura dei Contenuti Generati dall&apos;AI</h3>
                <p>
                  I contenuti generati o migliorati dall&apos;intelligenza artificiale (bio, pagina
                  profilo, PDF, versioni adattate del CV) sono elaborati a partire esclusivamente dal
                  materiale fornito dall&apos;utente: il sistema è progettato per non inventare
                  esperienze, competenze, titoli o dati non presenti nel CV originale. Ciononostante,
                  come per qualunque strumento basato su intelligenza artificiale, il Fornitore non
                  garantisce l&apos;assenza totale di errori o imprecisioni. È responsabilità
                  dell&apos;utente verificare l&apos;accuratezza del contenuto generato prima di
                  utilizzarlo (es. per candidature di lavoro).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Obblighi dell&apos;Utente</h3>
                <p>L&apos;utente si impegna a:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Caricare esclusivamente il proprio CV, o un CV di terzi per il quale disponga del consenso esplicito degli stessi.</li>
                  <li>Fornire informazioni veritiere nei dati anagrafici modificabili dall&apos;account.</li>
                  <li>Non utilizzare il servizio per scopi illeciti, fraudolenti o contrari all&apos;ordine pubblico.</li>
                  <li>Non tentare di eludere le misure anti-abuso del servizio (es. limiti di utilizzo, verifica anti-bot).</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Proprietà Intellettuale</h3>
                <p>
                  Il codice sorgente, il design e i template del sito rimangono di proprietà del
                  Fornitore. I contenuti del CV forniti dall&apos;utente, e la pagina profilo generata
                  a partire da essi, restano di proprietà dell&apos;utente; il Fornitore non ne
                  rivendica alcun diritto oltre a quanto necessario per erogare il servizio richiesto.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">6. Limitazione di Responsabilità</h3>
                <p>
                  Il servizio è fornito &quot;così com&apos;è&quot;. Il Fornitore non è responsabile
                  per interruzioni causate da fornitori terzi (hosting, autenticazione, intelligenza
                  artificiale), né per l&apos;esito di candidature o colloqui di lavoro basati sui
                  contenuti generati. La responsabilità complessiva del Fornitore, ove applicabile,
                  non potrà in alcun caso superare l&apos;importo eventualmente pagato dall&apos;utente
                  per il servizio oggetto della contestazione. Il Fornitore non è responsabile per
                  danni indiretti, perdita di dati o mancato guadagno.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">7. Sospensione e Cessazione</h3>
                <p>
                  Il Fornitore può sospendere o eliminare un account in caso di violazione dei
                  presenti Termini, utilizzo illecito o abusivo del servizio. L&apos;utente può
                  cessare l&apos;utilizzo del servizio ed eliminare il proprio account in qualsiasi
                  momento, in autonomia.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">8. Modifiche al Servizio e ai Termini</h3>
                <p>
                  Il Fornitore si riserva il diritto di modificare, sospendere o interrompere
                  funzionalità del servizio, e di aggiornare i presenti Termini, in qualsiasi momento.
                  Le modifiche sostanziali saranno comunicate tramite pubblicazione su questa pagina
                  con indicazione della data di aggiornamento.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">9. Legge Applicabile e Foro Competente</h3>
                <p>
                  I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia
                  è competente in via esclusiva il Tribunale di Torino, salvo diversa disposizione
                  inderogabile a tutela dei consumatori.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">10. Contatti</h3>
                <p>
                  Per qualsiasi richiesta relativa ai presenti Termini, scrivere a{' '}
                  <a href="mailto:massimo.dassano@gmail.com" className="text-primary hover:underline">
                    massimo.dassano@gmail.com
                  </a>
                  .
                </p>
              </div>

              <p>
                Per informazioni sul trattamento dei dati personali, consulta la nostra{' '}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </>
          ) : (
            <>
              <p>
                These Terms of Service govern the use of the{' '}
                <strong className="text-foreground">Jobli</strong> platform, operated by Massimo
                Dassano (the &quot;Provider&quot;), by anyone who accesses or uses the services
                offered through this website.
              </p>

              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Service Description</h3>
                <p>Jobli is a platform that uses artificial intelligence to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Analyze a PDF CV upload and score it against objective criteria (quantified results, clarity, ATS structure, specific skills);</li>
                  <li>Improve its content without inventing information not present in the original document;</li>
                  <li>Generate a personal, public, shareable web page from the CV;</li>
                  <li>Generate a PDF optimized for Applicant Tracking Systems (ATS);</li>
                  <li>Tailor the CV to a specific job posting provided by the user.</li>
                </ul>
                <p className="mt-2">
                  The service is currently in beta and free of charge. The Provider reserves the
                  right to introduce paid features or credits in the future; in that case these
                  Terms will be updated with specific pricing conditions before any payment feature
                  is activated.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Accounts and Credits</h3>
                <p>
                  Some features (permanently saving your CV, downloading the PDF, tailoring to a job
                  posting) require creating an account with an email and password. Each new account
                  receives one free credit; downloading a PDF and tailoring to a job posting each
                  cost one credit. You are responsible for keeping your login credentials confidential.
                </p>
                <p className="mt-2">
                  You can delete a single CV or your entire account yourself, with immediate and
                  irreversible effect, from your account page.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Nature of AI-Generated Content</h3>
                <p>
                  Content generated or improved by AI (bio, profile page, PDF, tailored CV versions)
                  is produced solely from material you provide: the system is designed not to invent
                  experience, skills, qualifications, or facts absent from your original CV. That
                  said, as with any AI-based tool, the Provider does not guarantee the complete
                  absence of errors or inaccuracies. You are responsible for reviewing the accuracy
                  of generated content before relying on it (e.g. for job applications).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. User Obligations</h3>
                <p>You agree to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Only upload your own CV, or a third party&apos;s CV for which you have their explicit consent.</li>
                  <li>Provide accurate information in the personal details editable from your account.</li>
                  <li>Not use the service for unlawful, fraudulent, or improper purposes.</li>
                  <li>Not attempt to circumvent the service&apos;s anti-abuse measures (e.g. usage limits, bot verification).</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Intellectual Property</h3>
                <p>
                  The website&apos;s source code, design, and templates remain the property of the
                  Provider. CV content you supply, and the profile page generated from it, remain
                  your property; the Provider claims no rights over them beyond what is needed to
                  deliver the requested service.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">6. Limitation of Liability</h3>
                <p>
                  The service is provided &quot;as is&quot;. The Provider is not liable for
                  interruptions caused by third-party providers (hosting, authentication, AI), nor
                  for the outcome of job applications or interviews based on generated content. The
                  Provider&apos;s total liability, where applicable, shall not exceed any amount you
                  paid for the specific service in dispute. The Provider is not liable for indirect
                  damages, data loss, or loss of profit.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">7. Suspension and Termination</h3>
                <p>
                  The Provider may suspend or delete an account in the event of a breach of these
                  Terms, or unlawful or abusive use of the service. You may stop using the service
                  and delete your account at any time, on your own.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">8. Changes to the Service and Terms</h3>
                <p>
                  The Provider reserves the right to modify, suspend, or discontinue features of the
                  service, and to update these Terms, at any time. Material changes will be
                  communicated by publishing them on this page with the revision date.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">9. Governing Law and Jurisdiction</h3>
                <p>
                  These Terms are governed by Italian law. Any dispute shall be subject to the
                  exclusive jurisdiction of the Court of Turin, without prejudice to any mandatory
                  consumer protection provisions.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">10. Contact</h3>
                <p>
                  For any enquiries regarding these Terms, write to{' '}
                  <a href="mailto:massimo.dassano@gmail.com" className="text-primary hover:underline">
                    massimo.dassano@gmail.com
                  </a>
                  .
                </p>
              </div>

              <p>
                For information on personal data processing, see our{' '}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
