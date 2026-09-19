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
    showPassword: 'Afficher le mot de passe',
    hidePassword: 'Masquer le mot de passe',
    error: 'Identifiants invalides ou service indisponible.',
    unavailable:
      'API indisponible. Vérifiez que Docker tourne (`docker compose up -d`) et que VITE_API_BASE_URL pointe vers http://localhost:8080.',
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
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    error: 'Invalid credentials or service unavailable.',
    unavailable:
      'API unavailable. Make sure Docker is running (`docker compose up -d`) and VITE_API_BASE_URL points to http://localhost:8080.',
    submitting: 'Signing in…',
    submit: 'Sign in',
    noAccount: 'No account yet?',
    createAccount: 'Create an account',
    backHome: 'Back to home',
  },
} as const satisfies Record<Locale, Record<string, unknown>>
