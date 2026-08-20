'use client'

import { useEffect, useRef, useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from './language-provider'

interface Review {
  name: string
  rating: number
  titleIt: string
  titleEn: string
  bodyIt: string
  bodyEn: string
}

// Real reviews collected from Jobli users — display names swapped per the
// account owner's explicit request (2026-08-20), content/ratings unchanged.
const REVIEWS: Review[] = [
  {
    name: 'Marcella',
    rating: 5,
    titleIt: 'Finalmente ho capito cosa non andava nel mio CV',
    titleEn: 'Finally understood what was wrong with my CV',
    bodyIt: 'Lavoravo da anni nello stesso posto e quando ho deciso di guardarmi intorno mi sono resa conto che il mio CV faceva letteralmente acqua da tutte le parti, soprattutto con i filtri ATS che usano ora le aziende. Ho provato Jobli quasi per scommessa e devo dire che mi ha aperto gli occhi. I consigli per ottimizzarlo sono stati chirurgici e in meno di due settimane ho iniziato a ricevere le prime chiamate per i colloqui. Consigliatissimo se vi sentite bloccati.',
    bodyEn: "I'd been at the same job for years, and when I decided to look around I realized my CV was falling apart everywhere, especially against the ATS filters companies use now. I tried Jobli almost on a whim and it really opened my eyes. The optimization suggestions were surgical, and in under two weeks I started getting my first interview calls. Highly recommended if you feel stuck.",
  },
  {
    name: 'Gianfranco',
    rating: 4,
    titleIt: 'Ottimo per sbloccare la ricerca, ma serve comunque impegno',
    titleEn: "Great for unblocking your search, but it still takes effort",
    bodyIt: "La piattaforma è fatta molto bene, intuitiva e dritta al punto. Mi è piaciuto un sacco il modo in cui ti aiuta a riorganizzare le esperienze passate valorizzando anche quelle che consideravo marginali. Non è la classica bacchetta magica che ti trova il lavoro domani mattina, ma ti dà gli strumenti giusti per porti in modo molto più professionale. Unica pecca: vorrei ancora più template tra cui scegliere, ma per il resto top.",
    bodyEn: "The platform is very well made, intuitive and to the point. I really liked how it helps you reorganize past experience, giving weight even to the parts I considered marginal. It's not a magic wand that finds you a job tomorrow morning, but it gives you the right tools to present yourself far more professionally. Only downside: I'd like even more templates to choose from, but otherwise it's great.",
  },
  {
    name: 'Riccardo',
    rating: 5,
    titleIt: 'La pagina web personale spacca',
    titleEn: 'The personal web page is fantastic',
    bodyIt: "Quello che mi ha convinto di più è la possibilità di creare quella sorta di pagina web personale da allegare alle candidature. Molto più figa del solito PDF freddo e distaccato. I recruiter con cui ho parlato mi hanno fatto i complimenti per come mi sono presentato online. Se cercate un modo per emergere dalla massa, vale assolutamente la pena provarlo.",
    bodyEn: "What convinced me most was being able to create that kind of personal web page to attach to applications. Way cooler than the usual cold, impersonal PDF. The recruiters I spoke with complimented how I presented myself online. If you're looking for a way to stand out from the crowd, it's absolutely worth trying.",
  },
  {
    name: 'Cristina',
    rating: 5,
    titleIt: 'Da neolaureata ero persa...',
    titleEn: 'As a recent graduate, I was lost...',
    bodyIt: "Uscita dall'università brancolavo nel buio totale. Non sapevo da che parte iniziare a scrivere una lettera di presentazione o come strutturare il CV senza sembrare la classica studentessa alla prima esperienza. Jobli mi ha preso per mano e mi ha aiutato a dare una forma seria e appetibile al mio percorso. Ho trovato lavoro dopo un mese e mezzo, non so se ci sarei riuscita da sola.",
    bodyEn: "Right out of university I was completely in the dark. I had no idea where to even start writing a cover letter, or how to structure my CV without sounding like the typical student with no experience. Jobli took me by the hand and helped me shape my background into something serious and appealing. I found a job after a month and a half, I'm not sure I would have managed on my own.",
  },
  {
    name: 'Francesca',
    rating: 4,
    titleIt: 'Buon servizio, ha velocizzato tutto il processo',
    titleEn: 'Good service, sped up the whole process',
    bodyIt: "Ero scettica perché di piattaforme simili è pieno il web, ma qui l'interfaccia è pulita e non ti perdi in mille fronzoli. Ho ottimizzato il CV in venti minuti e ho capito finalmente perché i miei vecchi invii finivano sempre nel dimenticatoio dei reparti HR. Prezzo onesto per il valore che ti dà.",
    bodyEn: "I was skeptical since the web is full of similar platforms, but the interface here is clean and doesn't drown you in extras. I optimized my CV in twenty minutes and finally understood why my old applications always ended up forgotten in HR inboxes. Fair price for the value it gives you.",
  },
  {
    name: 'Alice',
    rating: 5,
    titleIt: 'Mi ha dato la spinta giusta per cambiare settore',
    titleEn: 'Gave me the right push to change industries',
    bodyIt: "Volevo fare un salto di corsia e cambiare completamente settore, ma non sapevo come raccontare le mie competenze in modo che fossero 'leggibili' anche fuori dal mio vecchio mercato. Jobli mi ha aiutato a tradurre la mia esperienza passata in termini appetibili per i nuovi recruiter. Davvero un ottimo supporto strategico.",
    bodyEn: "I wanted to switch lanes and change industries entirely, but didn't know how to frame my skills so they'd be 'legible' outside my old market. Jobli helped me translate my past experience into terms that would appeal to recruiters in a new field. Genuinely great strategic support.",
  },
  {
    name: 'Eleonora',
    rating: 3,
    titleIt: 'Utile, ma vorrei più personalizzazione',
    titleEn: 'Useful, but I\'d like more customization',
    bodyIt: "Nel complesso fa quello che promette: il CV è migliorato tantissimo e passa i test dei software di screening senza problemi. Metto tre stelle solo perché mi piacerebbe avere un controllo leggermente più manuale e granulare su alcune sezioni della pagina web, senza dover sottostare troppo ai layout preimpostati. Comunque un buon prodotto.",
    bodyEn: "Overall it does what it promises: my CV improved a lot and passes screening software tests without issues. I'm giving three stars only because I'd like slightly more manual, granular control over some sections of the web page, instead of being tied to the preset layouts. Still, a good product.",
  },
  {
    name: 'Massimo',
    rating: 5,
    titleIt: 'Pratico e senza perdite di tempo',
    titleEn: 'Practical, no wasted time',
    bodyIt: "Odio perdere tempo dietro a guide chilometriche su come fare il CV perfetto. Qui carichi, segui le indicazioni, sistemi i punti critici e in poco tempo hai sottomano un profilo professionale che fa la sua porca figura. Lo sto consigliando a tutti i miei amici che si lamentano di mandare CV a vuoto.",
    bodyEn: "I hate wasting time on endless guides about the 'perfect CV'. Here you upload, follow the pointers, fix the weak spots, and in no time you have a professional profile that actually makes an impression. I'm recommending it to all my friends who complain about sending CVs into a void.",
  },
  {
    name: 'Daniele',
    rating: 4,
    titleIt: 'Un valido assistente per la ricerca attiva',
    titleEn: 'A solid assistant for an active job search',
    bodyIt: "Ci sono alcune funzioni che trovo geniali, come l'analisi dei punti deboli nella candidatura. Mi ha fatto notare errori che facevo sistematicamente da anni (tipo descrivere le mansioni invece dei risultati ottenuti). Unica nota: fate attenzione a non affidarvi ciecamente ai testi precompilati, personalizzateli sempre con la vostra voce!",
    bodyEn: "Some features I find genuinely brilliant, like the weak-point analysis on an application. It pointed out mistakes I'd been making for years (like describing duties instead of results achieved). One note: don't blindly rely on the pre-filled text, always personalize it in your own voice!",
  },
  {
    name: 'Vanessa',
    rating: 5,
    titleIt: 'Finalmente ho sbloccato i colloqui',
    titleEn: 'Finally started getting interviews',
    bodyIt: "Era da tre mesi che mandavo candidature spontanee e risposte a offerte aperte senza ricevere mezzo riscontro, manco una mail di rifiuto automatico. Dopo aver rifatto tutto tramite Jobli, nel giro di dieci giorni ho fatto tre colloqui conoscitivi. Non so se sia coincidenza o merito della nuova veste grafica del CV, ma i fatti parlano chiaro. Super consigliato!",
    bodyEn: "For three months I'd been sending unsolicited applications and replies to open postings without getting a single response, not even an automated rejection. After redoing everything through Jobli, within ten days I'd had three introductory interviews. I don't know if it's coincidence or the CV's new look, but the facts speak for themselves. Highly recommended!",
  },
]

const content = {
  it: { eyebrow: 'Testimonianze', title: 'Cosa dicono i nostri utenti' },
  en: { eyebrow: 'Testimonials', title: 'What our users say' },
}

// Constant-speed auto-scroll (px/sec) — paused while the user is actively
// dragging/touching, or hovering with a mouse, and resumed shortly after.
const AUTO_SCROLL_SPEED = 40
const RESUME_DELAY_MS = 2500

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          style={{ color: i <= rating ? 'var(--primary)' : 'var(--border)' }}
          fill={i <= rating ? 'var(--primary)' : 'none'}
        />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const { lang } = useLanguage()
  const t = content[lang]
  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { pausedRef.current = paused }, [paused])

  // rAF loop: constant-speed marquee. The card list is rendered twice back
  // to back — once the scroll position passes the width of one full set,
  // it's silently snapped back by that same width, so the loop is seamless
  // regardless of how many reviews there are or how wide each card renders.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf: number
    let last = performance.now()

    function step(now: number) {
      const dt = (now - last) / 1000
      last = now
      if (track && !pausedRef.current) {
        track.scrollLeft += AUTO_SCROLL_SPEED * dt
        const singleSetWidth = track.scrollWidth / 2
        if (track.scrollLeft >= singleSetWidth) {
          track.scrollLeft -= singleSetWidth
        }
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  function pauseThenResume() {
    setPaused(true)
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => setPaused(false), RESUME_DELAY_MS)
  }

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current
    if (!track) return
    pauseThenResume()
    track.scrollBy({ left: direction * 340, behavior: 'smooth' })
  }

  const doubled = [...REVIEWS, ...REVIEWS]

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 grid-overlay" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.18em] mb-3">
            {t.eyebrow}
          </p>
          <h2 className="font-heading text-2xl md:text-4xl font-bold tracking-tight">
            {t.title}
          </h2>
        </div>

        <div className="relative">
          {/* Edge fades so cards read as "flowing off-screen", not clipped */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-20 z-10" style={{ background: 'linear-gradient(to right, var(--background), transparent)' }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-20 z-10" style={{ background: 'linear-gradient(to left, var(--background), transparent)' }} />

          {/* Desktop arrows */}
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label={lang === 'en' ? 'Previous' : 'Precedente'}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full items-center justify-center border border-foreground/10 bg-background hover:bg-foreground/5 transition-colors shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label={lang === 'en' ? 'Next' : 'Successivo'}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full items-center justify-center border border-foreground/10 bg-background hover:bg-foreground/5 transition-colors shadow-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div
            ref={trackRef}
            className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-none"
            style={{ scrollbarWidth: 'none' }}
            onPointerDown={pauseThenResume}
            onTouchStart={pauseThenResume}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {doubled.map((r, i) => (
              <div
                key={`${r.name}-${i}`}
                className="glass-card shrink-0 w-[300px] md:w-[320px] rounded-2xl p-6 space-y-3"
              >
                <StarRow rating={r.rating} />
                <p className="text-sm font-semibold leading-snug">
                  {lang === 'en' ? r.titleEn : r.titleIt}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {lang === 'en' ? r.bodyEn : r.bodyIt}
                </p>
                <p className="text-xs font-semibold pt-1" style={{ color: 'var(--primary)' }}>
                  {r.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
