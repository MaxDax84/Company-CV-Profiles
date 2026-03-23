'use client'

import { useLanguage } from './language-provider'

export default function TaglineStrip() {
  const { lang } = useLanguage()

  return (
    <div className="relative border-y border-primary/15 bg-primary/4 py-5 overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-40" />
      <p className="relative z-10 text-center text-sm sm:text-base font-semibold text-foreground tracking-wide">
        {lang === 'it'
          ? 'Tu ci dai il PDF, noi ti diamo il link. Al resto (dominio, server, codice) pensiamo noi.'
          : 'You give us the PDF, we give you the link. We handle the rest — domain, server, code.'}
      </p>
    </div>
  )
}
