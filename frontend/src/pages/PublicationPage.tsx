import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPublication } from '../api/publications'
import PublicationCard from '../components/PublicationCard'
import { EmptyState, ErrorState, LoadingState } from '../components/QueryStates'
import { useApiQuery } from '../hooks/useApiQuery'
import { useLocale } from '../hooks/useLocale'
import { publicationPageCopy } from '../i18n/publication'
import styles from '../style/pages/PublicationPage.module.css'

/**
 * Détail publication — page type « structure fixe, contenu dynamique » (D2).
 * Toute la donnée vient de la façade API : brancher Laravel ne change rien ici.
 */
export default function PublicationPage() {
  const { id } = useParams()
  const { locale } = useLocale()
  const t = publicationPageCopy[locale]

  const query = useApiQuery(
    (signal) => getPublication(id ?? '', signal),
    [id],
  )

  useEffect(() => {
    if (query.status === 'success' && query.data) {
      document.title = `${query.data.title} — Lab Horizon`
    }
  }, [query])

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
        <Link to="/recherche" className={styles.backLink}>
          ← {t.backToSearch}
        </Link>
      </main>
    )
  }

  const publication = query.data
  if (!publication) {
    return (
      <main className={styles.page}>
        <EmptyState label={t.notFound} />
        <Link to="/recherche" className={styles.backLink}>
          ← {t.backToSearch}
        </Link>
      </main>
    )
  }

  const metaRows = [
    { label: t.meta.what, value: publication.meta.scientificTitle },
    { label: t.meta.who, value: publication.meta.authors },
    { label: t.meta.when, value: publication.meta.publishedAt },
    { label: t.meta.lab, value: publication.meta.lab },
  ].filter((row) => row.value)

  const isLocalPdf =
    Boolean(publication.sourceUrl) &&
    (publication.sourceUrl!.includes('/files/') ||
      publication.sourceUrl!.toLowerCase().endsWith('.pdf'))
  const sourceLabel = isLocalPdf ? t.pdfCta : t.sourceCta

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        {publication.category && (
          <p className={styles.eyebrow}>{publication.category}</p>
        )}
        <h1 className={styles.title}>{publication.title}</h1>
        <p className={styles.byline}>
          {publication.authorName}
          {publication.institution ? ` — ${publication.institution}` : ''}
          {publication.dateLabel ? ` · ${publication.dateLabel}` : ''}
        </p>
      </header>

      {publication.lead && <p className={styles.lead}>{publication.lead}</p>}

      {publication.coverUrls.length > 0 && (
        <section className={styles.covers} aria-label={t.coversLabel}>
          <h2 className={styles.coversTitle}>{t.coversLabel}</h2>
          <div className={styles.coverGrid}>
            {publication.coverUrls.map((url) => (
              <a
                key={url}
                href={publication.sourceUrl ?? url}
                className={styles.coverLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={url} alt="" className={styles.coverImage} loading="lazy" />
              </a>
            ))}
          </div>
        </section>
      )}

      <article className={styles.body} aria-label={t.bodyLabel}>
        {publication.paragraphs.length > 0 ? (
          publication.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
        ) : (
          <EmptyState label={t.noBody} />
        )}
      </article>

      {metaRows.length > 0 && (
        <section className={styles.metaGrid} aria-label={t.metaLabel}>
          {metaRows.map((row) => (
            <div key={row.label} className={styles.metaCell}>
              <span className={styles.metaKey}>{row.label}</span>
              <span className={styles.metaValue}>{row.value}</span>
            </div>
          ))}
        </section>
      )}

      {publication.sourceUrl && (
        <a
          href={publication.sourceUrl}
          className={styles.sourceLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {sourceLabel} ↗
        </a>
      )}

      {publication.related.length > 0 && (
        <section className={styles.related} aria-labelledby="related-title">
          <h2 id="related-title" className={styles.relatedTitle}>
            {t.relatedTitle}
          </h2>
          <div className={styles.relatedList}>
            {publication.related.map((related) => (
              <PublicationCard key={related.id} publication={related} />
            ))}
          </div>
        </section>
      )}

      <Link to="/recherche" className={styles.backLink}>
        ← {t.backToSearch}
      </Link>
    </main>
  )
}
