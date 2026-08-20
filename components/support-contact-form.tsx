'use client'

import { useRef, useState } from 'react'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { useLanguage } from './language-provider'
import { cn } from '@/lib/utils'
import TurnstileWidget, { type TurnstileHandle } from '@/components/turnstile-widget'

type Status = 'idle' | 'sending' | 'success' | 'error'

const content = {
  it: {
    name: 'Nome',
    namePlaceholder: 'Il tuo nome',
    email: 'Email',
    emailPlaceholder: 'tu@email.com',
    message: 'Messaggio',
    messagePlaceholder: 'Descrivi il problema o la domanda...',
    privacy: 'Ho letto e accetto la',
    privacyLink: 'Privacy Policy',
    submit: 'Invia messaggio',
    sending: 'Invio in corso...',
    success: 'Messaggio inviato! Ti risponderemo il prima possibile.',
    error: 'Qualcosa è andato storto, riprova o scrivici direttamente.',
  },
  en: {
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'Email',
    emailPlaceholder: 'you@email.com',
    message: 'Message',
    messagePlaceholder: 'Describe the issue or question...',
    privacy: 'I have read and agree to the',
    privacyLink: 'Privacy Policy',
    submit: 'Send message',
    sending: 'Sending...',
    success: 'Message sent! We\'ll get back to you as soon as possible.',
    error: 'Something went wrong, try again or write to us directly.',
  },
}

// Small, purpose-built contact form for the /support page (name, email,
// message only) — deliberately not reusing components/contact-section.tsx,
// which is a heavier form left over from the agency-era design (file
// attachment, "existing site" field) aimed at project inquiries, not
// support questions. Both post to the same /api/contact endpoint, which
// only ever required name/email/message.
export default function SupportContactForm() {
  const { lang } = useLanguage()
  const t = content[lang]

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileHandle>(null)

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-background border border-border text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-all duration-200'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!privacyAccepted || !turnstileToken) return
    setStatus('sending')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('message', message)
    formData.append('turnstileToken', turnstileToken)

    try {
      const res = await fetch('/api/contact', { method: 'POST', body: formData })
      if (res.ok) {
        setStatus('success')
        setName('')
        setEmail('')
        setMessage('')
        setPrivacyAccepted(false)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      turnstileRef.current?.reset()
      setTurnstileToken(null)
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-border/80 bg-secondary p-8 flex flex-col items-center justify-center text-center gap-3">
        <CheckCircle2 className="w-10 h-10 text-primary" />
        <p className="font-semibold text-sm">{t.success}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border/80 bg-secondary p-6 md:p-8 space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t.name}</label>
        <input
          type="text"
          required
          minLength={2}
          placeholder={t.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t.email}</label>
        <input
          type="email"
          required
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t.message}</label>
        <textarea
          required
          minLength={10}
          rows={4}
          placeholder={t.messagePlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(inputClass, 'resize-none')}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="support-privacy"
          required
          checked={privacyAccepted}
          onChange={(e) => setPrivacyAccepted(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded accent-primary cursor-pointer shrink-0"
        />
        <label htmlFor="support-privacy" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
          {t.privacy}{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {t.privacyLink}
          </a>
        </label>
      </div>

      <div className="flex justify-center">
        <TurnstileWidget ref={turnstileRef} onVerify={setTurnstileToken} language={lang === 'it' ? 'it' : 'en'} />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="w-4 h-4" />
          {t.error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending' || !privacyAccepted || !turnstileToken}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? t.sending : (<><Send className="w-4 h-4" />{t.submit}</>)}
      </button>
    </form>
  )
}
