import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | GoOnWeb',
  description: 'Privacy Policy for GoOnWeb — how we handle your personal data.',
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
          ← Back to GoOnWeb
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-12">Last updated: March 2025</p>

        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">

          {/* EN */}
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">English</h2>

            <div>
              <h3 className="font-semibold text-foreground mb-2">1. Data Controller</h3>
              <p>
                The data controller is GoOnWeb, reachable at{' '}
                <a href="mailto:massimo.dassano@gmail.com" className="text-primary hover:underline">
                  massimo.dassano@gmail.com
                </a>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">2. Data Collected</h3>
              <p>
                When you submit the contact form, we collect: your name, email address, the message
                you write, and any file you optionally attach (e.g. a CV in PDF format).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">3. Purpose and Legal Basis</h3>
              <p>
                Your data is used exclusively to respond to your enquiry. The legal basis is your
                explicit consent, given by checking the consent checkbox before submitting the form
                (Art. 6(1)(a) GDPR).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">4. Data Retention</h3>
              <p>
                Your data is retained only for the time necessary to handle your enquiry and is
                not stored in any database. It is received via email and deleted when no longer needed.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">5. Data Sharing</h3>
              <p>
                We do not share your personal data with third parties, except for the email
                infrastructure provider (Gmail/Google) used to receive your message.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">6. Your Rights</h3>
              <p>
                Under GDPR, you have the right to access, correct, delete, or restrict the
                processing of your personal data. You may also withdraw consent at any time.
                To exercise these rights, contact us at{' '}
                <a href="mailto:massimo.dassano@gmail.com" className="text-primary hover:underline">
                  massimo.dassano@gmail.com
                </a>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">7. Cookies</h3>
              <p>
                This website does not use tracking cookies or analytics tools. No cookie
                consent is required.
              </p>
            </div>
          </section>

          <hr className="border-border/40" />

          {/* IT */}
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Italiano</h2>

            <div>
              <h3 className="font-semibold text-foreground mb-2">1. Titolare del Trattamento</h3>
              <p>
                Il titolare del trattamento è GoOnWeb, contattabile all&apos;indirizzo{' '}
                <a href="mailto:massimo.dassano@gmail.com" className="text-primary hover:underline">
                  massimo.dassano@gmail.com
                </a>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">2. Dati Raccolti</h3>
              <p>
                Compilando il modulo di contatto, raccogliamo: nome, indirizzo email, il messaggio
                inserito e l&apos;eventuale file allegato (es. CV in formato PDF).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">3. Finalità e Base Giuridica</h3>
              <p>
                I dati sono utilizzati esclusivamente per rispondere alla tua richiesta. La base
                giuridica è il consenso esplicito dell&apos;interessato, fornito tramite la
                casella di consenso prima dell&apos;invio del modulo (Art. 6(1)(a) GDPR).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">4. Conservazione dei Dati</h3>
              <p>
                I dati sono conservati solo per il tempo necessario a gestire la richiesta e non
                vengono archiviati in alcun database. Vengono ricevuti via email ed eliminati
                quando non più necessari.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">5. Condivisione dei Dati</h3>
              <p>
                Non condividiamo i tuoi dati personali con terze parti, ad eccezione del provider
                di posta elettronica (Gmail/Google) utilizzato per ricevere il messaggio.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">6. I Tuoi Diritti</h3>
              <p>
                Ai sensi del GDPR, hai il diritto di accedere, correggere, cancellare o limitare il
                trattamento dei tuoi dati personali. Puoi anche revocare il consenso in qualsiasi
                momento. Per esercitare questi diritti, contattaci a{' '}
                <a href="mailto:massimo.dassano@gmail.com" className="text-primary hover:underline">
                  massimo.dassano@gmail.com
                </a>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">7. Cookie</h3>
              <p>
                Questo sito non utilizza cookie di tracciamento né strumenti di analisi.
                Non è richiesto alcun consenso ai cookie.
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}
