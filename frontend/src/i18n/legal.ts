import type { Locale } from './home'

export type LegalKind = 'mentions-legales' | 'confidentialite' | 'cookies'

export const legalCopy = {
  fr: {
    'mentions-legales': {
      title: 'Mentions légales',
      body:
        'Lab Horizon est une initiative de valorisation de la recherche de l’Université de la Nouvelle-Calédonie. Éditeur : Université de la Nouvelle-Calédonie. Les coordonnées complètes de l’éditeur et de l’hébergeur seront publiées avant la mise en production.',
    },
    confidentialite: {
      title: 'Politique de confidentialité',
      body:
        'Lab Horizon traite les données personnelles dans le respect de la réglementation applicable. Cette page décrira les finalités du traitement, les durées de conservation et vos droits d’accès, de rectification et de suppression.',
    },
    cookies: {
      title: 'Politique cookies',
      body:
        'Lab Horizon utilise des cookies strictement nécessaires au fonctionnement du site et, le cas échéant, des cookies de mesure d’audience anonymisés. Vous pourrez gérer vos préférences depuis cette page.',
    },
    backHome: "Retour à l'accueil",
  },
  en: {
    'mentions-legales': {
      title: 'Legal notice',
      body:
        'Lab Horizon is an initiative to showcase research at the University of New Caledonia. Publisher: University of New Caledonia. Full publisher and hosting details will be published before go-live.',
    },
    confidentialite: {
      title: 'Privacy policy',
      body:
        'Lab Horizon processes personal data in compliance with applicable regulations. This page will describe processing purposes, retention periods and your rights of access, rectification and deletion.',
    },
    cookies: {
      title: 'Cookie policy',
      body:
        'Lab Horizon uses cookies strictly necessary for the site to work and, where applicable, anonymised audience measurement cookies. You will be able to manage your preferences from this page.',
    },
    backHome: 'Back to home',
  },
} as const satisfies Record<Locale, Record<LegalKind | 'backHome', unknown>>

export function legalContent(kind: LegalKind, locale: Locale) {
  return legalCopy[locale][kind]
}
