'use client'

import { useEffect, useRef, useState } from 'react'
import { Palette, Globe2, RefreshCw } from 'lucide-react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const ICONS = [Palette, Globe2, RefreshCw]

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
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">{t.title}</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.cards.map((card, i) => {
            const Icon = ICONS[i]
            return (
              <div
                key={card.title}
                className={cn(
                  'group relative rounded-2xl border border-border/50 bg-card/60 p-8 transition-all duration-700 hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/8 hover:-translate-y-1',
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
                )}
                style={{ transitionDelay: `${i * 100 + 150}ms` }}
              >
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

        {/* Tagline */}
        <p
          className={cn(
            'text-center text-sm sm:text-base font-semibold text-foreground mt-12 transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
          style={{ transitionDelay: '450ms' }}
        >
          {lang === 'it' ? (
            <>Tu ci dai il PDF, noi ti diamo il link.<br />Al resto (dominio, server, codice) pensiamo noi.</>
          ) : (
            <>You give us the PDF, we give you the link.<br />We handle the rest — domain, server, code.</>
          )}
        </p>
      </div>
    </section>
  )
}
