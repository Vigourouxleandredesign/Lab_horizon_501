import type { Locale } from './home'

export const inscriptionCopy = {
  fr: {
    metaTitle: 'Créer un compte, Lab Horizon',
    title: 'Créer un compte',
    whyTitle: 'Pourquoi créer un compte ?',
    whyLead:
      'Lab Horizon met en relation chercheurs, institutions et grand public. Un compte vous permet de suivre, partager et découvrir les ressources de la plateforme, sans frais.',
    benefits: [
      {
        title: 'Suivez ce qui compte pour vous',
        body: 'Recevez l’actualité des domaines et des chercheurs que vous suivez, directement dans votre espace personnel.',
      },
      {
        title: 'Gagnez en visibilité',
        body: 'Rendez accessible au grand public la vulgarisation de vos travaux déjà publics, en complément de vos publications scientifiques.',
      },
      {
        title: 'Explorez par domaine',
        body: 'Consultez les publications de l’UNC classées par domaine scientifique, depuis une interface unique.',
      },
    ],
    freeBadge: 'L’accès à la plateforme est',
    freeHighlight: 'gratuit',
    formTitle: 'Commencer maintenant',
    formLead: 'Quelques informations suffisent pour activer votre espace.',
    fields: {
      name: 'Nom complet',
      email: 'E-mail professionnel ou personnel',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
    },
    submit: 'Créer mon compte',
    submitting: 'Création…',
    hasAccount: 'Vous avez déjà un compte ?',
    signIn: 'Se connecter',
    backHome: "Retour à l'accueil",
    passwordMismatch: 'Les mots de passe ne correspondent pas.',
    unavailable: 'Inscription indisponible pour le moment, veuillez utiliser la page de connexion.',
    demoNote:
      'L’inscription en ligne sera activée prochainement. En attendant, connectez-vous via la page de connexion.',
  },
  en: {
    metaTitle: 'Create an account, Lab Horizon',
    title: 'Create an account',
    whyTitle: 'Why create an account?',
    whyLead:
      'Lab Horizon connects researchers, institutions and the public. An account allows you to follow, share and discover platform resources, at no cost.',
    benefits: [
      {
        title: 'Follow what matters to you',
        body: 'Receive updates on the fields and researchers you follow, directly in your personal space.',
      },
      {
        title: 'Increase your visibility',
        body: 'Make plain-language summaries of your already public work accessible to everyone, alongside your scientific publications.',
      },
      {
        title: 'Explore by field',
        body: 'Browse UNC publications by scientific field from a single interface.',
      },
    ],
    freeBadge: 'Access to the platform is',
    freeHighlight: 'free of charge',
    formTitle: 'Get started',
    formLead: 'Just a few details are required to activate your space.',
    fields: {
      name: 'Full name',
      email: 'Professional or personal email',
      password: 'Password',
      confirmPassword: 'Confirm password',
    },
    submit: 'Create my account',
    submitting: 'Creating…',
    hasAccount: 'Already have an account?',
    signIn: 'Sign in',
    backHome: 'Back to home',
    passwordMismatch: 'Passwords do not match.',
    unavailable: 'Registration is unavailable for now, please use the sign-in page.',
    demoNote:
      'Online registration will be enabled soon. In the meantime, please sign in via the sign-in page.',
  },
} as const satisfies Record<Locale, Record<string, unknown>>
