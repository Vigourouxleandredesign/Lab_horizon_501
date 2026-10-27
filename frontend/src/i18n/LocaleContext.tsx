import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LocaleContext } from '../hooks/useLocale'
import type { Locale } from './home'

const STORAGE_KEY = 'lab-horizon-locale'

function readStoredLocale(): Locale {
  try {
    const v = sessionStorage.getItem(STORAGE_KEY)
    if (v === 'fr' || v === 'en') return v
  } catch {
    /* ignore */
  }
  return 'fr'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale())

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* ignore */
    }
    document.documentElement.lang = locale === 'fr' ? 'fr-FR' : 'en'
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === 'fr' ? 'en' : 'fr'))
  }, [])

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale }),
    [locale, setLocale, toggleLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
