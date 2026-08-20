'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Language } from '@/lib/i18n'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'it',
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('it')

  // Keeps the <html lang> attribute (set to 'it' server-side, see
  // app/layout.tsx) in sync with the toggle — screen readers and browser
  // translate prompts read this, not React state.
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
