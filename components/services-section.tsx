'use client'

import { useEffect, useRef, useState } from 'react'
import { UploadCloud, Sparkles, Target, Download } from 'lucide-react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const ICONS = [UploadCloud, Sparkles, Target, Download]

export default function ServicesSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const { lang } = useLanguage()
  const t = translations[lang].services

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="services"
      ref={ref}
      className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-secondary/20" />
      <div className="absolute inset-0 grid-overlay" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div
          className={cn(
            'text-center mb-16 transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.18em] mb-4">
            {t.sectionLabel}
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-5">{t.title}</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.cards.map((card, i) => {
            const Icon = ICONS[i]
            return (
              <div
                key={card.title}
                className={cn(
                  'group relative rounded-2xl glass-card p-8 transition-all duration-700 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1',
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
                )}
                style={{ transitionDelay: `${i * 100 + 150}ms` }}
              >
                {/* Step number */}
                <div className="absolute top-6 right-6 font-heading text-3xl font-bold text-primary/15 group-hover:text-primary/25 transition-colors duration-200">
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-200">
                  <Icon className="w-6 h-6 text-primary" />
                </div>

                {/* Text */}
                <h3 className="text-lg font-semibold mb-3">{card.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-primary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            )
          })}
        </div>

        {/* Work-in-progress note — the AI chat refinement isn't built yet */}
        {(t as { wipNote?: string }).wipNote && (
          <div
            className={cn(
              'mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-4 max-w-4xl mx-auto transition-all duration-700',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            )}
            style={{ transitionDelay: '550ms' }}
          >
            <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-[10px] font-bold uppercase tracking-wider">
              {(t as { wipBadge?: string }).wipBadge}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {(t as { wipNote?: string }).wipNote}
            </p>
          </div>
        )}

      </div>
    </section>
  )
}
