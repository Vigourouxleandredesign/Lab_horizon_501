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
    openCta: 'Ouvrir',
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
    openCta: 'Open',
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
    cancel: 'Annuler',
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
    cancel: 'Cancel',
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
      'Mode démo : les modifications ci-dessous sont préparées côté interface, en attendant leur branchement à la plateforme institutionnelle.',
    language: 'Langue',
    logout: 'Déconnexion',

    notReadyBanner:
      'Fonctionnalité bientôt disponible : cette action sera connectée au serveur avec la plateforme institutionnelle. Rien n’a été modifié pour l’instant.',

    identitySection: {
      title: 'Identité',
      firstNameLabel: 'Prénom',
      lastNameLabel: 'Nom',
      submit: 'Enregistrer l’identité',
    },
    emailSection: {
      title: 'Adresse email',
      currentLabel: 'Adresse actuelle',
      newLabel: 'Nouvelle adresse email',
      passwordLabel: 'Mot de passe actuel (confirmation)',
      submit: 'Changer l’adresse email',
      errorInvalidEmail: 'Merci de saisir une adresse email valide.',
      errorMissingPassword: 'Le mot de passe actuel est requis pour changer d’adresse email.',
    },
    passwordSection: {
      title: 'Mot de passe',
      currentLabel: 'Mot de passe actuel',
      newLabel: 'Nouveau mot de passe',
      confirmLabel: 'Confirmer le nouveau mot de passe',
      submit: 'Changer le mot de passe',
      errorTooShort: 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
      errorMismatch: 'Les deux mots de passe ne correspondent pas.',
      errorMissingCurrent: 'Le mot de passe actuel est requis.',
    },
    orcidSection: {
      title: 'Identifiant ORCID',
      label: 'ORCID',
      placeholder: '0000-0000-0000-0000',
      note: 'Format attendu : 0000-0000-0000-0000.',
      submit: 'Enregistrer l’ORCID',
      errorFormat: 'Format ORCID invalide (attendu : 0000-0000-0000-0000).',
    },
    pseudonymSection: {
      title: 'Pseudonyme',
      label: 'Pseudonyme',
      placeholder: 'Non défini',
      note: 'Modifiable uniquement par un administrateur — fonctionnalité à venir.',
    },
    dangerSection: {
      title: 'Suppression du compte',
      body:
        'Conformément au RGPD, vous pouvez demander la suppression définitive de votre compte et de vos données personnelles. Cette action est irréversible.',
      confirmLabel: 'Je comprends que cette action est irréversible.',
      submit: 'Supprimer mon compte',
      confirmPrompt:
        'Confirmer la suppression définitive de votre compte ? Cette action ne peut pas être annulée.',
    },
  },
  en: {
    metaTitle: 'Your account, Lab Horizon',
    title: 'Your account',
    identity: 'Identity',
    demoNote:
      'Demo mode: the changes below are prepared on the interface side, pending their connection to the institutional platform.',
    language: 'Language',
    logout: 'Sign out',

    notReadyBanner:
      'Coming soon: this action will be connected to the server with the institutional platform. Nothing was changed for now.',

    identitySection: {
      title: 'Identity',
      firstNameLabel: 'First name',
      lastNameLabel: 'Last name',
      submit: 'Save identity',
    },
    emailSection: {
      title: 'Email address',
      currentLabel: 'Current address',
      newLabel: 'New email address',
      passwordLabel: 'Current password (confirmation)',
      submit: 'Change email address',
      errorInvalidEmail: 'Please enter a valid email address.',
      errorMissingPassword: 'Your current password is required to change your email address.',
    },
    passwordSection: {
      title: 'Password',
      currentLabel: 'Current password',
      newLabel: 'New password',
      confirmLabel: 'Confirm new password',
      submit: 'Change password',
      errorTooShort: 'The new password must be at least 8 characters long.',
      errorMismatch: 'The two passwords do not match.',
      errorMissingCurrent: 'Your current password is required.',
    },
    orcidSection: {
      title: 'ORCID identifier',
      label: 'ORCID',
      placeholder: '0000-0000-0000-0000',
      note: 'Expected format: 0000-0000-0000-0000.',
      submit: 'Save ORCID',
      errorFormat: 'Invalid ORCID format (expected: 0000-0000-0000-0000).',
    },
    pseudonymSection: {
      title: 'Pseudonym',
      label: 'Pseudonym',
      placeholder: 'Not set',
      note: 'Editable only by an administrator — coming soon.',
    },
    dangerSection: {
      title: 'Account deletion',
      body:
        'Under GDPR, you can request the permanent deletion of your account and personal data. This action is irreversible.',
      confirmLabel: 'I understand this action is irreversible.',
      submit: 'Delete my account',
      confirmPrompt:
        'Confirm permanent deletion of your account? This action cannot be undone.',
    },
  },
} as const satisfies Record<Locale, Record<string, unknown>>
