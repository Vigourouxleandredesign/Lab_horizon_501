import type { Locale } from './home'

/** Libellés par entrée et par zone d’affichage. */
export type SiteNavItemLabels = {
  headerDesktop?: string
  bottom?: string
}

export const siteNavCopy = {
  fr: {
    items: {
      home: { headerDesktop: 'Accueil', bottom: 'Accueil' },
      publications: { headerDesktop: 'Recherche', bottom: 'Recherche' },
      researchers: { headerDesktop: 'Recherche UNC', bottom: 'Recherche UNC' },
      about: { headerDesktop: 'À propos' },
      categories: { headerDesktop: 'Catégories', bottom: 'Catégories' },
      account: { headerDesktop: 'Compte', bottom: 'Compte' },
    },
    researchersAccess: 'Chercheurs',
    aria: {
      mainNav: 'Navigation principale',
      quickNav: 'Navigation rapide',
      researchersAccess: 'Espace chercheur',
    },
  },
  en: {
    items: {
      home: { headerDesktop: 'Home', bottom: 'Home' },
      publications: { headerDesktop: 'Search', bottom: 'Search' },
      researchers: { headerDesktop: 'UNC research', bottom: 'UNC research' },
      about: { headerDesktop: 'About' },
      categories: { headerDesktop: 'Categories', bottom: 'Categories' },
      account: { headerDesktop: 'Account', bottom: 'Account' },
    },
    researchersAccess: 'Researchers',
    aria: {
      mainNav: 'Main navigation',
      quickNav: 'Quick navigation',
      researchersAccess: 'Researcher space',
    },
  },
} as const satisfies Record<
  Locale,
  {
    items: Record<string, SiteNavItemLabels>
    researchersAccess: string
    aria: { mainNav: string; quickNav: string; researchersAccess: string }
  }
>

export function siteNavLabel(
  locale: Locale,
  itemId: keyof (typeof siteNavCopy)['fr']['items'],
  zone: 'headerDesktop' | 'bottom',
): string {
  const entry = siteNavCopy[locale].items[itemId] as SiteNavItemLabels
  if (zone === 'headerDesktop') {
    return entry.headerDesktop ?? entry.bottom ?? ''
  }
  return entry.bottom ?? entry.headerDesktop ?? ''
}
