'use client'

import { UploadCloud, Sparkles, Target, Download, X } from 'lucide-react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'

const ICONS = [UploadCloud, Sparkles, Target, Download]

interface HowItWorksModalProps {
  open: boolean
  onClose: () => void
  onProceed: () => void
}

// Gate shown before leaving the homepage for /generate — the same 4 steps
// as the "Come funziona" section, just surfaced right at the decision point
// instead of relying on the visitor having scrolled past that section
// earlier. Dismissing via backdrop/X just closes it (no navigation); only
// the explicit "Continua" button proceeds — the gate, not a trap.
export default function HowItWorksModal({ open, onClose, onProceed }: HowItWorksModalProps) {
  const { lang } = useLanguage()
  const t = translations[lang].services

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-border bg-background p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Chiudi"
          className="absolute top-5 right-5 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="text-xs font-semibold text-primary uppercase tracking-[0.18em] mb-2">
          {t.sectionLabel}
        </p>
        <h2 className="font-heading text-2xl font-bold tracking-tight mb-6 pr-8">{t.title}</h2>

        <div className="space-y-4 mb-8">
          {t.cards.map((card, i) => {
            const Icon = ICONS[i]
            return (
              <div key={card.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">{card.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{card.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={onProceed}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all duration-200"
        >
          {lang === 'en' ? "Got it, let's go →" : 'Ho capito, procedi →'}
        </button>
      </div>
    </div>
  )
}
