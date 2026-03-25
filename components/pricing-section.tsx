'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Zap, RefreshCw } from 'lucide-react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function PricingSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const { lang } = useLanguage()
  const t = translations[lang].pricing

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
      id="pricing"
      ref={ref}
      className="relative py-12 md:py-16 overflow-hidden"
    >
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
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Launch promo banner */}
        <div
          className={cn(
            'flex items-center justify-center gap-3 mb-8 px-5 py-3 rounded-xl border border-primary/30 bg-primary/5 text-center transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          )}
          style={{ transitionDelay: '100ms' }}
        >
          <span className="text-sm font-bold text-primary">🎉 {(t as { launchBadge?: string }).launchBadge}</span>
          <span className="text-muted-foreground/50">·</span>
          <span className="text-sm text-muted-foreground">{(t as { launchNote?: string }).launchNote}</span>
        </div>

        {/* 3 main plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-8">
          {t.plans.map((plan, i) => (
            <div
              key={plan.name}
              className={cn(
                'relative rounded-2xl border p-8 flex flex-col transition-all duration-700',
                plan.highlighted
                  ? 'border-primary/60 bg-primary/6 shadow-xl shadow-primary/15 scale-[1.02]'
                  : 'border-border/50 bg-card/60 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8',
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
              )}
              style={{ transitionDelay: `${i * 100 + 150}ms` }}
            >
              {/* Most popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold whitespace-nowrap">
                  <Zap className="w-3 h-3" />
                  {t.mostPopular}
                </div>
              )}

              {/* Plan name */}
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">
                {plan.name}
              </p>

              {/* Price */}
              {(plan as { originalPrice?: string }).originalPrice && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg line-through text-muted-foreground/50 font-medium">€{(plan as { originalPrice?: string }).originalPrice}</span>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">-50%</span>
                </div>
              )}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">€{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">
                  {(plan as { priceNote?: string }).priceNote ?? t.oneTime}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 mt-3">
                {plan.description}
              </p>

              <hr className="border-border/40 mb-6" />

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check
                      className={cn(
                        'w-4 h-4 mt-0.5 shrink-0',
                        plan.highlighted ? 'text-primary' : 'text-muted-foreground',
                      )}
                    />
                    <span className={plan.highlighted ? 'text-foreground' : 'text-muted-foreground'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#contact"
                className={cn(
                  'block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200',
                  plan.highlighted
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30'
                    : 'border border-border hover:border-primary/50 hover:bg-primary/6 text-foreground',
                )}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Maintenance card — full width below */}
        <div
          className={cn(
            'relative rounded-2xl border border-primary/25 bg-card/60 p-8 transition-all duration-700 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/8',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
          )}
          style={{ transitionDelay: '550ms' }}
        >
          {/* Subtle glow */}
          <div className="absolute inset-0 rounded-2xl bg-primary/3 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
            {/* Icon + text */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  {t.maintenance.name}
                </p>
              </div>

              <p className="text-base font-medium text-foreground/80 leading-relaxed max-w-xl mb-3">
                {(t.maintenance as { tagline?: string }).tagline}
              </p>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                {t.maintenance.description}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs font-semibold text-muted-foreground/70 border border-border/60 rounded-full px-2.5 py-0.5">Optional</span>
                <span className="text-xs text-muted-foreground/60">{t.maintenance.note}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="lg:w-60 shrink-0">
              <a
                href="#contact"
                className="block w-full text-center py-3 rounded-xl font-semibold text-sm border border-primary/40 hover:border-primary/70 hover:bg-primary/8 text-primary transition-all duration-200"
              >
                {t.maintenance.cta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
