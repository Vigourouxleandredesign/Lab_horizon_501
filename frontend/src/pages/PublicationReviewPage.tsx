import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPublicationReview, validatePublication } from '../api/account'
import { EmptyState, ErrorState, LoadingState } from '../components/QueryStates'
import { useApiQuery } from '../hooks/useApiQuery'
import { useLocale } from '../hooks/useLocale'
import { publicationReviewCopy } from '../i18n/account'
import { markPublicationReviewSeen } from '../lib/reviewSeen'
import styles from '../style/pages/PublicationReviewPage.module.css'

/**
 * Étapes du parcours chercheur (V2 UI, API encore stub) :
 * review → (editing) → ready → schedule → done
 *
 * Valider | Modifier
 *   → Valider : Publier | Retour
 *   → Modifier : édition → Enregistrer | Annuler
 *       → Enregistrer : Publier | Retour
 *       → Annuler : retour Valider | Modifier
 *   → Publier : maintenant | calendrier
 */
type Step = 'review' | 'editing' | 'ready' | 'schedule' | 'done'

/**
 * Flux de validation vulgarisation — structure prête pour le back
 * (`GET …/review`, `POST …/validate` + `publishMode` / `publishAt`).
 * Tant que `ACCOUNT_API_READY` est false, les mutations restent locales / stub.
 */
export default function PublicationReviewPage() {
  const { id } = useParams()
  const { locale } = useLocale()
  const t = publicationReviewCopy[locale]
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('review')
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [scheduleDate, setScheduleDate] = useState('')

  const [editTitle, setEditTitle] = useState('')
  const [editLead, setEditLead] = useState('')
  const [editBody, setEditBody] = useState('')
  /** Snapshot pour Annuler (repartir de 0 sur le texte affiché). */
  const [baseline, setBaseline] = useState({ title: '', lead: '', body: '' })

  const query = useApiQuery(
    (signal) => getPublicationReview(id ?? '', signal),
    [id],
  )

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  useEffect(() => {
    if (!id || query.status !== 'success' || !query.data) return
    markPublicationReviewSeen(id)
    const title = query.data.vulgarizedTitle
    const lead = query.data.vulgarizedLead
    const body = query.data.vulgarizedParagraphs.join('\n\n')
    setEditTitle(title)
    setEditLead(lead)
    setEditBody(body)
    setBaseline({ title, lead, body })
  }, [id, query.status, query.data])

  const paragraphsFromEdit = () =>
    editBody
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)

  const handleSaveEdit = () => {
    setBaseline({ title: editTitle, lead: editLead, body: editBody })
    setStep('ready')
  }

  const handleCancelEdit = () => {
    setEditTitle(baseline.title)
    setEditLead(baseline.lead)
    setEditBody(baseline.body)
    setStep('review')
  }

  const handlePublishNow = async () => {
    if (!id) return
    setSubmitting(true)
    try {
      await validatePublication(id, {
        accepted: true,
        vulgarizedTitle: editTitle,
        vulgarizedLead: editLead,
        vulgarizedParagraphs: paragraphsFromEdit(),
        publishMode: 'now',
      })
      setSuccessMessage(t.successNow)
      setStep('done')
      setTimeout(() => navigate('/compte/publications', { replace: true }), 1800)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePublishScheduled = async () => {
    if (!id || !scheduleDate) return
    setSubmitting(true)
    try {
      await validatePublication(id, {
        accepted: true,
        vulgarizedTitle: editTitle,
        vulgarizedLead: editLead,
        vulgarizedParagraphs: paragraphsFromEdit(),
        publishMode: 'scheduled',
        publishAt: scheduleDate,
      })
      setSuccessMessage(t.successScheduled(scheduleDate))
      setStep('done')
      setTimeout(() => navigate('/compte/publications', { replace: true }), 1800)
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
        <Link to="/compte/publications" className={styles.backLink}>
          ← {t.backToList}
        </Link>
      </main>
    )
  }

  const review = query.data
  if (!review) {
    return (
      <main className={styles.page}>
        <EmptyState label={t.notFound} />
        <Link to="/compte/publications" className={styles.backLink}>
          ← {t.backToList}
        </Link>
      </main>
    )
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>{t.title}</h1>
        <p className={styles.lead}>{t.lead}</p>
        <p className={styles.note} role="note">
          {t.pendingNote}
        </p>
        <p className={styles.stubBanner} role="status">
          {t.stubBanner}
        </p>
      </header>

      <section className={styles.compare}>
        <div className={styles.block}>
          <h2 className={styles.blockTitle}>{t.originalLabel}</h2>
          <p>{review.originalTitle}</p>
        </div>
        <div className={styles.block}>
          <h2 className={styles.blockTitle}>{t.vulgarizedLabel}</h2>
          {step === 'editing' ? (
            <label className={styles.editField}>
              <span className="visually-hidden">{t.editTitleLabel}</span>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className={styles.editInput}
              />
            </label>
          ) : (
            <p className={styles.vulgarizedTitle}>{editTitle}</p>
          )}
          {step === 'editing' ? (
            <label className={styles.editField}>
              <span className="visually-hidden">{t.editLeadLabel}</span>
              <textarea
                value={editLead}
                onChange={(e) => setEditLead(e.target.value)}
                className={styles.editTextarea}
                rows={3}
              />
            </label>
          ) : (
            editLead && <p className={styles.vulgarizedLead}>{editLead}</p>
          )}
        </div>
      </section>

      <section className={styles.body} aria-label={t.bodyLabel}>
        {step === 'editing' ? (
          <label className={styles.editField}>
            <span className={styles.editLabel}>{t.editBodyLabel}</span>
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className={styles.editTextarea}
              rows={10}
            />
          </label>
        ) : (
          paragraphsFromEdit().map((paragraph) => <p key={paragraph}>{paragraph}</p>)
        )}
      </section>

      {step === 'done' && successMessage && (
        <p className={styles.success} role="status">
          {successMessage}
        </p>
      )}

      {step === 'review' && (
        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={() => setStep('ready')}>
            {t.validate}
          </button>
          <button type="button" className={styles.secondaryBtn} onClick={() => setStep('editing')}>
            {t.modify}
          </button>
        </div>
      )}

      {step === 'editing' && (
        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={handleSaveEdit}>
            {t.saveEdit}
          </button>
          <button type="button" className={styles.secondaryBtn} onClick={handleCancelEdit}>
            {t.cancelEdit}
          </button>
        </div>
      )}

      {step === 'ready' && (
        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={() => setStep('schedule')}>
            {t.publish}
          </button>
          <button type="button" className={styles.secondaryBtn} onClick={() => setStep('review')}>
            {t.back}
          </button>
        </div>
      )}

      {step === 'schedule' && (
        <section className={styles.schedule} aria-labelledby="schedule-title">
          <h2 id="schedule-title" className={styles.scheduleTitle}>
            {t.scheduleTitle}
          </h2>
          <div className={styles.scheduleGrid}>
            <button
              type="button"
              className={styles.scheduleCard}
              onClick={handlePublishNow}
              disabled={submitting}
            >
              {t.publishNow}
            </button>
            <div className={styles.scheduleCardDate}>
              <label className={styles.editField}>
                <span className={styles.editLabel}>{t.publishLater}</span>
                <span className={styles.dateHint}>{t.dateLabel}</span>
                <input
                  type="date"
                  min={today}
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className={styles.editInput}
                />
              </label>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handlePublishScheduled}
                disabled={submitting || !scheduleDate}
              >
                {t.confirmSchedule}
              </button>
            </div>
          </div>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => setStep('ready')}
            disabled={submitting}
          >
            {t.back}
          </button>
        </section>
      )}

      <Link to="/compte/publications" className={styles.backLink}>
        ← {t.backToList}
      </Link>
    </main>
  )
}
