import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useLocale } from '../hooks/useLocale'
import { inscriptionCopy } from '../i18n/inscription'
import { isDemoAuth } from '../lib/config'
import styles from '../style/pages/InscriptionPage.module.css'

/**
 * Inscription chercheur — branchée sur api/auth.register.
 * En mode démo, l'inscription est refusée (501) : le référent communique
 * l'URL de connexion avec le compte de démonstration (doc 07 §3, D9).
 */
export default function InscriptionPage() {
  const { locale } = useLocale()
  const t = inscriptionCopy[locale]
  const navigate = useNavigate()
  const { status, register } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  if (status === 'authenticated') {
    return <Navigate to="/compte" replace />
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)
    setSubmitting(true)

    const password = String(formData.get('password') ?? '')
    const confirm = String(formData.get('confirmPassword') ?? '')
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      setSubmitting(false)
      return
    }

    try {
      await register({
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        password,
      })
      navigate('/compte', { replace: true })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Inscription indisponible — utilisez la page de connexion.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <section className={styles.whyBlock} aria-labelledby="inscription-why-title">
          <h1 className={styles.title}>{t.title}</h1>
          <h2 id="inscription-why-title" className={styles.whyTitle}>
            {t.whyTitle}
          </h2>
          <p className={styles.lead}>{t.whyLead}</p>

          <ul className={styles.benefits}>
            {t.benefits.map((benefit) => (
              <li key={benefit.title} className={styles.benefitCard}>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitBody}>{benefit.body}</p>
              </li>
            ))}
          </ul>

          <div className={styles.freeBanner} role="note">
            <p className={styles.freeText}>
              {t.freeBadge}{' '}
              <span className={styles.freeHighlight}>{t.freeHighlight}</span>
            </p>
          </div>

          {isDemoAuth && (
            <p className={styles.demoNote} role="note">
              Inscription réelle prévue avec l&apos;API Laravel (validation par le référent à
              trancher). En attendant, connectez-vous via la{' '}
              <Link to="/connexion">page de connexion</Link>.
            </p>
          )}
        </section>

        <aside className={styles.formPanel} aria-labelledby="inscription-form-title">
          <h2 id="inscription-form-title" className={styles.formTitle}>
            {t.formTitle}
          </h2>
          <p className={styles.formLead}>{t.formLead}</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              {t.fields.name}
              <input type="text" name="name" autoComplete="name" required />
            </label>
            <label>
              {t.fields.email}
              <input type="email" name="email" autoComplete="email" required />
            </label>
            <label>
              {t.fields.password}
              <input type="password" name="password" autoComplete="new-password" required />
            </label>
            <label>
              {t.fields.confirmPassword}
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                required
              />
            </label>
            {error && (
              <p className={styles.formError} role="alert">
                {error}
              </p>
            )}
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? '…' : t.submit}
            </button>
          </form>

          <p className={styles.footerLinks}>
            {t.hasAccount}{' '}
            <Link to="/connexion">{t.signIn}</Link>
          </p>
        </aside>
      </div>

      <Link to="/" className={styles.backLink}>
        ← {t.backHome}
      </Link>
    </main>
  )
}
