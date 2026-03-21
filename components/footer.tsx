'use client'

import { Globe } from 'lucide-react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'

export default function Footer() {
  const { lang } = useLanguage()
  const t = translations[lang].footer
  const nav = translations[lang].nav

  return (
    <footer className="border-t border-border/50 bg-secondary/20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-bold text-base tracking-tight">
              Go<span className="text-primary">On</span>Web
            </span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground text-center max-w-xs">{t.tagline}</p>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            {[
              { href: '#services', label: nav.services },
              { href: '#portfolio', label: nav.portfolio },
              { href: '#pricing', label: nav.pricing },
              { href: '#contact', label: nav.contact },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground">{t.rights}</p>
        </div>
      </div>
    </footer>
  )
}
