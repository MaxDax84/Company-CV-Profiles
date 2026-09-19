"use client";

import Navigation from '@/components/navigation'
import FaqSection from '@/components/faq-section'
import Footer from '@/components/footer'
import { useLanguage } from '@/components/language-provider'

export default function FaqPage() {
  const { lang } = useLanguage()

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />
      <div className="relative z-10 pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-6 mb-6">
          <a href="/account" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
            {lang === 'en' ? '← Back to dashboard' : '← Torna alla dashboard'}
          </a>
        </div>
        {/* This page's only heading used to be the <h2> inside FaqSection —
            a page with no <h1> at all. The heading block moves here as a
            real <h1> and FaqSection renders in `compact` mode so the title
            isn't printed twice. */}
        <div className="max-w-3xl mx-auto px-6 text-center mb-10">
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-2">
            {lang === 'en' ? 'Frequently Asked Questions' : 'Domande frequenti'}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {lang === 'en'
              ? 'Everything you need to know before you start.'
              : 'Tutto quello che c\'è da sapere prima di iniziare.'}
          </p>
        </div>
        <FaqSection compact />
      </div>
      <Footer />
    </div>
  )
}
