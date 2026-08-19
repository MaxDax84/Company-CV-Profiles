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
    const el = ref.current
    if (!el) return

    // threshold: 0.1 with no rootMargin meant a fast scroll (common on
    // mobile, especially flinging past this section) could cross the
    // trigger zone between two observer callbacks and never register as
    // intersecting — the section stayed stuck at opacity-0 until a slower
    // scroll happened to land inside that narrow window. A generous
    // rootMargin gives the crossing much more room to be caught, and
    // threshold: 0 fires on the first pixel of overlap instead of waiting
    // for 10% of the section to already be in view.
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0, rootMargin: '200px 0px 200px 0px' },
    )
    observer.observe(el)

    // Safety net for the case where the section is already on/near screen
    // by the time this effect runs (e.g. a short viewport, or the browser
    // restoring a mid-page scroll position) — don't rely on the observer's
    // first callback alone.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) setVisible(true)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="mission"
      ref={ref}
      className="relative py-12 md:py-20 overflow-hidden"
      style={{ background: 'var(--section-alt)' }}
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-40" />

      {/* Accent orb — color-mix against var(--primary) rather than a fixed
          Electric Blue literal, so this switches to Lime in dark mode
          instead of staying blue-tinted (identical result in light mode,
          where --primary already is Electric Blue). */}
      <div
        className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'color-mix(in srgb, var(--primary) 8%, transparent)' }}
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
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
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
                background: 'var(--card)',
                boxShadow: '0 1px 3px rgba(16, 25, 150, 0.06)',
                transitionDelay: `${i * 80 + 150}ms`,
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-5"
                style={{ background: 'color-mix(in srgb, var(--primary) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)' }}
              >
                {pillar.icon}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-semibold">{pillar.title}</h3>
                {(pillar as { badge?: string }).badge && (
                  <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-[9px] font-bold uppercase tracking-wider">
                    {(pillar as { badge?: string }).badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div
          className={cn(
            'max-w-2xl mx-auto px-6 py-4 rounded-xl text-center transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          )}
          style={{
            background: 'color-mix(in srgb, var(--primary) 6%, transparent)',
            border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
            transitionDelay: '500ms',
          }}
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t.note}{' '}
            <strong className="text-foreground">{t.noteBold}</strong>
          </p>
        </div>

      </div>
    </section>
  )
}
