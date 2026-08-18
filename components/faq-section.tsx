'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from './language-provider'

// Shared between the homepage section and the standalone /faq page linked
// from the account menu. Kept as a plain lang-keyed lookup (not folded into
// lib/i18n.ts's translations object) since each entry is a full { q, a }
// pair rather than a single string — easier to keep the IT/EN lists visibly
// paired item-by-item here than interleaved across two distant blocks.
const FAQ_ITEMS_IT: { q: string; a: string }[] = [
  {
    q: 'Cos\'è Jobli e come funziona?',
    a: 'Carichi il PDF del tuo CV: la nostra AI lo legge, ti dà un punteggio, genera una pagina web professionale del tuo profilo e la migliora automaticamente. Da lì puoi adattarlo a un annuncio specifico o scaricarlo come PDF ottimizzato per gli ATS.',
  },
  {
    q: 'I miei dati e il mio CV sono al sicuro?',
    a: 'Sì. Il PDF che carichi non viene salvato — solo i dati estratti (testo strutturato) restano associati al tuo account, protetti dal login. Email e telefono reali non compaiono mai sulla pagina pubblica: lì restano oscurati.',
  },
  {
    q: 'L\'intelligenza artificiale inventa contenuti nel mio CV?',
    a: 'No, mai. La nostra AI riformula e mette in evidenza quello che hai già scritto — non aggiunge competenze, esperienze o numeri che non hai dichiarato. È una regola fissa in ogni fase: estrazione, ottimizzazione e adattamento a un annuncio.',
  },
  {
    q: 'Cosa sono i crediti e quanto costano?',
    a: 'Ogni account riceve un credito di benvenuto gratuito. Un credito si usa per scaricare un PDF, adattare il CV a un annuncio o generare una lettera di presentazione. Siamo in fase beta: per ora il servizio è gratuito, i costi verranno introdotti più avanti.',
  },
  {
    q: 'Cosa sono i filtri ATS e perché ottimizzare il CV per loro?',
    a: 'Gli ATS (Applicant Tracking System) sono i software che le aziende usano per leggere e filtrare i CV prima che arrivino a un recruiter umano. Un CV con struttura chiara, testo selezionabile e parole chiave pertinenti ha più probabilità di superare questo primo filtro automatico.',
  },
  {
    q: 'Quanto conta il layout di un CV?',
    a: 'Meno di quanto si pensi. Un layout elaborato non ti fa guadagnare punti — ma può farti perdere informazioni: colonne multiple, tabelle, caselle di testo o grafiche possono confondere un ATS al punto da leggere i dati nel campo sbagliato, saltare intere sezioni o mescolare l\'ordine del testo. Per questo i nostri template PDF sono volutamente semplici ed essenziali: colonna singola, struttura lineare, niente elementi grafici che rischiano di essere letti male. A fare davvero la differenza per farti notare è il contenuto: come sono scritte le informazioni, quali parole chiave usi, quanto sono concreti i risultati che racconti — non l\'estetica della pagina.',
  },
  {
    q: 'Posso scaricare il mio CV in PDF?',
    a: 'Sì, puoi scegliere tra 3 template ottimizzati per gli ATS. Il primo download di ogni combinazione CV+template costa 1 credito; puoi poi riscaricarlo quante volte vuoi gratis dalla sezione Download del tuo account.',
  },
  {
    q: 'Posso adattare il mio CV a un annuncio di lavoro specifico?',
    a: 'Sì. Incolli il testo dell\'annuncio e l\'AI riscrive il tuo profilo per allinearlo il più possibile a quella posizione, usando solo competenze ed esperienze che hai davvero dichiarato. Se il CV non è pertinente all\'annuncio te lo segnaliamo prima di procedere. Il CV adattato mantiene la lingua originale del tuo CV, a meno che l\'annuncio non richieda esplicitamente una lingua diversa per la candidatura.',
  },
  {
    q: 'Come cancello il mio account?',
    a: 'Dalla sezione Account trovi "Elimina account permanentemente": profilo, CV adattati e crediti vengono cancellati senza possibilità di recupero.',
  },
  {
    q: 'Come posso contattarvi?',
    a: 'Registrati così nell\'account trovi l\'email di contatto.',
  },
]

const FAQ_ITEMS_EN: { q: string; a: string }[] = [
  {
    q: 'What is Jobli and how does it work?',
    a: 'You upload your CV as a PDF: our AI reads it, gives it a score, generates a professional web page for your profile, and improves it automatically. From there you can tailor it to a specific job posting or download it as an ATS-optimized PDF.',
  },
  {
    q: 'Is my data and my CV safe?',
    a: 'Yes. The PDF you upload isn\'t stored — only the extracted data (structured text) stays linked to your account, protected by login. Your real email and phone number never appear on the public page: they stay obscured there.',
  },
  {
    q: 'Does the AI invent content in my CV?',
    a: 'No, never. Our AI rephrases and highlights what you\'ve already written — it never adds skills, experience, or numbers you haven\'t stated. It\'s a fixed rule at every stage: extraction, optimization, and tailoring to a job posting.',
  },
  {
    q: 'What are credits and how much do they cost?',
    a: 'Every account gets one free welcome credit. A credit is used to download a PDF, tailor your CV to a job posting, or generate a cover letter. We\'re in beta: the service is currently free, pricing will be introduced later.',
  },
  {
    q: 'What are ATS filters and why optimize your CV for them?',
    a: 'ATS (Applicant Tracking Systems) are the software companies use to read and filter CVs before they ever reach a human recruiter. A CV with clear structure, selectable text, and relevant keywords is more likely to pass this first automatic filter.',
  },
  {
    q: 'How much does a CV\'s layout matter?',
    a: 'Less than you\'d think. An elaborate layout doesn\'t earn you points — but it can cost you information: multiple columns, tables, text boxes, or graphics can confuse an ATS badly enough to read data into the wrong field, skip entire sections, or scramble the text order. That\'s why our PDF templates are deliberately simple and essential: single column, linear structure, no graphical elements that risk being misread. What actually makes the difference in getting noticed is the content — how the information is written, which keywords you use, how concrete the results you describe are — not the page\'s aesthetics.',
  },
  {
    q: 'Can I download my CV as a PDF?',
    a: 'Yes, you can choose between 3 ATS-optimized templates. The first download of each CV+template combination costs 1 credit; after that you can re-download it as many times as you want for free from your account\'s Download section.',
  },
  {
    q: 'Can I tailor my CV to a specific job posting?',
    a: 'Yes. Paste in the job posting text and the AI rewrites your profile to align it as closely as possible with that position, using only the skills and experience you\'ve actually stated. If your CV isn\'t a good fit for the posting, we\'ll flag it before proceeding. The tailored CV keeps your CV\'s original language, unless the posting explicitly requires a different language for the application.',
  },
  {
    q: 'How do I delete my account?',
    a: 'In the Account section you\'ll find "Permanently delete account": your profile, tailored CVs, and credits are deleted with no way to recover them.',
  },
  {
    q: 'How can I contact you?',
    a: 'Sign up — you\'ll find our contact email in your account.',
  },
]

function AccordionItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold">{q}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {/* grid-template-rows 0fr->1fr is the standard trick for animating to
          "auto" height smoothly — a plain max-height transition either cuts
          off longer answers or leaves a jump at the end of the animation. */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FaqSection({ compact = false }: { compact?: boolean }) {
  // Only one open at a time — index into FAQ_ITEMS, or null when all closed.
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { lang } = useLanguage()
  const items = lang === 'en' ? FAQ_ITEMS_EN : FAQ_ITEMS_IT

  return (
    <section id="faq" className={compact ? '' : 'relative py-16 md:py-20 overflow-hidden'}>
      {!compact && <div className="absolute inset-0 grid-overlay" />}
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {!compact && (
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-2">
              {lang === 'en' ? 'Frequently Asked Questions' : 'Domande frequenti'}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              {lang === 'en' ? 'Everything you need to know before you start.' : 'Tutto quello che c\'è da sapere prima di iniziare.'}
            </p>
          </div>
        )}
        <div className="space-y-3">
          {items.map((item, i) => (
            <AccordionItem
              key={item.q}
              q={item.q}
              a={item.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
