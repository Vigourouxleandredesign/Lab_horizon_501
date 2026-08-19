import type { Locale } from './home'

export const connexionCopy = {
  fr: {
    metaTitle: 'Connexion, Lab Horizon',
    title: 'Connexion',
    lead: 'Accédez à votre espace chercheur pour publier et gérer votre veille.',
    demoNote: (email: string) =>
      `Mode démonstration : connectez-vous avec ${email} et un mot de passe quelconque. L’authentification institutionnelle sera activée prochainement.`,
    email: 'E-mail',
    password: 'Mot de passe',
    error: 'Identifiants invalides ou service indisponible.',
    submitting: 'Connexion…',
    submit: 'Se connecter',
    noAccount: 'Pas encore de compte ?',
    createAccount: 'Créer un compte',
    backHome: "Retour à l'accueil",
  },
  en: {
    metaTitle: 'Sign in, Lab Horizon',
    title: 'Sign in',
    lead: 'Access your researcher space to publish and manage your watchlist.',
    demoNote: (email: string) =>
      `Demo mode: sign in with ${email} and any password. Institutional authentication will be enabled soon.`,
    email: 'Email',
    password: 'Password',
    error: 'Invalid credentials or service unavailable.',
    submitting: 'Signing in…',
    submit: 'Sign in',
    noAccount: 'No account yet?',
    createAccount: 'Create an account',
    backHome: 'Back to home',
  },
} as const satisfies Record<Locale, Record<string, unknown>>
