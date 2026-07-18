import { useMemo } from 'react'
import { getSiteNavItems, type NavSurface } from '../data/siteNavigation'
import { useAuth } from '../auth/AuthContext'
import { useLocale } from './useLocale'

/** Entrées de navigation — « Compte » masqué tant que non connecté (doc 07 §9). */
export function useSiteNavigation(surface: NavSurface) {
  const { locale } = useLocale()
  const { status } = useAuth()

  return useMemo(() => {
    const items = getSiteNavItems(locale, surface)
    if (status === 'authenticated') return items
    return items.filter((item) => item.id !== 'account')
  }, [locale, surface, status])
}
