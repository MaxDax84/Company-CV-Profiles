'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import HowItWorksModal from './how-it-works-modal'

export default function FinalCtaSection() {
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const { lang } = useLanguage()
  const t = translations[lang].finalCta
  const router = useRouter()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // See components/mission-section.tsx for why: a fast scroll can cross a
    // narrow, no-margin trigger zone between two observer callbacks and
    // never register, leaving the section stuck at opacity-0.
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0, rootMargin: '200px 0px 200px 0px' },
    )
    observer.observe(el)
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) setVisible(true)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="cta" ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'rgba(99, 102, 241, 0.10)' }}
      />
      <div
        className={cn(
          'relative z-10 max-w-2xl mx-auto px-6 text-center transition-all duration-700',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        )}
      >
        <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-5">
          {t.title}
        </h2>
        <p className="text-muted-foreground text-base md:text-lg mb-10 leading-relaxed">
          {t.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setModalOpen(true)}
            className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            {t.ctaPrimary}
          </button>
        </div>
      </div>

      <HowItWorksModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onProceed={() => router.push('/generate')}
      />
    </section>
  )
}
