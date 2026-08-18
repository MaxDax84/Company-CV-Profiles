'use client'

import { useEffect, useRef, useState } from 'react'
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

// Card box stays the original, compact size — only the content INSIDE zooms
// in (see CROP_SCALE below), instead of blowing up the whole card.
//
// The crop is centered horizontally, not left-aligned: every template's
// hero content (name/title) is itself centered on the page, so a
// left-aligned crop showed mostly empty margin — worst-case on the darkest
// template (Alpha), where that empty margin just reads as a solid black
// box with no visible text at all. SOURCE_WIDTH is the iframe's real
// width; centering math below picks the `left` offset that lines up the
// source page's horizontal center with the box's own center.
const CARD_WIDTH = 220
const CARD_HEIGHT = 310
const CROP_SCALE = 0.4
const SOURCE_WIDTH = 1200
const CENTERED_LEFT = CARD_WIDTH / 2 - (SOURCE_WIDTH / 2) * CROP_SCALE

function WebTemplateCard({ tpl }: { tpl: (typeof WEB_TEMPLATES)[number] }) {
  return (
    <div
      className="rounded-xl overflow-hidden relative"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT, border: `2px solid ${tpl.accent}`, boxShadow: `0 8px 28px ${tpl.accent}35`, background: tpl.bg }}
    >
      <div className="absolute top-0 left-0 right-0 h-5 flex items-center gap-1.5 px-2 z-10" style={{ background: 'rgba(0,0,0,0.35)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/70" />
        <span className="w-1.5 h-1.5 rounded-full bg-green-400/70" />
      </div>
      {/* Live preview, not the real page — nothing inside should be tappable
          (same "glass" treatment as the /generate template picker). Content
          taller than the visible box auto-scrolls slowly to also reveal the
          experience/education sections, not just the hero. */}
      <iframe
        src={`/profile/${tpl.demoSlug}`}
        title={tpl.name}
        tabIndex={-1}
        className="animate-showcase-web-scroll"
        style={{
          position: 'absolute',
          top: 20,
          left: CENTERED_LEFT,
          width: SOURCE_WIDTH,
          height: 4000,
          border: 'none',
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
// text inside an iframe, so zooming in keeps it perfectly sharp — not a
// raster screenshot that would blur when enlarged.
function PdfTemplateCard({ tpl }: { tpl: (typeof PDF_TEMPLATE_CARDS)[number] }) {
  return (
    <div
      className="rounded-xl overflow-hidden relative bg-white"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT, border: `2px solid ${tpl.accent}`, boxShadow: `0 8px 28px ${tpl.accent}35` }}
    >
      <iframe
        src={`/pdf-preview/${tpl.id}`}
        title={tpl.name}
        tabIndex={-1}
        style={{
          position: 'absolute',
          top: 0,
          left: CENTERED_LEFT,
          width: SOURCE_WIDTH,
          height: 1697,
          border: 'none',
          transform: `scale(${CROP_SCALE})`,
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

// Compact, uniform-size cards in a native horizontal scroll row (drag/swipe/
// wheel all work for free). Clicking a card smoothly scrolls it to the
// center via scrollIntoView — no custom width/position math needed for
// that, the browser already does it well. A lightweight scroll listener
// just tracks which card is nearest-center to give it a subtle highlight.
function Carousel<T>({ items, renderCard, keyOf }: { items: T[]; renderCard: (item: T) => React.ReactNode; keyOf: (item: T) => string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [centered, setCentered] = useState(0)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const updateCentered = () => {
      const mid = container.scrollLeft + container.clientWidth / 2
      let closest = 0
      let closestDist = Infinity
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid)
        if (dist < closestDist) { closestDist = dist; closest = i }
      })
      setCentered(closest)
    }
    updateCentered()
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateCentered)
    }
    container.addEventListener('scroll', onScroll, { passive: true })

    // Native wheel-to-horizontal-scroll is 1:1 with the vertical wheel
    // delta, which feels sluggish for a row this wide — multiply it so a
    // normal mouse-wheel tick moves several cards' worth of distance
    // instead of a few pixels. preventDefault stops the page itself from
    // also scrolling vertically while the cursor is over the carousel.
    const WHEEL_SPEED_MULTIPLIER = 4
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (delta === 0) return
      e.preventDefault()
      container.scrollLeft += delta * WHEEL_SPEED_MULTIPLIER
    }
    container.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      container.removeEventListener('scroll', onScroll)
      container.removeEventListener('wheel', onWheel)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-5 overflow-x-auto snap-x snap-mandatory py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      style={{ paddingLeft: `calc(50% - ${CARD_WIDTH / 2}px)`, paddingRight: `calc(50% - ${CARD_WIDTH / 2}px)` }}
    >
      {items.map((item, i) => (
        <div
          key={keyOf(item)}
          ref={(el) => { cardRefs.current[i] = el }}
          onClick={() => cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })}
          className="shrink-0 snap-center cursor-pointer transition-transform duration-300 ease-out"
          style={{ transform: `scale(${i === centered ? 1.08 : 1})` }}
        >
          {renderCard(item)}
        </div>
      ))}
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
          <Carousel items={WEB_TEMPLATES} keyOf={(tpl) => tpl.id} renderCard={(tpl) => <WebTemplateCard tpl={tpl} />} />
        </div>

        <div>
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-2">{t.pdfTitle}</h2>
            <p className="text-muted-foreground text-sm md:text-base">{t.pdfSubtitle}</p>
          </div>
          <Carousel items={PDF_TEMPLATE_CARDS} keyOf={(tpl) => tpl.id} renderCard={(tpl) => <PdfTemplateCard tpl={tpl} />} />
        </div>
      </div>
    </section>
  )
}
