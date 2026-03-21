'use client'

import { useState, useEffect } from 'react'
import { Globe, Menu, X } from 'lucide-react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { lang, setLang } = useLanguage()
  const t = translations[lang].nav

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { href: '#services', label: t.services },
    { href: '#portfolio', label: t.portfolio },
    { href: '#pricing', label: t.pricing },
    { href: '#contact', label: t.contact },
  ]

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border/60 shadow-lg shadow-black/20'
          : 'bg-transparent',
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center transition-all group-hover:border-primary/60 group-hover:bg-primary/25">
            <Globe className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Go<span className="text-primary">On</span>Web
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
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'it' : 'en')}
            className="text-xs font-semibold px-2.5 py-1 rounded-md border border-border/60 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-200 tracking-wide"
          >
            {lang === 'en' ? 'IT' : 'EN'}
          </button>

          {/* Get started button (desktop) */}
          <a
            href="#contact"
            className="hidden md:inline-flex items-center px-4 py-1.5 rounded-lg bg-primary/15 border border-primary/30 hover:bg-primary/25 hover:border-primary/50 text-primary text-sm font-medium transition-all duration-200"
          >
            {lang === 'en' ? 'Get Started' : 'Inizia Ora'}
          </a>

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
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border/60 px-6 py-5 flex flex-col gap-5">
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
            href="#contact"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary/15 border border-primary/30 text-primary text-sm font-medium"
            onClick={() => setMobileOpen(false)}
          >
            {lang === 'en' ? 'Get Started' : 'Inizia Ora'}
          </a>
        </div>
      )}
    </nav>
  )
}
