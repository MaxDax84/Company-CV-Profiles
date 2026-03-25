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

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {lang === 'it' ? 'Termini di Servizio' : 'Terms of Service'}
        </h1>
        <p className="text-muted-foreground text-sm mb-12">
          {lang === 'it' ? 'Ultimo aggiornamento: Marzo 2025' : 'Last updated: March 2025'}
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
          {lang === 'it' ? (
            <>
              <p>
                I presenti Termini di Servizio regolano il rapporto contrattuale tra{' '}
                <strong className="text-foreground">BeOnWeb</strong>, gestito da Massimo Dassano
                (di seguito &quot;Fornitore&quot;), e il cliente che acquista o utilizza i servizi
                offerti tramite il sito <strong className="text-foreground">beonweb.it</strong>.
              </p>

              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Oggetto del Servizio</h3>
                <p>
                  BeOnWeb offre i seguenti servizi:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong className="text-foreground">Sito web professionale</strong> — progettazione
                    e sviluppo di siti web personalizzati su dominio del cliente, secondo il piano
                    acquistato (Starter, Complete).
                  </li>
                  <li>
                    <strong className="text-foreground">Generatore di profili CV</strong> — strumento
                    gratuito che consente di caricare un CV in formato PDF e ottenere una pagina
                    profilo pubblica su link condivisibile, senza dominio personale.
                  </li>
                  <li>
                    <strong className="text-foreground">Manutenzione mensile</strong> — servizio
                    opzionale di aggiornamento e assistenza tecnica continuativa sul sito realizzato.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Prezzi e Pagamento</h3>
                <p>
                  I prezzi dei servizi sono quelli indicati nella sezione Prezzi del sito al momento
                  dell&apos;ordine. Tutti i prezzi si intendono IVA inclusa ove applicabile.
                  Il pagamento avviene secondo le modalità concordate al momento della conferma
                  dell&apos;ordine. Il Fornitore si riserva il diritto di modificare i prezzi in
                  qualsiasi momento; le modifiche non si applicano agli ordini già confermati.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Tempi di Consegna</h3>
                <p>
                  I tempi di consegna sono indicativi e comunicati al cliente in fase di avvio del
                  progetto. Il Fornitore si impegna a rispettare le scadenze concordate, salvo cause
                  di forza maggiore o ritardi imputabili al cliente (es. mancato invio di materiali,
                  testi o immagini).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Obblighi del Cliente</h3>
                <p>Il cliente si impegna a:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Fornire in modo tempestivo i materiali necessari alla realizzazione del progetto.</li>
                  <li>Garantire di possedere tutti i diritti sui contenuti forniti (testi, immagini, loghi).</li>
                  <li>Non utilizzare i servizi per scopi illeciti o contrari all&apos;ordine pubblico.</li>
                  <li>Non caricare sul generatore di profili CV dati sensibili di terzi senza il loro consenso.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Proprietà Intellettuale</h3>
                <p>
                  Il codice sorgente, i template e i componenti sviluppati da BeOnWeb rimangono di
                  proprietà del Fornitore. Al cliente viene concessa una licenza d&apos;uso non
                  esclusiva e non trasferibile sul sito realizzato per il suo progetto specifico.
                  I contenuti forniti dal cliente (testi, immagini, marchi) restano di proprietà
                  del cliente.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">6. Limitazione di Responsabilità</h3>
                <p>
                  Il Fornitore non è responsabile per interruzioni del servizio causate da terzi
                  (provider di hosting, registrar di domini, fornitori di API). La responsabilità
                  complessiva del Fornitore nei confronti del cliente non potrà in alcun caso superare
                  l&apos;importo pagato per il servizio specifico oggetto della contestazione.
                  Il Fornitore non è responsabile per danni indiretti, perdita di dati o mancato
                  guadagno.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">7. Diritto di Recesso</h3>
                <p>
                  Per i clienti consumatori (persone fisiche che acquistano al di fuori di attività
                  professionale), si applica il diritto di recesso di 14 giorni ai sensi del D.Lgs.
                  206/2005 (Codice del Consumo), a partire dalla data di conclusione del contratto.
                  Il diritto di recesso non si applica qualora la prestazione sia già stata
                  completata con il consenso espresso del consumatore prima della scadenza del
                  periodo di recesso.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">8. Durata e Risoluzione</h3>
                <p>
                  I servizi una tantum (es. realizzazione sito) si concludono con la consegna del
                  prodotto finito. Il servizio di manutenzione mensile ha durata mensile con rinnovo
                  automatico, salvo disdetta comunicata con almeno 15 giorni di anticipo. Il
                  Fornitore può sospendere o risolvere il contratto in caso di inadempimento del
                  cliente o utilizzo illecito del servizio.
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
                These Terms of Service govern the contractual relationship between{' '}
                <strong className="text-foreground">BeOnWeb</strong>, operated by Massimo Dassano
                (the &quot;Provider&quot;), and any customer who purchases or uses the services
                offered through <strong className="text-foreground">beonweb.it</strong>.
              </p>

              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Services</h3>
                <p>BeOnWeb offers the following services:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong className="text-foreground">Professional website</strong> — design and
                    development of a custom website on the client&apos;s domain, according to the
                    purchased plan (Starter, Complete).
                  </li>
                  <li>
                    <strong className="text-foreground">CV profile generator</strong> — a free tool
                    that lets you upload a PDF CV and obtain a public profile page on a shareable
                    link, without a personal domain.
                  </li>
                  <li>
                    <strong className="text-foreground">Monthly maintenance</strong> — an optional
                    ongoing support and update service for the website delivered.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Pricing and Payment</h3>
                <p>
                  Prices are those listed in the Pricing section of the website at the time of
                  order. All prices are inclusive of VAT where applicable. Payment terms are agreed
                  at the time of order confirmation. The Provider reserves the right to change
                  prices at any time; changes do not apply to already confirmed orders.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Delivery</h3>
                <p>
                  Delivery timelines are indicative and communicated to the client at project kick-off.
                  The Provider will make reasonable efforts to meet agreed deadlines, except in cases
                  of force majeure or delays attributable to the client (e.g. failure to supply
                  content, text, or images).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Client Obligations</h3>
                <p>The client agrees to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Provide materials required for the project in a timely manner.</li>
                  <li>Ensure they hold all rights to the content supplied (text, images, logos).</li>
                  <li>Not use the services for unlawful or fraudulent purposes.</li>
                  <li>Not upload third-party personal data to the CV generator without their consent.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Intellectual Property</h3>
                <p>
                  Source code, templates, and components developed by BeOnWeb remain the property
                  of the Provider. The client is granted a non-exclusive, non-transferable licence
                  to use the website delivered for their specific project. Content supplied by the
                  client (text, images, trademarks) remains the property of the client.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">6. Limitation of Liability</h3>
                <p>
                  The Provider is not liable for service interruptions caused by third parties
                  (hosting providers, domain registrars, API suppliers). The Provider&apos;s total
                  liability to the client shall not exceed the amount paid for the specific service
                  in dispute. The Provider is not liable for indirect damages, data loss, or loss
                  of profit.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">7. Right of Withdrawal</h3>
                <p>
                  Consumers (natural persons acting outside their professional capacity) have the
                  right to withdraw from the contract within 14 days of its conclusion, in
                  accordance with Italian Consumer Code (D.Lgs. 206/2005). The right of withdrawal
                  does not apply where the service has already been fully performed with the
                  consumer&apos;s express consent before the withdrawal period expires.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">8. Duration and Termination</h3>
                <p>
                  One-off services (e.g. website build) conclude upon delivery of the finished
                  product. The monthly maintenance service renews automatically each month unless
                  cancelled with at least 15 days&apos; notice. The Provider may suspend or
                  terminate the contract in the event of client default or unlawful use of the
                  service.
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
