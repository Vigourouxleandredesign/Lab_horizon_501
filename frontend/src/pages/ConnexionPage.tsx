import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { DEMO_EMAIL } from '../api/auth'
import { useAuth } from '../auth/AuthContext'
import { useLocale } from '../hooks/useLocale'
import { connexionCopy } from '../i18n/connexion'
import { isDemoAuth } from '../lib/config'
import styles from '../style/pages/SimplePage.module.css'

/**
 * Connexion chercheur — branchée sur le contexte d'auth (Sanctum en mode
 * 'rest', session de démonstration sinon, clairement signalée).
 */
export default function ConnexionPage() {
  const { locale } = useLocale()
  const t = connexionCopy[locale]
  const { status, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

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
      setError(t.error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <h1>{t.title}</h1>
      <p className={styles.lead}>{t.lead}</p>

      {isDemoAuth && (
        <p className={styles.highlight} role="note">
          {t.demoNote(DEMO_EMAIL)}
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          {t.email}
          <input type="email" name="email" autoComplete="email" required />
        </label>
        <label>
          {t.password}
          <input type="password" name="password" autoComplete="current-password" required />
        </label>
        {error && (
          <p className={styles.formError} role="alert">
            {error}
          </p>
        )}
        <button type="submit" className={styles.primaryBtn} disabled={submitting}>
          {submitting ? t.submitting : t.submit}
        </button>
      </form>

      <p className={styles.lead}>
        {t.noAccount}{' '}
        <Link to="/inscription">{t.createAccount}</Link>
      </p>

      <Link to="/" className={styles.backLink}>
        {t.backHome}
      </Link>
    </main>
  )
}
