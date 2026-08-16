'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'

// Same 4 seeded demo profiles used by /generate's own template picker (see
// app/api/seed-demo/route.ts) — reusing them here means no new demo content
// to keep in sync, and they're already confirmed working in production.
const WEB_TEMPLATES: { id: string; name: string; accent: string; bg: string; demoSlug: string }[] = [
  { id: 'alpha', name: 'Alpha', accent: '#6366f1', bg: '#030608', demoSlug: 'marco-ferretti' },
  { id: 'beta', name: 'Beta', accent: '#4f46e5', bg: '#ffffff', demoSlug: 'marco-ferretti-beta' },
  { id: 'gamma', name: 'Gamma', accent: '#10b981', bg: '#0b1f14', demoSlug: 'marco-ferretti-gamma' },
  { id: 'delta', name: 'Delta', accent: '#c9a84c', bg: '#0a1628', demoSlug: 'marco-ferretti-delta' },
]

const PDF_TEMPLATE_CARDS: { id: 'ats-core' | 'executive' | 'creative-tech'; name: string; accent: string }[] = [
  { id: 'ats-core', name: 'Pragmatico', accent: '#2b2b2b' },
  { id: 'executive', name: 'Executive', accent: '#16233f' },
  { id: 'creative-tech', name: 'Creative Tech', accent: '#7c3aed' },
]

function WebTemplateCard({ tpl, width }: { tpl: (typeof WEB_TEMPLATES)[number]; width: number }) {
  const height = width * 1.41
  return (
    <div
      className="rounded-xl overflow-hidden relative"
      style={{ width, height, border: `2px solid ${tpl.accent}`, boxShadow: `0 8px 28px ${tpl.accent}35`, background: tpl.bg }}
    >
      <div className="absolute top-0 left-0 right-0 h-5 flex items-center gap-1.5 px-2 z-10" style={{ background: 'rgba(0,0,0,0.35)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/70" />
        <span className="w-1.5 h-1.5 rounded-full bg-green-400/70" />
      </div>
      {/* Live preview, not the real page — nothing inside should be tappable
          (same "glass" treatment as the /generate template picker). */}
      <iframe
        src={`/profile/${tpl.demoSlug}`}
        title={tpl.name}
        tabIndex={-1}
        style={{
          position: 'absolute',
          top: 20,
          left: 0,
          width: 1200,
          height: 4000,
          border: 'none',
          transform: `scale(${width / 1200})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

// Live preview of /pdf-preview/[template] — the same plain-HTML mirror
// (real demo content: Marco Ferretti, full bullets) already used for the
// small template picker in components/pdf-export-button.tsx. Genuine DOM
// text inside an iframe, so scaling the card up keeps it perfectly sharp —
// not a raster screenshot that would blur when enlarged.
function PdfTemplateCard({ tpl, width }: { tpl: (typeof PDF_TEMPLATE_CARDS)[number]; width: number }) {
  return (
    <div
      className="rounded-xl overflow-hidden relative bg-white"
      style={{ width, height: width * 1.41, border: `2px solid ${tpl.accent}`, boxShadow: `0 8px 28px ${tpl.accent}35` }}
    >
      <iframe
        src={`/pdf-preview/${tpl.id}`}
        title={tpl.name}
        tabIndex={-1}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1200,
          height: 1697,
          border: 'none',
          transform: `scale(${width / 1200})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
        }}
      />
      <p
        className="absolute bottom-0 left-0 right-0 text-xs font-semibold text-center py-1.5"
        style={{ background: `${tpl.accent}e6`, color: '#fff' }}
      >
        {tpl.name}
      </p>
    </div>
  )
}

// Shared by both rows: all cards always visible and centered as a group,
// the active one scaled way up (legible) with the rest as small side
// "peek" thumbnails. Clicking a side card, or a left/right swipe/wheel
// gesture anywhere on the row, makes it the active one. Deliberately NOT a
// scrolling carousel (cards never move off-screen) — an earlier version
// used native horizontal scroll with padding sized to center one card at a
// time, which meant the other cards sat scrolled out of view.
function Coverflow<T>({
  items,
  renderCard,
  defaultActive = 0,
  activeWidth,
  sideWidth,
}: {
  items: T[]
  renderCard: (item: T, width: number) => React.ReactNode
  defaultActive?: number
  activeWidth: { mobile: number; tablet: number; desktop: number }
  sideWidth: { mobile: number; tablet: number; desktop: number }
}) {
  const [active, setActive] = useState(defaultActive)
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const touchStartX = useRef<number | null>(null)
  const wheelLock = useRef(false)

  useEffect(() => {
    const update = () => setBreakpoint(window.innerWidth < 640 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop')
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const shift = useCallback((direction: 1 | -1) => {
    setActive((prev) => Math.min(items.length - 1, Math.max(0, prev + direction)))
  }, [items.length])

  function onWheel(e: React.WheelEvent) {
    if (wheelLock.current) return
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0
    if (Math.abs(delta) < 15) return
    wheelLock.current = true
    shift(delta > 0 ? 1 : -1)
    setTimeout(() => { wheelLock.current = false }, 350)
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 40) shift(delta < 0 ? 1 : -1)
    touchStartX.current = null
  }

  return (
    <div
      className="flex items-center justify-center gap-3 sm:gap-5 py-6"
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {items.map((item, i) => {
        const isActive = i === active
        const width = isActive ? activeWidth[breakpoint] : sideWidth[breakpoint]
        return (
          <button
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            onClick={() => setActive(i)}
            aria-label="Metti in evidenza"
            className="shrink-0 transition-[width] duration-300 ease-out cursor-pointer"
            style={{ opacity: isActive ? 1 : 0.55, zIndex: isActive ? 10 : 1 }}
          >
            {renderCard(item, width)}
          </button>
        )
      })}
    </div>
  )
}

export default function TemplateShowcaseSection() {
  const { lang } = useLanguage()
  const t = translations[lang].templateShowcase

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 grid-overlay" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 space-y-16">
        <div>
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-2">{t.webTitle}</h2>
            <p className="text-muted-foreground text-sm md:text-base">{t.webSubtitle}</p>
          </div>
          <Coverflow
            items={WEB_TEMPLATES}
            defaultActive={0}
            activeWidth={{ mobile: 220, tablet: 380, desktop: 520 }}
            sideWidth={{ mobile: 55, tablet: 85, desktop: 115 }}
            renderCard={(tpl, width) => <WebTemplateCard tpl={tpl} width={width} />}
          />
        </div>

        <div>
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-2">{t.pdfTitle}</h2>
            <p className="text-muted-foreground text-sm md:text-base">{t.pdfSubtitle}</p>
          </div>
          <Coverflow
            items={PDF_TEMPLATE_CARDS}
            defaultActive={1}
            activeWidth={{ mobile: 260, tablet: 440, desktop: 620 }}
            sideWidth={{ mobile: 55, tablet: 90, desktop: 120 }}
            renderCard={(tpl, width) => <PdfTemplateCard tpl={tpl} width={width} />}
          />
        </div>
      </div>
    </section>
  )
}
