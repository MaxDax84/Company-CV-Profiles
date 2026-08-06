'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function FinalCtaSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const { lang } = useLanguage()
  const t = translations[lang].finalCta

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'oklch(0.68 0.21 292 / 0.10)' }}
      />
      <div
        className={cn(
          'relative z-10 max-w-2xl mx-auto px-6 text-center transition-all duration-700',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        )}
      >
        <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-5">
          {t.title}
        </h2>
        <p className="text-muted-foreground text-base md:text-lg mb-10 leading-relaxed">
          {t.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/generate"
            className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            {t.ctaPrimary}
          </a>
          <a
            href="/tailor"
            className="px-8 py-3.5 rounded-xl border border-primary/40 hover:border-primary/70 text-primary font-semibold text-sm transition-all duration-200 hover:bg-primary/8 hover:-translate-y-0.5"
          >
            {t.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  )
}
