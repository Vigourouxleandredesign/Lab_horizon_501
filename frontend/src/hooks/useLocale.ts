import { useCallback, useEffect, useState } from 'react'
import type { Locale } from '../i18n/home'

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

export function useLocale() {
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

  return { locale, setLocale, toggleLocale }
}
