'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { useConsent } from './consent-provider'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

export default function Footer() {
  const { lang } = useLanguage()
  const t = translations[lang].footer
  const { openBanner } = useConsent()
  const usingCookiebot = process.env.NEXT_PUBLIC_COOKIE_CMP === "cookiebot"

  // During the Cookiebot trial our own ConsentProvider isn't mounted (see
  // app/layout.tsx), so openBanner() above would be a no-op — Cookiebot
  // exposes its own global renew() to reopen its banner instead.
  function openCookiePreferences() {
    if (usingCookiebot) {
      (window as unknown as { Cookiebot?: { renew?: () => void } }).Cookiebot?.renew?.();
    } else {
      openBanner();
    }
  }

  // Footer is shared by public pages (homepage, FAQ) and account pages —
  // Support is account-oriented (data/security/deletion FAQ), so it only
  // makes sense to surface once there's a real session behind it. Same
  // getUser + onAuthStateChange pattern as Navigation's avatar menu.
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    const supabase = createBrowserSupabaseClient()
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

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
            {isLoggedIn && (
              <a href="/support" className="text-xs text-white/60 hover:text-white transition-colors">
                {lang === 'en' ? 'Support' : 'Supporto'}
              </a>
            )}
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
              onClick={openCookiePreferences}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              {lang === 'en' ? 'Cookie preferences' : 'Preferenze Cookie'}
            </button>
          </div>

          {/* Copyright */}
          <p className="text-xs text-white/50">{t.rights}</p>
        </div>
        <p className="text-center text-xs text-white/40 mt-4">
          {lang === 'en' ? 'Made with ❤️ for you' : 'Creato con ❤️ per te'}
        </p>
      </div>
    </footer>
  )
}
