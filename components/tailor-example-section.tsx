'use client'

import { useEffect, useRef, useState } from 'react'
import { Briefcase, Sparkles, ArrowRight } from 'lucide-react'
import { useLanguage } from './language-provider'
import { cn } from '@/lib/utils'

// Illustrative only — invented job posting + CV bullet, not a live demo (no
// Claude call). The goal is purely to make "adattamento" concrete at a
// glance: the same handful of concepts (bold/marked below) appear in both
// texts, showing how the tailored CV picks up the job posting's own
// language instead of just listing generic skills.
const CONTENT = {
  it: {
    label: 'Esempio',
    title: 'Come funziona l\'adattamento',
    subtitle: 'Lo stesso CV, riscritto per rispecchiare esattamente ciò che l\'annuncio richiede — senza inventare nulla che non ci sia già.',
    jobLabel: 'Annuncio di lavoro',
    jobRole: 'Sales Account Manager — Enterprise',
    job: [
      'Cerchiamo un ',
      { mark: 'Sales Account Manager' },
      ' con esperienza nella gestione del ',
      { mark: 'ciclo di vendita B2B' },
      ' su clienti ',
      { mark: 'enterprise' },
      ', e un track record dimostrabile nel ',
      { mark: 'superamento degli obiettivi di fatturato trimestrali' },
      '. Richiesta familiarità con ',
      { mark: 'Salesforce' },
      ' per la reportistica della ',
      { mark: 'pipeline' },
      '.',
    ],
    cvLabel: 'CV adattato da Jobli',
    cvRole: 'Account Executive',
    cv: [
      'Gestito l\'intero ',
      { mark: 'ciclo di vendita B2B' },
      ' per clienti ',
      { mark: 'enterprise' },
      ', ',
      { mark: 'superando gli obiettivi di fatturato trimestrali' },
      ' del 18% in media. Utilizzato ',
      { mark: 'Salesforce' },
      ' per la reportistica della ',
      { mark: 'pipeline' },
      ' e il coordinamento del team commerciale.',
    ],
  },
  en: {
    label: 'Example',
    title: 'How tailoring works',
    subtitle: 'The same CV, rewritten to genuinely mirror what the job posting asks for — without inventing anything that wasn\'t already there.',
    jobLabel: 'Job posting',
    jobRole: 'Sales Account Manager — Enterprise',
    job: [
      'We\'re looking for a ',
      { mark: 'Sales Account Manager' },
      ' with experience managing the ',
      { mark: 'full B2B sales cycle' },
      ' for ',
      { mark: 'enterprise' },
      ' clients, and a proven track record of ',
      { mark: 'exceeding quarterly revenue targets' },
      '. Familiarity with ',
      { mark: 'Salesforce' },
      ' for ',
      { mark: 'pipeline' },
      ' reporting required.',
    ],
    cvLabel: 'CV tailored by Jobli',
    cvRole: 'Account Executive',
    cv: [
      'Managed the full ',
      { mark: 'B2B sales cycle' },
      ' for ',
      { mark: 'enterprise' },
      ' clients, ',
      { mark: 'exceeding quarterly revenue targets' },
      ' by an average of 18%. Used ',
      { mark: 'Salesforce' },
      ' for ',
      { mark: 'pipeline' },
      ' reporting and sales team coordination.',
    ],
  },
} as const

type Chunk = string | { mark: string }

function RichText({ chunks }: { chunks: readonly Chunk[] }) {
  return (
    <>
      {chunks.map((chunk, i) =>
        typeof chunk === 'string' ? (
          <span key={i}>{chunk}</span>
        ) : (
          <span
            key={i}
            className="font-semibold rounded px-1 py-0.5"
            style={{ background: 'color-mix(in srgb, var(--primary) 16%, transparent)', color: 'var(--primary)' }}
          >
            {chunk.mark}
          </span>
        )
      )}
    </>
  )
}

export default function TailorExampleSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const { lang } = useLanguage()
  const t = CONTENT[lang === 'en' ? 'en' : 'it']

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0, rootMargin: '200px 0px 200px 0px' },
    )
    observer.observe(el)
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) setVisible(true)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 grid-overlay" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div
          className={cn(
            'text-center mb-14 transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.18em] mb-4">{t.label}</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-5">{t.title}</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-stretch">
          {/* Job posting */}
          <div
            className={cn(
              'rounded-2xl glass-card p-7 space-y-4 transition-all duration-700',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
            )}
            style={{ transitionDelay: '150ms' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-foreground/[0.06] flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t.jobLabel}</p>
                <p className="text-sm font-semibold">{t.jobRole}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <RichText chunks={t.job} />
            </p>
          </div>

          {/* Arrow connector */}
          <div
            className={cn(
              'hidden md:flex items-center justify-center transition-all duration-700',
              visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
            )}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Tailored CV */}
          <div
            className={cn(
              'rounded-2xl p-7 space-y-4 border transition-all duration-700',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
            )}
            style={{
              transitionDelay: '400ms',
              borderColor: 'color-mix(in srgb, var(--primary) 35%, transparent)',
              background: 'color-mix(in srgb, var(--primary) 5%, transparent)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>{t.cvLabel}</p>
                <p className="text-sm font-semibold">{t.cvRole}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              <RichText chunks={t.cv} />
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
