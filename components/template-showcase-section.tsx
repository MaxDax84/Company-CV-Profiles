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
// responds to trackpad/shift-wheel on desktop.
function ScrollRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

// Static, non-interactive mockups (not screenshots) — deliberately plain
// skeleton blocks that mirror each PDF variant's real visual traits from
// components/pdf/AtsResumeDocument.tsx (neutral vs. serif-navy vs.
// colorful-tags), so this stays honest about what the PDF actually looks
// like without needing an image-generation pipeline.
function PdfMockupCard({ id, name }: { id: 'ats-core' | 'executive' | 'creative-tech'; name: string }) {
  const isExecutive = id === 'executive'
  const isCreative = id === 'creative-tech'
  const accent = isExecutive ? '#16233f' : isCreative ? '#7c3aed' : '#2b2b2b'

  return (
    <div className="shrink-0 snap-center w-[190px]">
      <div
        className="aspect-[210/297] rounded-lg overflow-hidden bg-white p-4 flex flex-col gap-2.5"
        style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
      >
        <div
          className={isExecutive ? 'text-center' : ''}
          style={{
            background: isCreative || isExecutive ? `${accent}0f` : 'transparent',
            margin: '-16px -16px 4px',
            padding: '16px 16px 10px',
            borderBottom: !isCreative && !isExecutive ? '1px solid #ccc' : 'none',
          }}
        >
          <div
            style={{
              height: 8,
              width: isExecutive ? '55%' : '65%',
              margin: isExecutive ? '0 auto' : 0,
              background: accent,
              borderRadius: 1,
              fontFamily: isExecutive ? 'Georgia, serif' : undefined,
            }}
          />
          <div style={{ height: 4, width: isExecutive ? '35%' : '40%', margin: isExecutive ? '5px auto 0' : '5px 0 0', background: '#bbb', borderRadius: 1 }} />
        </div>

        {[100, 90, 95, 70].map((w, i) => (
          <div key={i} style={{ height: 3, width: `${w}%`, background: '#ddd', borderRadius: 1 }} />
        ))}

        <div style={{ height: 4, width: '30%', background: accent, opacity: 0.5, borderRadius: 1, marginTop: 4 }} />
        {[100, 85, 92].map((w, i) => (
          <div key={i} style={{ height: 3, width: `${w}%`, background: '#ddd', borderRadius: 1 }} />
        ))}

        {isCreative ? (
          <div className="flex flex-wrap gap-1 mt-1">
            {[24, 30, 20, 26].map((w, i) => (
              <div key={i} style={{ height: 8, width: w, background: `${accent}22`, border: `1px solid ${accent}55`, borderRadius: 6 }} />
            ))}
          </div>
        ) : (
          <>
            <div style={{ height: 4, width: '25%', background: accent, opacity: 0.5, borderRadius: 1, marginTop: 4 }} />
            {[95, 80].map((w, i) => (
              <div key={i} style={{ height: 3, width: `${w}%`, background: '#ddd', borderRadius: 1 }} />
            ))}
          </>
        )}
      </div>
      <p className="text-xs font-semibold text-center mt-2">{name}</p>
    </div>
  )
}

const PDF_MOCKUPS: { id: 'ats-core' | 'executive' | 'creative-tech'; name: string }[] = [
  { id: 'ats-core', name: 'Pragmatico' },
  { id: 'executive', name: 'Executive' },
  { id: 'creative-tech', name: 'Creative Tech' },
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
            {PDF_MOCKUPS.map((m) => (
              <PdfMockupCard key={m.id} id={m.id} name={m.name} />
            ))}
          </ScrollRow>
        </div>
      </div>
    </section>
  )
}
