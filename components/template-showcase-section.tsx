'use client'

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

// Horizontal, native-scroll strip — no custom drag/velocity JS needed, a
// plain overflow-x-auto + touch already tracks the finger 1:1 on mobile and
// responds to trackpad/shift-wheel on desktop. Centered on desktop (md+),
// where all the cards comfortably fit with no overflow; left-aligned below
// that so mobile's genuine overflow stays scrollable — centering a row that
// actually overflows can make browsers clip the very first card unreachable.
function ScrollRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 justify-start md:justify-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  )
}

function WebTemplateCard({ tpl }: { tpl: (typeof WEB_TEMPLATES)[number] }) {
  return (
    <div
      className="shrink-0 snap-center w-[220px] rounded-xl overflow-hidden relative"
      style={{ height: 310, border: `2px solid ${tpl.accent}`, boxShadow: `0 0 20px ${tpl.accent}30`, background: tpl.bg }}
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
          height: 1700,
          border: 'none',
          transform: 'scale(0.1833)',
          transformOrigin: 'top left',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

// Live preview of /pdf-preview/[template] — the same plain-HTML mirror
// (real demo content: Marco Ferretti, full bullets) already used for the
// small template picker in components/pdf-export-button.tsx. An earlier
// version of this card was a hand-drawn abstract mockup (grey bars, no real
// text) so it never actually read as a CV — this is an iframe after all,
// same as the web-template cards above, just of a static, non-scrolling
// HTML page rather than a live product page.
function PdfTemplateCard({ id, name, accent }: { id: 'ats-core' | 'executive' | 'creative-tech'; name: string; accent: string }) {
  return (
    <div
      className="shrink-0 snap-center w-[220px] rounded-xl overflow-hidden relative"
      style={{ height: 310, border: `2px solid ${accent}`, boxShadow: `0 0 20px ${accent}30`, background: '#ffffff' }}
    >
      <iframe
        src={`/pdf-preview/${id}`}
        title={name}
        tabIndex={-1}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1200,
          height: 1697,
          border: 'none',
          transform: 'scale(0.1833)',
          transformOrigin: 'top left',
          pointerEvents: 'none',
        }}
      />
      <p
        className="absolute bottom-0 left-0 right-0 text-xs font-semibold text-center py-1.5"
        style={{ background: `${accent}e6`, color: '#fff' }}
      >
        {name}
      </p>
    </div>
  )
}

const PDF_TEMPLATE_CARDS: { id: 'ats-core' | 'executive' | 'creative-tech'; name: string; accent: string }[] = [
  { id: 'ats-core', name: 'Pragmatico', accent: '#2b2b2b' },
  { id: 'executive', name: 'Executive', accent: '#16233f' },
  { id: 'creative-tech', name: 'Creative Tech', accent: '#7c3aed' },
]

export default function TemplateShowcaseSection() {
  const { lang } = useLanguage()
  const t = translations[lang].templateShowcase

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        <div>
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-2">{t.webTitle}</h2>
            <p className="text-muted-foreground text-sm md:text-base">{t.webSubtitle}</p>
          </div>
          <ScrollRow>
            {WEB_TEMPLATES.map((tpl) => (
              <WebTemplateCard key={tpl.id} tpl={tpl} />
            ))}
          </ScrollRow>
        </div>

        <div>
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-2">{t.pdfTitle}</h2>
            <p className="text-muted-foreground text-sm md:text-base">{t.pdfSubtitle}</p>
          </div>
          <ScrollRow>
            {PDF_TEMPLATE_CARDS.map((tpl) => (
              <PdfTemplateCard key={tpl.id} id={tpl.id} name={tpl.name} accent={tpl.accent} />
            ))}
          </ScrollRow>
        </div>
      </div>
    </section>
  )
}
