'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { showcaseCount } from '@/lib/showcase-items'
import { cn } from '@/lib/utils'

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

        {/* Project cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(t.projects as unknown as Array<{ label: string; role: string; description: string; tags: readonly string[]; href?: string }>).map((project, i) => {
            const card = (
              <div
                className={cn(
                  'group rounded-2xl border border-border/50 bg-card/40 overflow-hidden transition-all duration-700 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8',
                  project.href && 'cursor-pointer',
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
                )}
                style={{ transitionDelay: `${i * 120 + 200}ms` }}
              >
                {/* Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                        {project.label}
                      </p>
                      <h3 className="text-base font-semibold">{project.role}</h3>
                    </div>
                    {project.href && (
                      <span className="text-xs font-semibold text-primary/50 group-hover:text-primary transition-colors shrink-0 mt-1">
                        →
                      </span>
                    )}
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

            return project.href ? (
              <Link key={project.label} href={project.href} className="block">
                {card}
              </Link>
            ) : (
              <div key={project.label}>{card}</div>
            )
          })}
        </div>

        {/* Showcase link — below cards */}
        <div
          className={cn(
            'text-center mt-12 transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
          style={{ transitionDelay: '500ms' }}
        >
          <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest">
            {lang === 'en' ? 'Curious about the styles? We designed pages for iconic characters too.' : 'Curiosi sugli stili? Abbiamo creato pagine anche per personaggi iconici.'}
          </p>
          <a
            href="/showcase"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-primary/40 bg-primary/8 text-primary font-semibold text-sm hover:bg-primary/15 hover:border-primary/60 transition-all duration-200"
          >
            <span>✦</span>
            <span>{lang === 'en' ? `Explore ${showcaseCount} iconic CV designs` : `Esplora ${showcaseCount} design su personaggi famosi`}</span>
            <span>→</span>
          </a>
        </div>

      </div>
    </section>
  )
}
