'use client'

import { useEffect, useRef, useState } from 'react'
import { Gift, Unlock, Target, MessageCircleQuestion } from 'lucide-react'
import { useLanguage } from './language-provider'
import { cn } from '@/lib/utils'

// UX audit finding: the credit model was only explained inside one FAQ
// entry, easy to miss for someone deciding whether to sign up at all. This
// surfaces the same facts as a visible section instead, right after
// ServicesSection's "how it works" — pricing naturally follows process.
export default function PricingSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const { lang } = useLanguage()
  const tr = (it: string, en: string) => (lang === 'en' ? en : it)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0, rootMargin: '200px 0px 200px 0px' },
    )
    observer.observe(el)
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) setVisible(true)
    return () => observer.disconnect()
  }, [])

  const cards = [
    {
      icon: Gift,
      title: tr('3 crediti gratis alla registrazione', '3 free credits when you sign up'),
      body: tr('Nessuna carta richiesta. Bastano per provare più di una funzionalità.', 'No card required — enough to try more than one feature.'),
    },
    {
      icon: Unlock,
      title: tr('1 credito = 1 sblocco', '1 credit = 1 unlock'),
      body: tr('Scaricare un PDF o Word, generare una lettera, tradurre: ogni cosa costa 1 credito la prima volta, poi è gratis per sempre.', 'Downloading a PDF or Word file, generating a cover letter, or translating — each one costs 1 credit the first time, then it\'s free forever.'),
    },
    {
      icon: Target,
      title: tr('Adattare a un annuncio è sempre gratis', 'Tailoring to a job posting is always free'),
      body: tr('Paghi solo quando scarichi davvero il risultato, non per il tentativo.', 'You only pay when you actually download the result — never just for trying it.'),
    },
    {
      icon: MessageCircleQuestion,
      title: tr('Finiti i crediti? Richiedine altri gratis', 'Out of credits? Request more for free'),
      body: tr('Siamo in fase beta: un click nella tua area account basta per chiedere altri 10 crediti.', 'We\'re in beta: one click in your account is enough to ask for 10 more credits.'),
    },
  ]

  return (
    <section
      id="pricing"
      ref={ref}
      className="relative pt-12 pb-12 md:pt-16 md:pb-16 overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div
          className={cn(
            'text-center mb-16 transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.18em] mb-4">
            {tr('Prezzi', 'Pricing')}
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-5">
            {tr('Semplice, senza sorprese', 'Simple, no surprises')}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {tr('Siamo in fase beta: il servizio è gratuito.', "We're in beta: the service is free.")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                className={cn(
                  'rounded-2xl glass-card p-8 transition-all duration-700',
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
                )}
                style={{ transitionDelay: `${i * 100 + 150}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{card.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{card.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
