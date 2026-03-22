'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { showcaseCount } from '@/lib/showcase-items'
import { cn } from '@/lib/utils'

// CSS mockup for Project Alpha (violet theme)
function AlphaMockup() {
  const violet = 'oklch(0.72 0.18 280)'
  const bg = 'oklch(0.20 0.005 270)'
  const card = 'oklch(0.26 0.007 270)'
  const border = 'oklch(0.34 0.007 270)'

  return (
    <div className="rounded-xl overflow-hidden border border-border/50 select-none">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-secondary border-b border-border/60">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <div className="flex-1 mx-3 h-4 rounded-full bg-border/40" />
      </div>

      {/* Site preview */}
      <div
        className="relative overflow-hidden p-5"
        style={{ background: bg, height: '220px' }}
      >
        {/* Nav */}
        <div className="flex items-center justify-between mb-5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-bold"
            style={{ background: `${violet}22`, border: `1px solid ${violet}55`, color: violet }}
          >
            A
          </div>
          <div className="flex gap-3">
            {[40, 52, 44, 56].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full" style={{ width: w, background: border }} />
            ))}
          </div>
        </div>

        {/* Hero text */}
        <div className="mb-5 space-y-1.5">
          <div className="h-2 w-24 rounded-full" style={{ background: violet + '99' }} />
          <div className="h-4 w-44 rounded-full" style={{ background: 'oklch(0.85 0.01 270 / 0.25)' }} />
          <div className="h-2 w-36 rounded-full" style={{ background: 'oklch(0.85 0.01 270 / 0.12)' }} />
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg p-2"
              style={{ background: card, border: `1px solid ${violet}20` }}
            >
              <div className="h-2.5 w-full rounded-full mb-1" style={{ background: violet + '55' }} />
              <div className="h-1.5 w-3/4 rounded-full" style={{ background: 'oklch(0.85 0.01 270 / 0.12)' }} />
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="flex gap-1.5 flex-wrap">
          {[28, 36, 24, 32, 28].map((w, i) => (
            <div
              key={i}
              className="h-4 rounded-full"
              style={{ width: w, background: violet + '22', border: `1px solid ${violet}33` }}
            />
          ))}
        </div>

        {/* Glow */}
        <div
          className="absolute -top-4 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none"
          style={{ background: violet + '15' }}
        />
      </div>
    </div>
  )
}

// CSS mockup for Project Beta (teal theme)
function BetaMockup() {
  const teal = 'oklch(0.72 0.14 185)'
  const bg = 'oklch(0.18 0.005 200)'
  const card = 'oklch(0.24 0.007 200)'
  const border = 'oklch(0.32 0.007 200)'

  return (
    <div className="rounded-xl overflow-hidden border border-border/50 select-none">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-secondary border-b border-border/60">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <div className="flex-1 mx-3 h-4 rounded-full bg-border/40" />
      </div>

      {/* Site preview */}
      <div
        className="relative overflow-hidden p-5"
        style={{ background: bg, height: '220px' }}
      >
        {/* Nav */}
        <div className="flex items-center justify-between mb-5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-bold"
            style={{ background: `${teal}22`, border: `1px solid ${teal}55`, color: teal }}
          >
            E
          </div>
          <div className="flex gap-3">
            {[44, 56, 40, 52, 48].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full" style={{ width: w, background: border }} />
            ))}
          </div>
        </div>

        {/* Hero text */}
        <div className="mb-5 space-y-1.5">
          <div className="h-2 w-32 rounded-full" style={{ background: teal + '99' }} />
          <div className="h-4 w-48 rounded-full" style={{ background: 'oklch(0.85 0.01 200 / 0.25)' }} />
          <div className="h-2 w-40 rounded-full" style={{ background: 'oklch(0.85 0.01 200 / 0.12)' }} />
        </div>

        {/* Approach cards */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg p-2.5"
              style={{ background: card, border: `1px solid ${teal}20` }}
            >
              <div className="w-4 h-4 rounded mb-1.5" style={{ background: teal + '44' }} />
              <div className="h-1.5 w-full rounded-full mb-1" style={{ background: 'oklch(0.85 0.01 200 / 0.18)' }} />
              <div className="h-1.5 w-3/4 rounded-full" style={{ background: 'oklch(0.85 0.01 200 / 0.10)' }} />
            </div>
          ))}
        </div>

        {/* Glow */}
        <div
          className="absolute -bottom-4 -right-4 w-40 h-40 rounded-full blur-3xl pointer-events-none"
          style={{ background: teal + '12' }}
        />
      </div>
    </div>
  )
}

// CSS mockup for Project Gamma (amber/warm theme)
function GammaMockup() {
  const amber = 'oklch(0.75 0.15 70)'
  const bg = 'oklch(0.18 0.005 70)'
  const card = 'oklch(0.24 0.007 70)'
  const border = 'oklch(0.32 0.007 70)'

  return (
    <div className="rounded-xl overflow-hidden border border-border/50 select-none">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-secondary border-b border-border/60">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <div className="flex-1 mx-3 h-4 rounded-full bg-border/40" />
      </div>

      {/* Site preview */}
      <div
        className="relative overflow-hidden p-5"
        style={{ background: bg, height: '220px' }}
      >
        {/* Nav */}
        <div className="flex items-center justify-between mb-5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold"
            style={{ background: `${amber}22`, border: `1px solid ${amber}55`, color: amber }}
          >
            G
          </div>
          <div className="flex gap-3">
            {[48, 40, 52, 44].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full" style={{ width: w, background: border }} />
            ))}
          </div>
        </div>

        {/* Name + title */}
        <div className="mb-4 space-y-1.5">
          <div className="h-3 w-32 rounded-full" style={{ background: 'oklch(0.85 0.01 70 / 0.28)' }} />
          <div className="h-1.5 w-24 rounded-full" style={{ background: amber + '66' }} />
        </div>

        {/* Career timeline */}
        <div className="flex items-start gap-2 mb-4">
          <div className="flex flex-col items-center pt-1">
            <div className="w-2 h-2 rounded-full" style={{ background: amber }} />
            <div className="w-px" style={{ background: amber + '44', height: 36 }} />
            <div className="w-2 h-2 rounded-full" style={{ background: amber + '88' }} />
          </div>
          <div className="flex-1 space-y-2">
            <div className="rounded p-1.5" style={{ background: card, border: `1px solid ${amber}20` }}>
              <div className="h-1.5 w-28 rounded-full mb-1" style={{ background: 'oklch(0.85 0.01 70 / 0.2)' }} />
              <div className="h-1 w-20 rounded-full" style={{ background: 'oklch(0.85 0.01 70 / 0.12)' }} />
            </div>
            <div className="rounded p-1.5" style={{ background: card, border: `1px solid ${amber}20` }}>
              <div className="h-1.5 w-32 rounded-full mb-1" style={{ background: 'oklch(0.85 0.01 70 / 0.2)' }} />
              <div className="h-1 w-24 rounded-full" style={{ background: 'oklch(0.85 0.01 70 / 0.12)' }} />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap">
          {[32, 40, 28, 36].map((w, i) => (
            <div
              key={i}
              className="h-3.5 rounded-full"
              style={{ width: w, background: amber + '22', border: `1px solid ${amber}33` }}
            />
          ))}
        </div>

        {/* Glow */}
        <div
          className="absolute -top-4 left-0 w-40 h-40 rounded-full blur-3xl pointer-events-none"
          style={{ background: amber + '12' }}
        />
      </div>
    </div>
  )
}

const MOCKUPS = [AlphaMockup, BetaMockup, GammaMockup]

export default function PortfolioSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const { lang } = useLanguage()
  const t = translations[lang].portfolio

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="portfolio" ref={ref} className="relative py-12 md:py-16 overflow-hidden">
      {/* Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/4 rounded-full blur-[120px] pointer-events-none" />

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

        {/* Showcase link */}
        <div
          className={cn(
            'text-center mb-12 transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
          style={{ transitionDelay: '100ms' }}
        >
          <a
            href="/showcase"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-primary/40 bg-primary/8 text-primary font-semibold text-sm hover:bg-primary/15 hover:border-primary/60 transition-all duration-200"
          >
            <span>✦</span>
            <span>View Style Showcase — {showcaseCount} iconic CV designs</span>
            <span>→</span>
          </a>
        </div>

        {/* Project cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {t.projects.map((project, i) => {
            const Mockup = MOCKUPS[i]
            return (
              <div
                key={project.label}
                className={cn(
                  'group rounded-2xl border border-border/50 bg-card/40 overflow-hidden transition-all duration-700 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8',
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
                )}
                style={{ transitionDelay: `${i * 120 + 200}ms` }}
              >
                {/* Mockup */}
                <div className="p-4 pb-0">
                  <Mockup />
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                        {project.label}
                      </p>
                      <h3 className="text-base font-semibold">{project.role}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-secondary border border-border/50 text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
