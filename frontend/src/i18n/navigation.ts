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
      researchers: { headerDesktop: 'Chercheurs', bottom: 'Chercheurs' },
      about: { headerDesktop: 'À propos' },
      categories: { headerDesktop: 'Catégories', bottom: 'Catégories' },
      account: { headerDesktop: 'Compte' },
    },
    login: 'Connexion',
    researcherTab: 'Vous êtes chercheur ?',
    aria: {
      mainNav: 'Navigation principale',
      quickNav: 'Navigation rapide',
    },
  },
  en: {
    items: {
      home: { headerDesktop: 'Home', bottom: 'Home' },
      publications: { headerDesktop: 'Search', bottom: 'Search' },
      researchers: { headerDesktop: 'Researchers', bottom: 'Researchers' },
      about: { headerDesktop: 'About' },
      categories: { headerDesktop: 'Categories', bottom: 'Categories' },
      account: { headerDesktop: 'Account' },
    },
    login: 'Sign in',
    researcherTab: 'Are you a researcher?',
    aria: {
      mainNav: 'Main navigation',
      quickNav: 'Quick navigation',
    },
  },
} as const satisfies Record<
  Locale,
  {
    items: Record<string, SiteNavItemLabels>
    login: string
    researcherTab: string
    aria: { mainNav: string; quickNav: string }
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
