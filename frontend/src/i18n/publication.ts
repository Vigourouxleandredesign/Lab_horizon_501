import type { Locale } from './home'

export const publicationPageCopy = {
  fr: {
    loading: 'Chargement de la publication…',
    error: 'Impossible de charger cette publication pour le moment. Réessayez plus tard.',
    notFound: 'Publication introuvable ou non publique.',
    bodyLabel: 'Résumé vulgarisé',
    noBody: 'Le résumé vulgarisé de cette publication arrive bientôt.',
    metaLabel: 'Informations scientifiques',
    meta: {
      what: 'Quoi',
      who: 'Qui',
      when: 'Quand',
      lab: 'Laboratoire',
    },
    sourceCta: 'Consulter la publication originale',
    pdfCta: 'Consulter le document source (PDF)',
    coversLabel: 'Aperçu du document',
    keywordsLabel: 'Mots-clés',
    relatedTitle: 'À découvrir aussi',
    backToSearch: 'Retour à la recherche',
  },
  en: {
    loading: 'Loading publication…',
    error: 'This publication cannot be loaded right now. Please try again later.',
    notFound: 'Publication not found or not public.',
    bodyLabel: 'Plain-language summary',
    noBody: 'The plain-language summary for this publication is coming soon.',
    metaLabel: 'Scientific details',
    meta: {
      what: 'What',
      who: 'Who',
      when: 'When',
      lab: 'Lab',
    },
    sourceCta: 'View the original publication',
    pdfCta: 'View the source document (PDF)',
    coversLabel: 'Document preview',
    keywordsLabel: 'Keywords',
    relatedTitle: 'You may also like',
    backToSearch: 'Back to search',
  },
} as const satisfies Record<Locale, Record<string, unknown>>
