import type { Locale } from './home'

export const categoriesPageCopy = {
  fr: {
    metaTitle: 'Domaines scientifiques, Lab Horizon',
    title: 'Domaines scientifiques',
    lead: 'Parcourez les publications par domaine de recherche UNC.',
    exploreDomain: 'Découvrir le domaine',
    allPublications: 'Toutes les publications',
    publicationsCount: (n: number) => `${n} publication${n > 1 ? 's' : ''}`,
    backHome: "Retour à l'accueil",
  },
  en: {
    metaTitle: 'Research fields, Lab Horizon',
    title: 'Research fields',
    lead: 'Browse publications by UNC research field.',
    exploreDomain: 'Explore this field',
    allPublications: 'All publications',
    publicationsCount: (n: number) => `${n} publication${n !== 1 ? 's' : ''}`,
    backHome: 'Back to home',
  },
} as const satisfies Record<Locale, Record<string, unknown>>
