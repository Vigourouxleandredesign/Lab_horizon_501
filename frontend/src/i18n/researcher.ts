import type { Locale } from './home'

export const researcherPageCopy = {
  fr: {
    loading: 'Chargement du profil…',
    error: 'Impossible de charger ce profil pour le moment.',
    notFound: 'Profil chercheur introuvable.',
    available: 'Disponible',
    follow: 'Suivre',
    following: 'Suivi',
    publicationsTitle: 'Publications',
    noPublications: 'Aucune publication référencée pour le moment.',
    backToSearch: 'Retour à la recherche',
  },
  en: {
    loading: 'Loading profile…',
    error: 'This profile cannot be loaded right now.',
    notFound: 'Researcher profile not found.',
    available: 'Available',
    follow: 'Follow',
    following: 'Following',
    publicationsTitle: 'Publications',
    noPublications: 'No publications listed yet.',
    backToSearch: 'Back to search',
  },
} as const satisfies Record<Locale, Record<string, unknown>>
