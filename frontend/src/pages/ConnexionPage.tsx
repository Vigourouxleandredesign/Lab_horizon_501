import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { DEMO_EMAIL } from '../api/auth'
import { useAuth } from '../auth/AuthContext'
import { isDemoAuth } from '../lib/config'
import styles from '../style/pages/SimplePage.module.css'

/**
 * Connexion chercheur — branchée sur le contexte d'auth (Sanctum en mode
 * 'rest', session de démonstration sinon, clairement signalée).
 */
export default function ConnexionPage() {
  const { status, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Déjà connecté : direction l'espace compte (ou la page demandée).
  const from = (location.state as { from?: string } | null)?.from ?? '/compte'
  if (status === 'authenticated') {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)
    setSubmitting(true)

    try {
      await login({
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
      })
      navigate(from, { replace: true })
    } catch {
      setError('Identifiants invalides ou service indisponible.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <h1>Connexion</h1>
      <p className={styles.lead}>
        Accédez à votre espace chercheur pour publier et gérer votre veille.
      </p>

      {isDemoAuth && (
        <p className={styles.highlight} role="note">
          Mode démonstration — connectez-vous avec <strong>{DEMO_EMAIL}</strong> et un mot
          de passe quelconque. L&apos;authentification réelle arrivera avec l&apos;API Lab Horizon.
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          E-mail
          <input type="email" name="email" autoComplete="email" required />
        </label>
        <label>
          Mot de passe
          <input type="password" name="password" autoComplete="current-password" required />
        </label>
        {error && (
          <p className={styles.formError} role="alert">
            {error}
          </p>
        )}
        <button type="submit" className={styles.primaryBtn} disabled={submitting}>
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      <p className={styles.lead}>
        Pas encore de compte ?{' '}
        <Link to="/inscription">Créer un compte</Link>
      </p>

      <Link to="/" className={styles.backLink}>
        Retour à l&apos;accueil
      </Link>
    </main>
  )
}
