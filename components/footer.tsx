'use client'

import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { useConsent } from './consent-provider'

export default function Footer() {
  const { lang } = useLanguage()
  const t = translations[lang].footer
  const { openBanner } = useConsent()

  return (
    // Always a Dark Navy block, independent of the site's light/dark theme
    // toggle — the brand guide calls out Dark Navy specifically for footers
    // as a deliberate dark section against the mostly-white/light site.
    <footer className="bg-[#0b1279]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Ribbon: logo + nav + copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- small fixed-size mark, same as the nav logo */}
            <img src="/icon.png" alt="" className="w-7 h-7 rounded-lg" />
            <span className="font-heading font-bold text-base tracking-tight text-white">
              Jobli
            </span>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <a href="/support" className="text-xs text-white/60 hover:text-white transition-colors">
              {lang === 'en' ? 'Support' : 'Supporto'}
            </a>
            <a href="/terms" className="text-xs text-white/60 hover:text-white transition-colors">
              {lang === 'en' ? 'Terms of Service' : 'Termini di Servizio'}
            </a>
            <a href="/privacy" className="text-xs text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/cookies" className="text-xs text-white/60 hover:text-white transition-colors">
              Cookie Policy
            </a>
            <button
              type="button"
              onClick={openBanner}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              {lang === 'en' ? 'Cookie preferences' : 'Preferenze Cookie'}
            </button>
          </div>

          {/* Copyright */}
          <p className="text-xs text-white/50">{t.rights}</p>
        </div>
      </div>
    </footer>
  )
}
