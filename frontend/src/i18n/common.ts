import type { Locale } from './home'

export const commonCopy = {
  fr: {
    openDocument: 'Ouvrir le document',
    viewDetail: 'Voir la fiche',
    backHome: "Retour à l'accueil",
    footer: {
      legal: 'Mentions légales',
      privacy: 'Confidentialité',
      cookies: 'Cookies',
    },
    langToggle: (current: Locale) =>
      current === 'fr' ? 'Passer en anglais' : 'Switch to French',
    langMenuLabel: 'Langue',
    langFr: 'Français',
    langEn: 'English',
    visitSite: 'Voir le site',
  },
  en: {
    openDocument: 'Open document',
    viewDetail: 'View details',
    backHome: 'Back to home',
    footer: {
      legal: 'Legal notice',
      privacy: 'Privacy',
      cookies: 'Cookies',
    },
    langToggle: (current: Locale) =>
      current === 'fr' ? 'Passer en anglais' : 'Switch to French',
    langMenuLabel: 'Language',
    langFr: 'Français',
    langEn: 'English',
    visitSite: 'Visit website',
  },
} as const satisfies Record<Locale, Record<string, unknown>>
