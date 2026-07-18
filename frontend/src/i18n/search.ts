import type { Locale } from './home'

export const searchPageCopy = {
  fr: {
    metaTitle: 'Recherche — Lab Horizon',
    placeholder: 'Mots-clés, auteur, sujet…',
    resultsLabel: 'Résultats de recherche',
    tabPublications: 'Publications',
    tabResearchers: 'Chercheurs',
    filters: {
      category: 'Catégorie',
      allCategories: 'Toutes les catégories',
      year: 'Année',
      allYears: 'Toutes les années',
      sort: 'Tri',
      sortRecent: 'Plus récentes',
      sortRelevance: 'Pertinence',
    },
    loading: 'Recherche en cours…',
    error: 'La recherche est momentanément indisponible. Réessayez plus tard.',
    empty: 'Aucun résultat — essayez d’autres mots-clés ou élargissez les filtres.',
    researcherHint:
      'La recherche par nom d’auteur affiche ses publications publiques.',
  },
  en: {
    metaTitle: 'Search — Lab Horizon',
    placeholder: 'Keywords, author, topic…',
    resultsLabel: 'Search results',
    tabPublications: 'Publications',
    tabResearchers: 'Researchers',
    filters: {
      category: 'Category',
      allCategories: 'All categories',
      year: 'Year',
      allYears: 'All years',
      sort: 'Sort',
      sortRecent: 'Most recent',
      sortRelevance: 'Relevance',
    },
    loading: 'Searching…',
    error: 'Search is temporarily unavailable. Please try again later.',
    empty: 'No results — try other keywords or broaden the filters.',
    researcherHint: 'Searching an author’s name shows their public publications.',
  },
} as const satisfies Record<Locale, Record<string, unknown>>
