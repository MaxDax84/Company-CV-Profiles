'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown, Coins } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'
import { BLOG_CATEGORIES } from '@/lib/blog-posts'
import AccountAvatarMenu from './account-avatar-menu'
import ThemeToggle from './theme-toggle'

type SectionKey = 'menu' | 'blog' | 'settings'

// Top-level row that reveals its own items as a second level — hovering
// opens it (mouse users), and it also toggles on click so it works on
// touch, where hover never fires. Only one section stays open at a time.
function SectionRow({
  label,
  active,
  onOpen,
  onToggle,
  children,
}: {
  label: string
  active: boolean
  onOpen: () => void
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div onMouseEnter={onOpen}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-foreground/[0.05] transition-colors"
      >
        {label}
        <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform duration-200', active && 'rotate-180')} />
      </button>
      {active && <div className="pb-1">{children}</div>}
    </div>
  )
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openSection, setOpenSection] = useState<SectionKey | null>(null)
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
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
        setOpenSection(null)
      }
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
  // Was invisible outside Account → Crediti, so an action could hit
  // "insufficient credits" as a surprise — see the UX audit. Re-fetched on
  // every route change and tab-focus (not just on mount) so it stays
  // reasonably fresh after a spend elsewhere without needing a shared
  // global store just for this one number.
  const [credits, setCredits] = useState<number | null>(null)
  useEffect(() => {
    const supabase = createBrowserSupabaseClient()

    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      setIsLoggedIn(!!data.user)
      if (data.user) {
        setAvatarLabel(data.user.email ?? '')
        const [{ data: settings }, { data: accountCredits }] = await Promise.all([
          supabase.from('account_settings').select('avatar_url').eq('user_id', data.user.id).maybeSingle(),
          supabase.from('account_credits').select('credits').eq('user_id', data.user.id).maybeSingle(),
        ])
        setAvatarUrl((settings?.avatar_url as string | undefined) ?? null)
        setCredits((accountCredits?.credits as number | undefined) ?? null)
      }
    }
    loadUser()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user)
      if (!session?.user) {
        setAvatarUrl(null)
        setAvatarLabel('')
        setCredits(null)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [pathname])

  useEffect(() => {
    function onFocus() {
      if (document.visibilityState !== 'visible') return
      const supabase = createBrowserSupabaseClient()
      supabase.auth.getUser().then(({ data }) => {
        if (!data.user) return
        supabase.from('account_credits').select('credits').eq('user_id', data.user.id).maybeSingle()
          .then(({ data: row }) => setCredits((row?.credits as number | undefined) ?? null))
      })
    }
    document.addEventListener('visibilitychange', onFocus)
    return () => document.removeEventListener('visibilitychange', onFocus)
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
    { href: href('#pricing'), label: t.pricing },
    { href: href('#chi-siamo'), label: (t as { aboutUs?: string }).aboutUs ?? 'Chi siamo' },
    { href: href('#faq'), label: t.faq },
  ]

  // A signed-in visitor (anywhere on the site, not just on /account or
  // /tailor) sees the account-aware nav treatment — showing the generic
  // "Try Free" CTA aimed at brand-new anonymous visitors would be redundant
  // once they already have an account.
  const isAccountContext = isLoggedIn === true

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
        {/* Logo only, on the left. */}
        <a href="/" className="flex items-center gap-2 group">
          {/* eslint-disable-next-line @next/next/no-img-element -- small fixed-size mark, same as the avatar treatment elsewhere */}
          <img src="/icon.png" alt="" className="w-8 h-8 rounded-lg" />
          <span className="font-heading font-bold text-lg tracking-tight">
            Jobli
          </span>
        </a>

        {/* Right side: CTA/avatar, then the hamburger menu — the single
            entry point for every nav item, Blog category, and setting (see
            the dropdown below). Every link that used to live in a separate
            desktop bar / mobile panel now lives in this one menu, at every
            breakpoint. Signed-out visitors always keep the "Get Started"
            CTA in view (never hidden behind the menu, since it's the whole
            point of the page); signed-in visitors get the avatar menu
            instead — either way it sits to the left of the hamburger. */}
        <div className="flex items-center gap-3">
          {!isAccountContext && (
            <a
              href="/start"
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent-cyan hover:bg-accent-cyan/90 text-accent-cyan-foreground text-sm font-semibold transition-all duration-200"
            >
              {lang === 'en' ? 'Get Started' : 'Inizia Ora'}
            </a>
          )}

          {isAccountContext && (
            <>
              {credits !== null && (
                <a
                  href="/account?tab=credits"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 hover:border-primary/50 text-sm font-semibold text-foreground transition-all duration-200"
                  title={lang === 'en' ? 'Your credit balance' : 'Il tuo saldo crediti'}
                >
                  <Coins className="w-3.5 h-3.5 text-primary" />
                  {credits}
                </a>
              )}
              <AccountAvatarMenu avatarUrl={avatarUrl} displayName={avatarLabel} />
            </>
          )}

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => {
                setMenuOpen((v) => !v)
                setOpenSection(null)
              }}
              aria-label={lang === 'en' ? 'Toggle menu' : 'Apri il menu'}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {menuOpen && (
            <div
              className="absolute top-full right-0 mt-2 w-64 max-w-[85vw] rounded-2xl border border-border bg-background shadow-2xl z-50 overflow-hidden"
              onMouseLeave={() => setOpenSection(null)}
            >
              <div className="max-h-[75vh] overflow-y-auto py-1.5">
                <SectionRow
                  label={lang === 'en' ? 'Menu' : 'Menu'}
                  active={openSection === 'menu'}
                  onOpen={() => setOpenSection('menu')}
                  onToggle={() => setOpenSection((v) => (v === 'menu' ? null : 'menu'))}
                >
                  {menuLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block pl-7 pr-4 py-2 text-sm text-foreground hover:bg-foreground/[0.05] transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </SectionRow>

                <div className="my-1 border-t border-border" />
                <SectionRow
                  label="Blog"
                  active={openSection === 'blog'}
                  onOpen={() => setOpenSection('blog')}
                  onToggle={() => setOpenSection((v) => (v === 'blog' ? null : 'blog'))}
                >
                  <a
                    href="/blog"
                    onClick={() => setMenuOpen(false)}
                    className="block pl-7 pr-4 py-2 text-sm font-semibold hover:bg-foreground/[0.05] transition-colors"
                    style={{ color: 'var(--primary)' }}
                  >
                    {lang === 'en' ? 'All articles' : 'Tutti gli articoli'}
                  </a>
                  {BLOG_CATEGORIES.map((category) => (
                    <a
                      key={category}
                      href={`/blog?category=${encodeURIComponent(category)}`}
                      onClick={() => setMenuOpen(false)}
                      className="block pl-7 pr-4 py-2 text-sm text-foreground hover:bg-foreground/[0.05] transition-colors"
                    >
                      {category}
                    </a>
                  ))}
                </SectionRow>

                <div className="my-1 border-t border-border" />
                <SectionRow
                  label={lang === 'en' ? 'Settings' : 'Impostazioni'}
                  active={openSection === 'settings'}
                  onOpen={() => setOpenSection('settings')}
                  onToggle={() => setOpenSection((v) => (v === 'settings' ? null : 'settings'))}
                >
                  <div className="flex items-center justify-between pl-7 pr-4 py-2">
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
                  <div className="flex items-center justify-between pl-7 pr-4 py-2">
                    <span className="text-sm text-foreground">{lang === 'en' ? 'Theme' : 'Tema'}</span>
                    <ThemeToggle className="p-1.5 rounded-md border border-border/60 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-200" />
                  </div>
                </SectionRow>

                {!isAccountContext && (
                  <>
                    <div className="my-1 border-t border-border" />
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
        </div>
      </div>
    </nav>
  )
}

