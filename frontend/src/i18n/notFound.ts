import type { Locale } from './home'

export const notFoundCopy = {
  fr: {
    metaTitle: 'Page introuvable, Lab Horizon',
    title: 'Page introuvable',
    lead: 'La page que vous cherchez n’existe pas ou a été déplacée.',
    backHome: "Retour à l'accueil",
  },
  en: {
    metaTitle: 'Page not found, Lab Horizon',
    title: 'Page not found',
    lead: 'The page you are looking for does not exist or has been moved.',
    backHome: 'Back to home',
  },
} as const satisfies Record<Locale, Record<string, unknown>>
