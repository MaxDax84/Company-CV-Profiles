'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from './language-provider'

// Distinct from the general marketing FAQ (components/faq-section.tsx,
// "what is Jobli / how does it work") — this one is specifically for
// technical, security, and account/data-deletion questions, for the
// dedicated /support page.
const SUPPORT_FAQ_IT: { q: string; a: string }[] = [
  {
    q: 'Dove vengono conservati i miei dati?',
    a: 'Su Supabase, un\'infrastruttura cloud con database Postgres. I dati sono cifrati sia a riposo sia in transito (HTTPS), e l\'accesso è tecnicamente limitato ai soli dati di tua proprietà tramite regole a livello di database (Row Level Security), non solo controlli lato applicazione.',
  },
  {
    q: 'Come elimino il mio account e tutti i miei dati?',
    a: 'Dalla sezione Account, in fondo trovi "Elimina account permanentemente" (zona pericolosa): ti verrà chiesto di digitare una parola di conferma. L\'operazione è immediata e irreversibile: profilo, tutti i CV (anche quelli adattati o tradotti), lettere di presentazione e crediti vengono cancellati senza possibilità di recupero.',
  },
  {
    q: 'Posso eliminare un singolo CV senza cancellare tutto l\'account?',
    a: 'Sì. Ogni CV (sia quello caricato originariamente, sia le versioni adattate a un annuncio) ha un proprio pulsante "Elimina" nella relativa sezione dell\'account: elimina solo quel documento, l\'account e gli altri CV restano intatti.',
  },
  {
    q: 'I miei dati vengono condivisi con l\'intelligenza artificiale di terze parti?',
    a: 'Il testo del tuo CV viene inviato al nostro fornitore di intelligenza artificiale (Anthropic) esclusivamente per l\'estrazione, l\'ottimizzazione e l\'adattamento del profilo che richiedi tu stesso. Non viene mai usato per addestrare modelli, né ceduto a terzi per scopi di marketing.',
  },
  {
    q: 'Usate cookie di tracciamento?',
    a: 'Solo previo tuo consenso esplicito, dato dal banner cookie o dal link "Preferenze Cookie" in fondo al sito. Senza il tuo consenso restano attivi solo i cookie strettamente necessari (accesso all\'account, sicurezza anti-bot). Puoi cambiare idea in qualsiasi momento.',
  },
  {
    q: 'Come funziona la verifica anti-bot durante il caricamento del CV?',
    a: 'Usiamo Cloudflare Turnstile, pensato per distinguere un utente reale da un bot senza tracciarti o profilarti: serve solo a prevenire abusi automatizzati del servizio.',
  },
  {
    q: 'Se carico un CV senza registrarmi, cosa succede ai miei dati?',
    a: 'L\'anteprima generata viene conservata per un massimo di 1 ora: se in quel lasso di tempo non crei un account, viene eliminata automaticamente e in modo definitivo.',
  },
  {
    q: 'Chi può vedere la mia email e il mio numero di telefono reali?',
    a: 'Solo tu. I contatti reali servono esclusivamente per il PDF che scarichi privatamente; sulla pagina web pubblica generata dal servizio compaiono sempre in forma oscurata, per limitare la raccolta automatizzata da parte di terzi.',
  },
  {
    q: 'Posso richiedere una copia o l\'esportazione dei miei dati?',
    a: 'Sì, è un tuo diritto ai sensi del GDPR (artt. 15 e 20). Scrivici dal modulo qui sotto o via email e te la prepariamo.',
  },
  {
    q: 'Ho trovato un problema di sicurezza, come vi contatto?',
    a: 'Scrivici subito tramite il modulo qui sotto descrivendo il problema nel dettaglio: lo trattiamo con priorità.',
  },
]

const SUPPORT_FAQ_EN: { q: string; a: string }[] = [
  {
    q: 'Where is my data stored?',
    a: 'On Supabase, a cloud infrastructure with a Postgres database. Data is encrypted both at rest and in transit (HTTPS), and access is technically restricted to only the data you own via database-level rules (Row Level Security), not just application-side checks.',
  },
  {
    q: 'How do I delete my account and all my data?',
    a: 'In the Account section, at the bottom you\'ll find "Permanently delete account" (danger zone): you\'ll be asked to type a confirmation word. This is immediate and irreversible: your profile, every CV (including tailored or translated versions), cover letters, and credits are erased with no way to recover them.',
  },
  {
    q: 'Can I delete a single CV without deleting my whole account?',
    a: 'Yes. Every CV (both the one you originally uploaded and any versions tailored to a job posting) has its own "Delete" button in the relevant account section: it removes only that document, your account and other CVs stay intact.',
  },
  {
    q: 'Is my data shared with third-party AI?',
    a: 'Your CV text is sent to our AI provider (Anthropic) solely to extract, optimize, and tailor the profile you yourself request. It is never used to train models, and never handed to third parties for marketing purposes.',
  },
  {
    q: 'Do you use tracking cookies?',
    a: 'Only with your explicit consent, given via the cookie banner or the "Cookie preferences" link at the bottom of the site. Without your consent, only strictly necessary cookies stay active (account login, anti-bot security). You can change your mind at any time.',
  },
  {
    q: 'How does the anti-bot check during CV upload work?',
    a: 'We use Cloudflare Turnstile, designed to distinguish a real user from a bot without tracking or profiling you: it exists purely to prevent automated abuse of the service.',
  },
  {
    q: 'If I upload a CV without signing up, what happens to my data?',
    a: 'The generated preview is kept for a maximum of 1 hour: if you don\'t create an account within that window, it\'s automatically and permanently deleted.',
  },
  {
    q: 'Who can see my real email and phone number?',
    a: 'Only you. Your real contact details are used solely for the PDF you download privately; on the public web page generated by the service they always appear redacted, to limit automated scraping by third parties.',
  },
  {
    q: 'Can I request a copy or export of my data?',
    a: 'Yes, it\'s your right under the GDPR (Arts. 15 and 20). Write to us using the form below or by email and we\'ll prepare it for you.',
  },
  {
    q: 'I found a security issue, how do I report it?',
    a: 'Write to us right away using the form below, describing the issue in detail: we treat these with priority.',
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

export default function SupportFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { lang } = useLanguage()
  const items = lang === 'en' ? SUPPORT_FAQ_EN : SUPPORT_FAQ_IT

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <AccordionItem
          key={item.q}
          q={item.q}
          a={item.a}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  )
}
