import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPublicationReview, validatePublication } from '../api/account'
import { EmptyState, ErrorState, LoadingState } from '../components/QueryStates'
import { useApiQuery } from '../hooks/useApiQuery'
import { useLocale } from '../hooks/useLocale'
import { publicationReviewCopy } from '../i18n/account'
import styles from '../style/pages/PublicationReviewPage.module.css'

/**
 * Flux de validation vulgarisation (D6) — structure fixe, contenu dynamique.
 * Le texte vulgarisé est mocké en V1 ; le mécanisme (relire → valider) est réel
 * et branché sur POST /api/me/publications/:id/validate.
 */
export default function PublicationReviewPage() {
  const { id } = useParams()
  const { locale } = useLocale()
  const t = publicationReviewCopy[locale]
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const query = useApiQuery(
    (signal) => getPublicationReview(id ?? '', signal),
    [id],
  )

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  const handleValidate = async () => {
    if (!id || !query.data) return
    setSubmitting(true)
    try {
      await validatePublication(id, {
        accepted: true,
        vulgarizedTitle: query.data.vulgarizedTitle,
        vulgarizedLead: query.data.vulgarizedLead,
        vulgarizedParagraphs: query.data.vulgarizedParagraphs,
      })
      setSuccess(true)
      setTimeout(() => navigate('/compte', { replace: true }), 1500)
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

  if (query.status === 'error') {
    return (
      <main className={styles.page}>
        <ErrorState label={t.error} />
        <Link to="/compte" className={styles.backLink}>
          ← {t.back}
        </Link>
      </main>
    )
  }

  const review = query.data
  if (!review) {
    return (
      <main className={styles.page}>
        <EmptyState label={t.notFound} />
        <Link to="/compte" className={styles.backLink}>
          ← {t.back}
        </Link>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>{t.title}</h1>
        <p className={styles.lead}>{t.lead}</p>
        <p className={styles.note} role="note">
          {t.pendingNote}
        </p>
      </header>

      <section className={styles.compare}>
        <div className={styles.block}>
          <h2 className={styles.blockTitle}>{t.originalLabel}</h2>
          <p>{review.originalTitle}</p>
        </div>
        <div className={styles.block}>
          <h2 className={styles.blockTitle}>{t.vulgarizedLabel}</h2>
          <p className={styles.vulgarizedTitle}>{review.vulgarizedTitle}</p>
          {review.vulgarizedLead && <p className={styles.vulgarizedLead}>{review.vulgarizedLead}</p>}
        </div>
      </section>

      <section className={styles.body} aria-label={t.bodyLabel}>
        {review.vulgarizedParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      {success ? (
        <p className={styles.success} role="status">
          {t.success}
        </p>
      ) : (
        <button
          type="button"
          className={styles.validateBtn}
          onClick={handleValidate}
          disabled={submitting || review.status === 'PUBLISHED'}
        >
          {submitting ? '…' : t.accept}
        </button>
      )}

      <Link to="/compte" className={styles.backLink}>
        ← {t.back}
      </Link>
    </main>
  )
}
