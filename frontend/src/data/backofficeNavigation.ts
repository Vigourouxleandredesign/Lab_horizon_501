import { publicUrl } from '../lib/publicAsset'

/**
 * Modèle unique de navigation backoffice chercheur (`/compte/*`).
 * Exactement 4 entrées, partagées par la sidebar desktop et la barre basse
 * mobile — pas de 5e item, cf. plan refonte backoffice.
 */
export const BACKOFFICE_NAV_ITEM_IDS = ['nouveautes', 'recherche', 'publications', 'profil'] as const

export type BackofficeNavItemId = (typeof BACKOFFICE_NAV_ITEM_IDS)[number]

export type BackofficeNavItem = {
  id: BackofficeNavItemId
  to: string
  /** `end` évite qu'un préfixe (`/compte/publications`) active aussi les sous-routes indésirées. */
  end?: boolean
}

export const BACKOFFICE_NAV_ITEMS: readonly BackofficeNavItem[] = [
  { id: 'nouveautes', to: '/compte/nouveautes' },
  { id: 'recherche', to: '/compte/recherche' },
  { id: 'publications', to: '/compte/publications' },
  { id: 'profil', to: '/compte/profil' },
] as const

export const BACKOFFICE_NAV_ICONS: Record<BackofficeNavItemId, string> = {
  nouveautes: publicUrl('ui/sparkle.svg'),
  recherche: publicUrl('ui/nav-search.svg'),
  publications: publicUrl('ui/stat-book.svg'),
  profil: publicUrl('ui/nav-account.svg'),
}
