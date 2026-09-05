'use client'

import { useRouter } from 'next/navigation'
import { Shield, Target, Link as LinkIcon, Gift } from 'lucide-react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import CvScoreCard from './cv-score-card'

// Fabricated for this marketing preview only — never derived from a real
// uploaded CV. Deliberately mid-low (61/100, not a flattering 85+): a high
// example score reads as "mine would already be fine", a mid one reads as
// "I want to know mine" — the reaction that actually drives someone to try
// the real analysis on their own CV.
const EXAMPLE_SCORE = {
  quantifiedResults: 13,
  clarity: 16,
  atsStructure: 20,
  specificSkills: 12,
  total: 61,
}

export default function HeroSection() {
  const { lang } = useLanguage()
  const t = translations[lang].hero
  const scoreLabels = translations[lang].generate.cvScore
  const router = useRouter()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-16 md:pb-24">
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Grid */}
        <div className="absolute inset-0 grid-overlay" />

        {/* Orb 1 — Electric Blue, top-right */}
        <div className="hidden md:block absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/12 rounded-full blur-[100px] animate-glow-pulse" />

        {/* Orb 2 — Lime Green, bottom-left */}
        <div
          className="hidden md:block absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] animate-glow-pulse"
          style={{
            background: 'rgba(199, 243, 107, 0.35)',
            animationDelay: '2.5s',
          }}
        />

        {/* Subtle radial vignette — var(--background) so it blends into
            whichever theme is active instead of always fading to white */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, var(--background) 100%)' }}
        />
      </div>

      {/* Content — single stacked column on mobile (text, then the score
          preview below it); side by side from lg up (text+CTA left, score
          preview right, same row) via the 2-column grid below. Grid order
          follows DOM order, so no separate mobile/desktop reordering is
          needed — the score card simply comes after the text block. */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text column */}
          <div className="text-center lg:text-left">
            {/* Title */}
            <h1
              className="font-heading text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-4 md:mb-6 animate-fade-in"
              style={{ animationDelay: '0.12s' }}
            >
              <span className="gradient-text">{t.titleGradient}</span>
              <br />
              <span className="text-foreground">{t.titleNormal}</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto lg:mx-0 mb-8 md:mb-12 leading-relaxed animate-fade-in"
              style={{ animationDelay: '0.24s' }}
            >
              {t.subtitle}
            </p>

            {/* CTA — the single "start" action on the homepage now (the nav's
                own copy of this button was removed as redundant), so it gets a
                soft pulsing halo behind it to draw the eye instead of relying on
                size alone. */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in"
              style={{ animationDelay: '0.36s' }}
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-2xl bg-accent-cyan/60 blur-xl animate-glow-pulse pointer-events-none" />
                <button
                  onClick={() => router.push('/start')}
                  className="relative px-14 py-6 rounded-2xl bg-accent-cyan text-accent-cyan-foreground font-bold text-lg sm:text-xl hover:bg-accent-cyan/90 transition-all duration-200 hover:shadow-xl hover:shadow-accent-cyan/40 hover:-translate-y-0.5"
                >
                  {t.ctaPrimary}
                </button>
              </div>
            </div>

            {/* Concrete trust signals — each explains a "why", not just a label */}
            <div
              className="mt-6 md:mt-10 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 animate-fade-in"
              style={{ animationDelay: '0.48s' }}
            >
              {[
                { icon: Gift, label: lang === 'en' ? 'Free during beta — no card required' : 'Gratis in fase beta, nessuna carta richiesta' },
                { icon: Shield, label: lang === 'en' ? 'Built from your real CV — never invented' : 'Zero invenzioni, solo la tua vera storia' },
                { icon: Target, label: lang === 'en' ? 'Optimized to pass ATS filters' : 'Progettato per superare i filtri ATS' },
                { icon: LinkIcon, label: lang === 'en' ? 'Includes a personal web page' : 'Pagina web personale inclusa' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="glass-card rounded-full pl-3 pr-4 py-2 flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground"
                >
                  <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Score preview — the real result-screen component (not a mockup
              image), fed an illustrative score so it's pixel-identical to
              what a real analysis looks like. */}
          <div
            className="w-full max-w-sm mx-auto lg:mx-0 lg:max-w-none animate-fade-in"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="relative rounded-2xl shadow-2xl shadow-black/10">
              <span
                className="absolute -top-2.5 -right-2.5 z-10 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide shadow-md"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                {lang === 'en' ? 'Example' : 'Esempio'}
              </span>
              <CvScoreCard
                before={null}
                after={EXAMPLE_SCORE}
                accentColor="var(--primary)"
                labels={scoreLabels}
                variant="teaser"
              />
            </div>
            <p className="text-center lg:text-left text-[11px] text-muted-foreground/50 mt-2">
              {lang === 'en' ? 'Example result from a sample CV.' : 'Risultato di esempio da un CV campione.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
