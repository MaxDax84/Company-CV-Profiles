'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { useLanguage } from './language-provider'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const { lang } = useLanguage()
  const t = translations[lang].contact
  const f = t.form

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      if (res.ok) {
        setStatus('success')
        setName('')
        setEmail('')
        setMessage('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-secondary/60 border border-border/60 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:bg-secondary/80 transition-all duration-200'

  return (
    <section id="contact" ref={ref} className="relative py-28 md:py-36 overflow-hidden">
      {/* Orb */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — text */}
          <div
            className={cn(
              'transition-all duration-700',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            )}
          >
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.18em] mb-4">
              {t.sectionLabel}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">{t.title}</h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              {t.subtitle}
            </p>

            {/* Quick info */}
            <div className="space-y-4">
              {[
                {
                  icon: '⚡',
                  label: lang === 'en' ? 'Fast turnaround' : 'Consegna rapida',
                  desc: lang === 'en' ? '5 business days for delivery' : '5 giorni lavorativi per la consegna',
                },
                {
                  icon: '🎨',
                  label: lang === 'en' ? 'Fully custom' : 'Completamente personalizzato',
                  desc: lang === 'en' ? 'You choose every detail' : 'Scegli ogni dettaglio',
                },
                {
                  icon: '💬',
                  label: lang === 'en' ? 'Personal follow-up' : 'Seguito personale',
                  desc: lang === 'en' ? 'We stay in touch throughout' : 'Rimaniamo in contatto durante tutto il processo',
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold mb-0.5">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div
            className={cn(
              'transition-all duration-700',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            )}
            style={{ transitionDelay: '150ms' }}
          >
            <div className="rounded-2xl border border-border/50 bg-card/60 p-8">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                  <p className="font-semibold text-lg">{f.success}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      {f.name}
                    </label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      placeholder={f.namePlaceholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      {f.email}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={f.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      {f.message}
                    </label>
                    <textarea
                      required
                      minLength={10}
                      rows={5}
                      placeholder={f.messagePlaceholder}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={cn(inputClass, 'resize-none')}
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {f.error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        {f.sending}
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {f.submit}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
