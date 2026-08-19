/** Textes page d'accueil (maquette Figma + taxonomie UNC). */

import { UNC_CATEGORIES } from '../data/categories'

export type Locale = 'fr' | 'en'

export const homeCopy = {
  fr: {
    metaTitle: 'Lab Horizon, recherche calédonienne',
    platformBadge: 'Université de la Nouvelle-Calédonie',
    hero: {
      title: 'La recherche en Nouvelle-Calédonie, accessible par tous et pour tous',
      scrollCta: 'Explorer',
    },
    search: {
      sectionLabel: 'Recherche sur Lab Horizon',
      placeholder: 'Rechercher un thème ou un sujet…',
      submit: 'Rechercher',
      advanced: 'Filtres avancés',
      advancedHint: '(catégorie, année, tri)',
    },
    categories: {
      title: 'Explorez par domaine',
      seeAll: 'Voir tout',
      pubsCount: 'publications',
    },
    uncTeams: {
      title: 'Les équipes de recherche de l’UNC',
      cta: 'Découvrir la recherche UNC',
      comingSoon: 'Site bientôt disponible',
      visitSite: 'Voir le site',
    },
    mission: {
      badge: 'NOTRE MISSION',
      title: 'Valoriser la recherche calédonienne',
      body:
        'Lab Horizon met en lumière les travaux des chercheurs affiliés à l’Université de la Nouvelle-Calédonie et de leurs partenaires, à travers les publications, la vulgarisation et une veille organisée par domaine scientifique.',
      cta: 'Découvrir qui nous sommes',
    },
    footer: {
      legal: 'Mentions légales',
      privacy: 'Confidentialité',
      cookies: 'Cookies',
      copyright: 'Lab Horizon',
    },
  },
  en: {
    metaTitle: 'Lab Horizon, New Caledonian research',
    platformBadge: 'University of New Caledonia',
    hero: {
      title: 'Research in New Caledonia, accessible by all and for all',
      scrollCta: 'Explore',
    },
    search: {
      sectionLabel: 'Search Lab Horizon',
      placeholder: 'Search a topic or theme…',
      submit: 'Search',
      advanced: 'Advanced filters',
      advancedHint: '(category, year, sort)',
    },
    categories: {
      title: 'Explore by field',
      seeAll: 'See all',
      pubsCount: 'publications',
    },
    uncTeams: {
      title: 'UNC research teams',
      cta: 'Explore UNC research',
      comingSoon: 'Website coming soon',
      visitSite: 'Visit website',
    },
    mission: {
      badge: 'OUR MISSION',
      title: 'Showcase New Caledonian research',
      body:
        'Lab Horizon highlights the work of researchers affiliated with the University of New Caledonia and their partners, through publications, plain-language summaries and field-based watchlists.',
      cta: 'Discover who we are',
    },
    footer: {
      legal: 'Legal notice',
      privacy: 'Privacy',
      cookies: 'Cookies',
      copyright: 'Lab Horizon',
    },
  },
} as const

function slidesForLocale(locale: Locale) {
  return UNC_CATEGORIES.map((c) => ({
    id: c.slug,
    label: locale === 'fr' ? c.labelFr : c.labelEn,
  }))
}

export const domainSlides = {
  fr: slidesForLocale('fr'),
  en: slidesForLocale('en'),
} as const
