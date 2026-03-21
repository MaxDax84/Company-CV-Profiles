'use client'

import { ChevronDown, Sparkles } from 'lucide-react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'

export default function HeroSection() {
  const { lang } = useLanguage()
  const t = translations[lang].hero

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Grid */}
        <div className="absolute inset-0 grid-overlay" />

        {/* Orb 1 — electric blue, top-right */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-glow-pulse" />

        {/* Orb 2 — purple, bottom-left */}
        <div
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] animate-glow-pulse"
          style={{
            background: 'oklch(0.72 0.18 280 / 0.08)',
            animationDelay: '2.5s',
          }}
        />

        {/* Subtle radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.10_0.012_255)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-medium mb-10 animate-fade-in"
        >
          <Sparkles className="w-3 h-3" />
          {t.badge}
        </div>

        {/* Title */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6 animate-fade-in"
          style={{ animationDelay: '0.12s' }}
        >
          <span className="gradient-text">{t.titleGradient}</span>
          <br />
          <span className="text-foreground">{t.titleNormal}</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in"
          style={{ animationDelay: '0.24s' }}
        >
          {t.subtitle}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
          style={{ animationDelay: '0.36s' }}
        >
          <a
            href="#portfolio"
            className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            {t.ctaPrimary}
          </a>
          <a
            href="#contact"
            className="px-8 py-3.5 rounded-xl border border-border hover:border-primary/50 text-foreground font-semibold text-sm transition-all duration-200 hover:bg-primary/6 hover:-translate-y-0.5"
          >
            {t.ctaSecondary}
          </a>
        </div>

        {/* Floating stats bar */}
        <div
          className="mt-20 flex flex-wrap justify-center gap-8 sm:gap-16 animate-fade-in"
          style={{ animationDelay: '0.48s' }}
        >
          {[
            { value: '2+', label: lang === 'en' ? 'Projects Delivered' : 'Progetti Consegnati' },
            { value: '100%', label: lang === 'en' ? 'Custom Design' : 'Design Personalizzato' },
            { value: '5★', label: lang === 'en' ? 'Client Satisfaction' : 'Soddisfazione Clienti' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <span className="text-xs text-muted-foreground tracking-widest uppercase">
          {lang === 'en' ? 'Scroll' : 'Scorri'}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground animate-bounce" />
      </div>
    </section>
  )
}
