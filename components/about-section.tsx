'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function AboutSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const { lang } = useLanguage()
  const t = translations[lang].about

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Same generous-rootMargin pattern as the other fade-in sections (see
    // components/mission-section.tsx for why threshold:0 + rootMargin is
    // needed instead of the naive default).
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
    <section id="chi-siamo" ref={ref} className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 grid-overlay" />
      <div
        className={cn(
          'relative z-10 max-w-4xl mx-auto px-6 text-center transition-all duration-700',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        )}
      >
        <p className="text-xs font-semibold text-primary uppercase tracking-[0.18em] mb-4">
          {t.sectionLabel}
        </p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
          {t.headline}{' '}
          <span className="gradient-text">{t.headlineAccent}</span>
        </h2>
        <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
          <p>{t.paragraph1}</p>
          <p>{t.paragraph2}</p>
          <p className="text-foreground font-medium">{t.paragraph3}</p>
        </div>
      </div>
    </section>
  )
}
