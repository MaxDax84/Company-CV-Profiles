'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'
import ThemeToggle from './theme-toggle'
import AccountAvatarMenu from './account-avatar-menu'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { lang } = useLanguage()
  const t = translations[lang].nav
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // The account/logged-in nav treatment used to be inferred purely from the
  // current path (isAccountContext = on /account or /tailor) — which meant
  // a signed-in visitor navigating anywhere else (e.g. clicking "Missione"
  // back to the homepage) saw the nav revert to the anonymous "Accedi/
  // Registrati" + "Inizia Ora" state, as if they'd been logged out, even
  // though their session was still perfectly valid. Checking the real
  // Supabase session fixes that everywhere, not just on the two pages that
  // happened to hint at it via URL.
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarLabel, setAvatarLabel] = useState('')
  useEffect(() => {
    const supabase = createBrowserSupabaseClient()

    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      setIsLoggedIn(!!data.user)
      if (data.user) {
        setAvatarLabel(data.user.email ?? '')
        const { data: settings } = await supabase
          .from('account_settings')
          .select('avatar_url')
          .eq('user_id', data.user.id)
          .maybeSingle()
        setAvatarUrl((settings?.avatar_url as string | undefined) ?? null)
      }
    }
    loadUser()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user)
      if (!session?.user) {
        setAvatarUrl(null)
        setAvatarLabel('')
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // On non-home pages, anchor links must include the path
  const href = (anchor: string) => isHome ? anchor : `/${anchor}`

  // "Come funziona" always points at the homepage section now — the
  // account area no longer has its own copy of that content (removed as
  // redundant, see components/account-tabs.tsx).
  // "Inizia Ora" lives only as the single pill button on the right (after
  // the theme toggle) — not duplicated here as a text link too.
  const links = [
    { href: isHome ? '#' : '/', label: t.home },
    { href: href('#mission'), label: t.mission },
    { href: href('#services'), label: t.services },
    { href: href('#faq'), label: t.faq },
  ]

  // A signed-in visitor (anywhere on the site, not just on /account or
  // /tailor) sees the account-aware nav treatment — showing the generic
  // "Try Free" CTA aimed at brand-new anonymous visitors would be redundant
  // once they already have an account.
  const isAccountContext = isLoggedIn === true
  const generateLabel = isAccountContext
    ? (lang === 'en' ? 'Your Account' : 'Il tuo account')
    : (t as { generate?: string }).generate ?? 'Try Free'
  const generateHref = isAccountContext ? '/account' : '/generate'

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
          {/* eslint-disable-next-line @next/next/no-img-element -- small fixed-size mark, same as the avatar treatment elsewhere */}
          <img src="/icon.png" alt="" className="w-8 h-8 rounded-lg" />
          <span className="font-heading font-bold text-lg tracking-tight">
            Jobli
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
          {/* "Il tuo account" text link removed while logged in — the
              avatar dropdown (top-right) already covers that entry point,
              so this would just be a redundant second way to the same
              place. generateLabel/generateHref are still used by the
              mobile menu button below. */}
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

          {/* Language toggle — hidden for now (re-enable later), left the
              useLanguage()/lang plumbing itself untouched. */}

          {/* Theme toggle */}
          <ThemeToggle className="p-1.5 rounded-md border border-border/60 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-200" />

          {/* Get started button (desktop) — the single "Inizia Ora", always
              right after the theme toggle. Hidden once signed in, since the
              account nav link above already covers that case. */}
          {!isAccountContext && (
            <a
              href="/generate"
              className="hidden md:inline-flex items-center px-4 py-1.5 rounded-full bg-accent-cyan hover:bg-accent-cyan/90 text-accent-cyan-foreground text-sm font-semibold transition-all duration-200"
            >
              {lang === 'en' ? 'Get Started' : 'Inizia Ora'}
            </a>
          )}

          {/* Avatar + account dropdown — rightmost element, replaces the
              old settings-gear icon that used to live inside the account
              page itself. Shown on every page once signed in, not just
              /account, since it's real session state (see isLoggedIn
              above), not a path guess. */}
          {isAccountContext && (
            <AccountAvatarMenu avatarUrl={avatarUrl} displayName={avatarLabel} />
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
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-accent-cyan text-accent-cyan-foreground text-sm font-semibold"
            onClick={() => setMobileOpen(false)}
          >
            {generateLabel}
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
