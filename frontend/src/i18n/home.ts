/** Textes page d’accueil — alignés maquette Figma + taxonomie UNC. */

import { UNC_CATEGORIES } from '../data/categories'

export type Locale = 'fr' | 'en'

export const homeCopy = {
  fr: {
    metaTitle: 'Lab Horizon — Recherche calédonienne',
    platformBadge: 'Plateforme de recherche scientifique',
    hero: {
      title: "Bienvenue dans l'univers de la recherche accessible à tous",
      scrollCta: 'Explorer',
    },
    search: {
      sectionLabel: 'Recherche globale',
      placeholder: 'Rechercher un thème ou un sujet…',
      submit: 'Rechercher',
      advanced: 'Filtres avancés',
      advancedHint: '(dispo · catégorie · institution)',
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
      title: 'Une communauté scientifique mondiale ancrée en Nouvelle-Calédonie',
      body:
        'Lab Horizon rassemble chercheurs, étudiants et professionnels autour d’une plateforme collaborative de partage des connaissances scientifiques.',
      cta: 'Découvrir qui nous sommes',
    },
    footer: {
      legal: 'Mentions légales',
      privacy: 'Confidentialité',
      cookies: 'Cookies',
      copyright: 'Lab Horizon',
    },
    chatFab: 'Ouvrir l’assistant Lab Horizon',
  },
  en: {
    metaTitle: 'Lab Horizon — New Caledonian research',
    platformBadge: 'Scientific research platform',
    hero: {
      title: 'Welcome to a world of research accessible to everyone',
      scrollCta: 'Explore',
    },
    search: {
      sectionLabel: 'Global search',
      placeholder: 'Search a topic or theme…',
      submit: 'Search',
      advanced: 'Advanced filters',
      advancedHint: '(availability · category · institution)',
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
      title: 'A global scientific community rooted in New Caledonia',
      body:
        'Lab Horizon brings together researchers, students and professionals around a collaborative platform for sharing scientific knowledge.',
      cta: 'Discover who we are',
    },
    footer: {
      legal: 'Legal notice',
      privacy: 'Privacy',
      cookies: 'Cookies',
      copyright: 'Lab Horizon',
    },
    chatFab: 'Open Lab Horizon assistant',
  },
} as const

function slidesForLocale(locale: Locale) {
  return UNC_CATEGORIES.map((c) => ({
    id: c.slug,
    label: locale === 'fr' ? c.labelFr : c.labelEn,
    count: c.publicationCount,
  }))
}

export const domainSlides = {
  fr: slidesForLocale('fr'),
  en: slidesForLocale('en'),
} as const
