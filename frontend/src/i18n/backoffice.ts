import type { Locale } from './home'

/** Libellés de la sidebar desktop / barre basse mobile backoffice (4 items fixes). */
export const backofficeNavCopy = {
  fr: {
    aria: 'Navigation espace chercheur',
    brand: 'Lab Horizon',
    items: {
      nouveautes: 'Nouveautés',
      recherche: 'Recherche',
      publications: 'Vos publications',
      profil: 'Votre compte',
    },
  },
  en: {
    aria: 'Researcher space navigation',
    brand: 'Lab Horizon',
    items: {
      nouveautes: "What's new",
      recherche: 'Search',
      publications: 'Your publications',
      profil: 'Your account',
    },
  },
} as const satisfies Record<Locale, unknown>

/** Bandeau mode démo — affiché sous le logo (plus de top bar à accrocher). */
export const backofficeShellCopy = {
  fr: {
    demoBanner:
      'Cet espace est en cours de déploiement, vos données seront synchronisées avec la plateforme institutionnelle.',
  },
  en: {
    demoBanner:
      'This space is being rolled out, your data will sync with the institutional platform.',
  },
} as const satisfies Record<Locale, unknown>

export const nouveautesPageCopy = {
  fr: {
    metaTitle: 'Nouveautés, Lab Horizon',
    title: 'Nouveautés',
    lead: 'Les publications les plus récentes de la plateforme.',
    comingSoonNote:
      'Veille personnalisée (chercheurs suivis, mots-clés) bientôt disponible — en attendant, voici les dernières publications de la plateforme.',
    loading: 'Chargement des dernières publications…',
    error: 'Impossible de charger les nouveautés.',
    empty: 'Aucune publication récente pour le moment.',
  },
  en: {
    metaTitle: "What's new, Lab Horizon",
    title: "What's new",
    lead: 'The most recent publications on the platform.',
    comingSoonNote:
      'Personalized watch (followed researchers, keywords) coming soon — in the meantime, here are the latest publications on the platform.',
    loading: 'Loading the latest publications…',
    error: 'Unable to load recent publications.',
    empty: 'No recent publication yet.',
  },
} as const satisfies Record<Locale, Record<string, unknown>>

export const backofficeSearchPageCopy = {
  fr: {
    metaTitle: 'Recherche, Lab Horizon',
    backToPublicSite: 'Retour au site public',
  },
  en: {
    metaTitle: 'Search, Lab Horizon',
    backToPublicSite: 'Back to public site',
  },
} as const satisfies Record<Locale, Record<string, unknown>>

export const publicationsPageCopy = {
  fr: {
    metaTitle: 'Vos publications, Lab Horizon',
    title: 'Vos publications',
    lead: 'Vos travaux publiés sur la plateforme et leurs actions.',
    newPublication: '+ Nouvelle publication',
    stats: {
      total: 'Publications',
      thisYear: 'Publiées cette année',
      comingSoon: 'Statuts (brouillon/publié) et vues — bientôt disponibles',
    },
    loading: 'Chargement de vos publications…',
    error: 'Impossible de charger vos publications.',
    empty: 'Vous n’avez pas encore de publication. Ajoutez-en une !',
    reviewCta: 'Valider la vulgarisation',
    editCta: 'Modifier',
    deleteCta: 'Supprimer',
    deleteConfirm: 'Supprimer définitivement cette publication ?',
    deleting: 'Suppression…',
    scanLimitNote:
      'Liste calculée sur les 50 publications les plus récentes de la plateforme (contournement en attendant un filtre back dédié).',
  },
  en: {
    metaTitle: 'Your publications, Lab Horizon',
    title: 'Your publications',
    lead: 'Your published work on the platform and its actions.',
    newPublication: '+ New publication',
    stats: {
      total: 'Publications',
      thisYear: 'Published this year',
      comingSoon: 'Statuses (draft/published) and views — coming soon',
    },
    loading: 'Loading your publications…',
    error: 'Unable to load your publications.',
    empty: 'You don’t have any publication yet. Add one!',
    reviewCta: 'Review plain-language version',
    editCta: 'Edit',
    deleteCta: 'Delete',
    deleteConfirm: 'Permanently delete this publication?',
    deleting: 'Deleting…',
    scanLimitNote:
      'List computed from the 50 most recent platform publications (workaround pending a dedicated back-end filter).',
  },
} as const satisfies Record<Locale, Record<string, unknown>>

export const newPublicationPageCopy = {
  fr: {
    metaTitle: 'Nouvelle publication, Lab Horizon',
    title: 'Nouvelle publication',
    lead: 'Déposez le titre, un résumé et le PDF de votre travail.',
    fields: {
      titre: 'Titre',
      description: 'Description (optionnel)',
      pdf: 'PDF (optionnel, 20 Mo max)',
    },
    submit: 'Publier',
    submitting: 'Envoi en cours…',
    errorPdfType: 'Le fichier doit être un PDF.',
    errorPdfSize: 'Le PDF dépasse 20 Mo.',
    errorGeneric: 'Impossible de créer la publication, réessayez.',
  },
  en: {
    metaTitle: 'New publication, Lab Horizon',
    title: 'New publication',
    lead: 'Add a title, a summary, and the PDF of your work.',
    fields: {
      titre: 'Title',
      description: 'Description (optional)',
      pdf: 'PDF (optional, 20 MB max)',
    },
    submit: 'Publish',
    submitting: 'Sending…',
    errorPdfType: 'The file must be a PDF.',
    errorPdfSize: 'The PDF exceeds 20 MB.',
    errorGeneric: 'Unable to create the publication, please try again.',
  },
} as const satisfies Record<Locale, Record<string, unknown>>

export const editPublicationPageCopy = {
  fr: {
    metaTitle: 'Modifier la publication, Lab Horizon',
    title: 'Modifier la publication',
    fields: {
      titre: 'Titre',
      description: 'Description',
    },
    submit: 'Enregistrer',
    submitting: 'Enregistrement…',
    loading: 'Chargement…',
    error: 'Impossible de charger cette publication.',
    errorGeneric: 'Impossible d’enregistrer les modifications, réessayez.',
  },
  en: {
    metaTitle: 'Edit publication, Lab Horizon',
    title: 'Edit publication',
    fields: {
      titre: 'Title',
      description: 'Description',
    },
    submit: 'Save',
    submitting: 'Saving…',
    loading: 'Loading…',
    error: 'Unable to load this publication.',
    errorGeneric: 'Unable to save changes, please try again.',
  },
} as const satisfies Record<Locale, Record<string, unknown>>

export const accountSettingsPageCopy = {
  fr: {
    metaTitle: 'Votre compte, Lab Horizon',
    title: 'Votre compte',
    identity: 'Identité',
    demoNote:
      'Mode démo : profil en lecture seule, la modification arrivera avec la plateforme institutionnelle.',
    language: 'Langue',
    orcidTitle: 'ORCID',
    orcidNote:
      'La liaison ORCID se gère depuis l’espace administrateur en attendant son arrivée ici.',
    logout: 'Déconnexion',
  },
  en: {
    metaTitle: 'Your account, Lab Horizon',
    title: 'Your account',
    identity: 'Identity',
    demoNote:
      'Demo mode: read-only profile, editing will arrive with the institutional platform.',
    language: 'Language',
    orcidTitle: 'ORCID',
    orcidNote: 'ORCID linking is managed from the admin area until it lands here.',
    logout: 'Sign out',
  },
} as const satisfies Record<Locale, Record<string, unknown>>
