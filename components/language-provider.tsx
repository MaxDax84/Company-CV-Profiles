'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
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
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
