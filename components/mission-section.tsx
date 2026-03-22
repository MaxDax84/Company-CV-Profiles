'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function MissionSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const { lang } = useLanguage()
  const t = translations[lang].mission

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="mission"
      ref={ref}
      className="relative py-12 md:py-20 overflow-hidden"
      style={{ background: 'oklch(0.10 0.015 255)' }}
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-40" />

      {/* Accent orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'oklch(0.65 0.22 255 / 0.06)' }}
      />

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
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
            {t.headline}{' '}
            <span className="gradient-text">{t.headlineAccent}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            {t.subheadline}
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {t.pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className={cn(
                'rounded-2xl border border-border/50 p-7 transition-all duration-700',
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
              )}
              style={{
                background: 'oklch(0.13 0.015 255 / 0.8)',
                transitionDelay: `${i * 80 + 150}ms`,
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-5"
                style={{ background: 'oklch(0.65 0.22 255 / 0.12)', border: '1px solid oklch(0.65 0.22 255 / 0.2)' }}
              >
                {pillar.icon}
              </div>
              <h3 className="text-base font-semibold mb-2">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div
          className={cn(
            'flex items-start gap-3 max-w-2xl mx-auto px-6 py-4 rounded-xl transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          )}
          style={{
            background: 'oklch(0.65 0.22 255 / 0.06)',
            border: '1px solid oklch(0.65 0.22 255 / 0.15)',
            transitionDelay: '500ms',
          }}
        >
          <span className="text-primary mt-0.5 text-base shrink-0">ℹ</span>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t.note}{' '}
            <strong className="text-foreground">{t.noteBold}</strong>
          </p>
        </div>

      </div>
    </section>
  )
}
