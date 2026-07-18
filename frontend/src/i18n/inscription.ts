import type { Locale } from './home'

export const inscriptionCopy = {
  fr: {
    metaTitle: 'Créer un compte — Lab Horizon',
    title: 'Créer un compte',
    whyTitle: 'Pourquoi créer un compte ?',
    whyLead:
      'Lab Horizon relie chercheurs, institutions et grand public. Un compte vous donne les outils pour suivre, partager et découvrir — sans frais.',
    benefits: [
      {
        title: 'Suivez ce qui compte pour vous',
        body: 'Actualité sur les domaines et les chercheurs que vous souhaitez suivre, directement dans votre espace.',
      },
      {
        title: 'Gagnez en visibilité',
        body: 'Rendez accessible au grand public la vulgarisation de vos travaux déjà publics, en complément de vos publications scientifiques.',
      },
      {
        title: 'Recherche unifiée',
        body: "Accédez à des recherches d'articles sur plusieurs bases de données en même temps, depuis une seule interface.",
      },
    ],
    freeBadge: 'Et surtout : tout est totalement',
    freeHighlight: 'GRATUIT',
    formTitle: 'Commencer maintenant',
    formLead: 'Quelques informations suffisent pour activer votre espace.',
    fields: {
      name: 'Nom complet',
      email: 'E-mail professionnel ou personnel',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
    },
    submit: 'Créer mon compte',
    hasAccount: 'Vous avez déjà un compte ?',
    signIn: 'Se connecter',
    backHome: "Retour à l'accueil",
  },
  en: {
    metaTitle: 'Create an account — Lab Horizon',
    title: 'Create an account',
    whyTitle: 'Why create an account?',
    whyLead:
      'Lab Horizon connects researchers, institutions and the public. An account gives you tools to follow, share and discover — at no cost.',
    benefits: [
      {
        title: 'Follow what matters to you',
        body: 'Updates on the fields and researchers you want to follow, right in your personal space.',
      },
      {
        title: 'Increase your visibility',
        body: 'Make plain-language summaries of your already public work accessible to everyone, alongside your scientific publications.',
      },
      {
        title: 'Unified search',
        body: 'Search for articles across multiple databases at once, from a single interface.',
      },
    ],
    freeBadge: 'Best of all: everything is completely',
    freeHighlight: 'FREE',
    formTitle: 'Get started',
    formLead: 'Just a few details to activate your space.',
    fields: {
      name: 'Full name',
      email: 'Professional or personal email',
      password: 'Password',
      confirmPassword: 'Confirm password',
    },
    submit: 'Create my account',
    hasAccount: 'Already have an account?',
    signIn: 'Sign in',
    backHome: 'Back to home',
  },
} as const satisfies Record<Locale, Record<string, unknown>>
