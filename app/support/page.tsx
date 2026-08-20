"use client";

import Navigation from '@/components/navigation'
import SupportFaqSection from '@/components/support-faq-section'
import SupportContactForm from '@/components/support-contact-form'
import Footer from '@/components/footer'
import { useLanguage } from '@/components/language-provider'

export default function SupportPage() {
  const { lang } = useLanguage()

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.18em] mb-3">
            {lang === 'en' ? 'Support' : 'Supporto'}
          </p>
          <h1 className="font-heading text-2xl md:text-4xl font-bold tracking-tight mb-3">
            {lang === 'en' ? 'Technical, security, and data questions' : 'Domande tecniche, di sicurezza e sui dati'}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            {lang === 'en'
              ? "Answers about how your data is stored and deleted, how the anti-bot check works, and what happens when you close your account. Can't find what you need? Write to us below."
              : 'Risposte su come vengono conservati ed eliminati i tuoi dati, su come funziona la verifica anti-bot e su cosa succede quando chiudi il tuo account. Non trovi quello che cerchi? Scrivici qui sotto.'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-6 space-y-16">
          <SupportFaqSection />

          <div>
            <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-center mb-6">
              {lang === 'en' ? 'Still need help?' : 'Hai ancora bisogno di aiuto?'}
            </h2>
            <SupportContactForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
