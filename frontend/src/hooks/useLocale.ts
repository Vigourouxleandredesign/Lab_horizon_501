/**
 * Contexte de langue (objet + type) et hook de lecture `useLocale()`.
 * Le Provider vit dans i18n/LocaleContext.tsx : un fichier composant n'exporte que des composants.
 */

import { createContext, useContext } from 'react'
import type { Locale } from '../i18n/home'

export type LocaleContextValue = {
  locale: Locale
  setLocale: (next: Locale) => void
  toggleLocale: () => void
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return ctx
}
