'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'
import { BLOG_CATEGORIES } from '@/lib/blog-posts'
import AccountAvatarMenu from './account-avatar-menu'
import ThemeToggle from './theme-toggle'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{children}</p>
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { lang, setLang } = useLanguage()
  const t = translations[lang].nav
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
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
  const menuLinks = [
    { href: isHome ? '#' : '/', label: t.home },
    { href: href('#mission'), label: t.mission },
    { href: href('#services'), label: t.services },
    { href: href('#chi-siamo'), label: (t as { aboutUs?: string }).aboutUs ?? 'Chi siamo' },
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
        {/* Hamburger + logo — the single entry point for every nav item,
            Blog category, and setting (see the dropdown below). Every link
            that used to live in a separate desktop bar / mobile panel now
            lives in this one menu, at every breakpoint. */}
        <div className="relative flex items-center gap-3" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={lang === 'en' ? 'Toggle menu' : 'Apri il menu'}
            className="p-1.5 -ml-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <a href="/" className="flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element -- small fixed-size mark, same as the avatar treatment elsewhere */}
            <img src="/icon.png" alt="" className="w-8 h-8 rounded-lg" />
            <span className="font-heading font-bold text-lg tracking-tight">
              Jobli
            </span>
          </a>

          {menuOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 max-w-[85vw] rounded-2xl border border-border bg-background shadow-2xl z-50 overflow-hidden">
              <div className="max-h-[75vh] overflow-y-auto py-1.5">
                <SectionLabel>{lang === 'en' ? 'Menu' : 'Menu'}</SectionLabel>
                {menuLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-foreground hover:bg-foreground/[0.05] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}

                <div className="my-1.5 border-t border-border" />
                <SectionLabel>Blog</SectionLabel>
                <a
                  href="/blog"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold hover:bg-foreground/[0.05] transition-colors"
                  style={{ color: 'var(--primary)' }}
                >
                  {lang === 'en' ? 'All articles' : 'Tutti gli articoli'}
                </a>
                {BLOG_CATEGORIES.map((category) => (
                  <a
                    key={category}
                    href={`/blog?category=${encodeURIComponent(category)}`}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-foreground hover:bg-foreground/[0.05] transition-colors"
                  >
                    {category}
                  </a>
                ))}

                <div className="my-1.5 border-t border-border" />
                <SectionLabel>{lang === 'en' ? 'Settings' : 'Impostazioni'}</SectionLabel>
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-foreground">{lang === 'en' ? 'Language' : 'Lingua'}</span>
                  <button
                    type="button"
                    onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
                    className="w-8 py-1.5 rounded-md border border-border/60 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-200 text-xs font-semibold"
                    aria-label={lang === 'it' ? 'Switch to English' : "Passa all'italiano"}
                  >
                    {lang === 'it' ? 'EN' : 'IT'}
                  </button>
                </div>
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-foreground">{lang === 'en' ? 'Theme' : 'Tema'}</span>
                  <ThemeToggle className="p-1.5 rounded-md border border-border/60 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-200" />
                </div>

                {!isAccountContext && (
                  <>
                    <div className="my-1.5 border-t border-border" />
                    <a
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-foreground hover:bg-foreground/[0.05] transition-colors"
                    >
                      {lang === 'en' ? 'Log in / Sign up' : 'Accedi/Registrati'}
                    </a>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right side — kept minimal on purpose: everything else now lives
            in the single menu above. Signed-out visitors always keep the
            "Get Started" CTA in view (never hidden behind the menu, since
            it's the whole point of the page); signed-in visitors get the
            avatar menu instead. */}
        <div className="flex items-center gap-3">
          {!isAccountContext && (
            <a
              href="/generate"
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent-cyan hover:bg-accent-cyan/90 text-accent-cyan-foreground text-sm font-semibold transition-all duration-200"
            >
              {lang === 'en' ? 'Get Started' : 'Inizia Ora'}
            </a>
          )}

          {isAccountContext && (
            <AccountAvatarMenu avatarUrl={avatarUrl} displayName={avatarLabel} />
          )}
        </div>
      </div>
    </nav>
  )
}

