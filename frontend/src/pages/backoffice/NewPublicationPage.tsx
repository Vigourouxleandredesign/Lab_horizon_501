import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../../api/http'
import { createRecherche } from '../../api/rest/myRecherches'
import { useLocale } from '../../hooks/useLocale'
import { newPublicationPageCopy } from '../../i18n/backoffice'
import styles from '../../style/backoffice/NewPublicationPage.module.css'

const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024

/**
 * Nouvelle publication (`/compte/publications/nouvelle`) — formulaire réel
 * branché sur `POST /api/recherches` (multipart, déjà fonctionnel côté back).
 */
export default function NewPublicationPage() {
  const { locale } = useLocale()
  const t = newPublicationPageCopy[locale]
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const titre = String(formData.get('titre') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const pdfField = formData.get('pdf')
    const pdf = pdfField instanceof File && pdfField.size > 0 ? pdfField : null

    setError(null)

    if (pdf && pdf.type !== 'application/pdf') {
      setError(t.errorPdfType)
      return
    }
    if (pdf && pdf.size > MAX_PDF_SIZE_BYTES) {
      setError(t.errorPdfSize)
      return
    }

    setSubmitting(true)
    try {
      await createRecherche({ titre, description, pdf })
      navigate('/compte/publications', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.errorGeneric)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>{t.title}</h1>
        <p className={styles.lead}>{t.lead}</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          {t.fields.titre}
          <input type="text" name="titre" maxLength={255} required />
        </label>
        <label>
          {t.fields.description}
          <textarea name="description" rows={5} />
        </label>
        <label>
          {t.fields.pdf}
          <input type="file" name="pdf" accept="application/pdf" />
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
