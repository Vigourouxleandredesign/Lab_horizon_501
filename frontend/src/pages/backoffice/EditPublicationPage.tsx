import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../../api/http'
import { getRechercheRaw, updateRecherche } from '../../api/rest/myRecherches'
import { ErrorState, LoadingState } from '../../components/QueryStates'
import { useApiQuery } from '../../hooks/useApiQuery'
import { useLocale } from '../../hooks/useLocale'
import { editPublicationPageCopy } from '../../i18n/backoffice'
import styles from '../../style/backoffice/NewPublicationPage.module.css'

/**
 * Modifier une publication (`/compte/publications/:id/modifier`) — branché
 * sur `PUT /api/recherches/{id}` (titre + description ; le PDF ne se
 * remplace pas via cet écran, le back n'accepte pas de ré-upload en update).
 */
export default function EditPublicationPage() {
  const { id } = useParams()
  const { locale } = useLocale()
  const t = editPublicationPageCopy[locale]
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const query = useApiQuery((signal) => getRechercheRaw(id ?? '', signal), [id])

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!id) return
    const formData = new FormData(event.currentTarget)
    const titre = String(formData.get('titre') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()

    setError(null)
    setSubmitting(true)
    try {
      await updateRecherche(id, { titre, description })
      navigate('/compte/publications', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.errorGeneric)
    } finally {
      setSubmitting(false)
    }
  }

  if (query.status === 'loading') {
    return (
      <main className={styles.page}>
        <LoadingState label={t.loading} />
      </main>
    )
  }

  if (query.status === 'error' || !query.data) {
    return (
      <main className={styles.page}>
        <ErrorState label={t.error} />
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>{t.title}</h1>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          {t.fields.titre}
          <input type="text" name="titre" maxLength={255} defaultValue={query.data.titre} required />
        </label>
        <label>
          {t.fields.description}
          <textarea name="description" rows={5} defaultValue={query.data.description} />
        </label>

        {error && (
          <p className={styles.formError} role="alert">
            {error}
          </p>
        )}

        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? t.submitting : t.submit}
          </button>
        </div>
      </form>
    </main>
  )
}
