'use client'

import { useState, useEffect } from 'react'
import { Globe, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import ThemeToggle from './theme-toggle'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { lang, setLang } = useLanguage()
  const t = translations[lang].nav
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // On non-home pages, anchor links must include the path
  const href = (anchor: string) => isHome ? anchor : `/${anchor}`

  // On /account, "Come funziona" opens as a tab inside the account page
  // itself (see components/account-tabs.tsx) instead of navigating away to
  // the homepage section — staying logged into the account view rather
  // than bouncing out of it.
  const isAccountPage = pathname.startsWith('/account')
  const links = [
    { href: isAccountPage ? '/account?tab=how' : href('#services'), label: t.services },
  ]

  // /account and /tailor are only ever reached by an already-authenticated
  // user with an existing profile — showing the generic "Try Free" CTA
  // aimed at brand-new anonymous visitors is redundant there. Point at the
  // account dashboard instead, the same context-appropriate link the
  // profile page's own owner toolbar uses.
  const isAccountContext = isAccountPage || pathname.startsWith('/tailor')
  const generateLabel = isAccountContext
    ? (lang === 'en' ? 'Your Account' : 'Il tuo account')
    : (t as { generate?: string }).generate ?? 'Try Free'
  const generateHref = isAccountContext ? '/account' : '/generate'
  const tailorLabel = (t as { tailorLink?: string }).tailorLink ?? 'Tailor to a Job'

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        // Always solid on mobile — the transparent-until-scrolled state let
        // page text visibly scroll underneath and overlap the nav items
        // (reported bug). Desktop keeps the transparent-at-top-of-page
        // effect, which blends with the hero and doesn't have this problem.
        'bg-background/95 border-b border-border/60',
        scrolled
          // No blur below md: a `position: fixed` bar with backdrop-filter
          // forces the browser to recompute the blur every scroll frame —
          // one of the most common real-world mobile scroll-jank causes.
          // A near-opaque background reads as solid without it.
          ? 'md:bg-background/80 md:backdrop-blur-md shadow-lg shadow-foreground/20'
          : 'md:bg-transparent md:border-transparent',
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center transition-all group-hover:border-primary/60 group-hover:bg-primary/25">
            <Globe className="w-4 h-4 text-primary" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">
            Job<span className="text-primary">ly</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          {/* Only shown in account context ("Il tuo account") — outside it,
              the "Inizia Ora" pill button below is the single CTA to
              /generate; this text link used to duplicate it. */}
          {isAccountContext && (
            <a
              href={generateHref}
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
            >
              {generateLabel}
            </a>
          )}
          <a
            href="/tailor"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            {tailorLabel}
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Log in — for a returning user with an existing account, not
              already covered by the "Il tuo account" link shown when
              isAccountContext is true (they're already signed in there). */}
          {!isAccountContext && (
            <a
              href="/login"
              className="hidden sm:inline-block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {lang === 'en' ? 'Log in / Sign up' : 'Accedi/Registrati'}
            </a>
          )}

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'it' : 'en')}
            className="text-xs font-semibold px-2.5 py-1 rounded-md border border-border/60 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-200 tracking-wide"
          >
            {lang === 'en' ? 'IT' : 'EN'}
          </button>

          {/* Theme toggle */}
          <ThemeToggle className="p-1.5 rounded-md border border-border/60 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-200" />

          {/* Get started button (desktop) — redundant with the "Il tuo
              account" nav link above when already in an account context */}
          {!isAccountContext && (
            <a
              href="/generate"
              className="hidden md:inline-flex items-center px-4 py-1.5 rounded-lg bg-primary/15 border border-primary/30 hover:bg-primary/25 hover:border-primary/50 text-primary text-sm font-medium transition-all duration-200"
            >
              {lang === 'en' ? 'Get Started' : 'Inizia Ora'}
            </a>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 border-b border-border/60 px-6 py-5 flex flex-col gap-5">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href={generateHref}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary/15 border border-primary/30 text-primary text-sm font-semibold"
            onClick={() => setMobileOpen(false)}
          >
            {generateLabel}
          </a>
          <a
            href="/tailor"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {tailorLabel}
          </a>
          {!isAccountContext && (
            <a
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {lang === 'en' ? 'Log in / Sign up' : 'Accedi/Registrati'}
            </a>
          )}
          <ThemeToggle className="self-start flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors" />
        </div>
      )}
    </nav>
  )
}
