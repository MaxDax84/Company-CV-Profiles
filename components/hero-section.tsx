'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import HowItWorksModal from './how-it-works-modal'

export default function HeroSection() {
  const { lang } = useLanguage()
  const t = translations[lang].hero
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-16 md:pb-24">
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Grid */}
        <div className="absolute inset-0 grid-overlay" />

        {/* Orb 1 — indigo, top-right */}
        <div className="hidden md:block absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/12 rounded-full blur-[100px] animate-glow-pulse" />

        {/* Orb 2 — cyan, bottom-left */}
        <div
          className="hidden md:block absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] animate-glow-pulse"
          style={{
            background: 'rgba(8, 145, 178, 0.12)',
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

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-primary/30 bg-primary/8 text-primary text-base sm:text-lg font-semibold mb-10 animate-fade-in"
        >
          <Sparkles className="w-5 h-5" />
          {t.badge}
        </div>

        {/* Title */}
        <h1
          className="font-heading text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-6 animate-fade-in"
          style={{ animationDelay: '0.12s' }}
        >
          <span className="gradient-text">{t.titleGradient}</span>
          <br />
          <span className="text-foreground">{t.titleNormal}</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in"
          style={{ animationDelay: '0.24s' }}
        >
          {t.subtitle}
        </p>

        {/* CTA — the single "start" action on the homepage now (the nav's
            own copy of this button was removed as redundant), so it gets a
            soft pulsing halo behind it to draw the eye instead of relying on
            size alone. */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
          style={{ animationDelay: '0.36s' }}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-2xl bg-primary/50 blur-xl animate-glow-pulse pointer-events-none" />
            <button
              onClick={() => setModalOpen(true)}
              className="relative px-14 py-6 rounded-2xl bg-primary text-primary-foreground font-bold text-lg sm:text-xl hover:bg-primary/90 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              {t.ctaPrimary}
            </button>
          </div>
        </div>

        <HowItWorksModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onProceed={() => router.push('/generate')}
        />

        {/* Concrete trust signals — each explains a "why", not just a label */}
        <div
          className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4 animate-fade-in"
          style={{ animationDelay: '0.48s' }}
        >
          {[
            lang === 'en' ? 'Built from your real CV — never invented' : 'Ottimizzato per ATS e recruiter',
            lang === 'en' ? 'Optimized to pass ATS filters' : 'Si adatta a ogni offerta a cui ti candidi',
            lang === 'en' ? '1 free credit to get started' : 'Anche come pagina web, condivisibile con un click',
          ].map((label) => (
            <div
              key={label}
              className="glass-card rounded-full px-4 py-2 text-xs sm:text-sm text-muted-foreground"
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
