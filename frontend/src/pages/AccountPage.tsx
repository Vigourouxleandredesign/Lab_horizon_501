import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard, getMyPublications } from '../api/account'
import type { ResearcherPublicationItem } from '../api/types'
import { EmptyState, ErrorState, LoadingState } from '../components/QueryStates'
import { useApiQuery } from '../hooks/useApiQuery'
import { useLocale } from '../hooks/useLocale'
import { accountPageCopy } from '../i18n/account'
import styles from '../style/pages/AccountPage.module.css'

type AccountTab = 'veille' | 'publications' | 'profil'

/**
 * Tableau de bord chercheur — structure fixe, contenu dynamique via api/account.
 * Brancher Laravel = implémenter GET /api/me/dashboard et /api/me/publications.
 */
export default function AccountPage() {
  const { locale } = useLocale()
  const t = accountPageCopy[locale]
  const [tab, setTab] = useState<AccountTab>('veille')

  const dashboardQuery = useApiQuery((signal) => getDashboard(signal), [])
  const publicationsQuery = useApiQuery((signal) => getMyPublications(signal), [])

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  if (dashboardQuery.status === 'loading') {
    return (
      <main className={styles.page}>
        <LoadingState label={t.loading} />
      </main>
    )
  }

  if (dashboardQuery.status === 'error' || !dashboardQuery.data) {
    return (
      <main className={styles.page}>
        <ErrorState label={t.error} />
      </main>
    )
  }

  const dashboard = dashboardQuery.data
  const myPublications: ResearcherPublicationItem[] =
    publicationsQuery.status === 'success' ? publicationsQuery.data : []

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.date}>{dashboard.dateLabel}</p>
        <p>{t.greeting(dashboard.greeting)}</p>
      </header>

      <section className={styles.quickActions}>
        <button type="button" className={styles.primaryAction}>
          {t.newPublication}
        </button>
        <button type="button" className={styles.secondaryAction}>
          {t.drafts}
          <small>{dashboard.stats.draftsCount}</small>
        </button>
        <button type="button" className={styles.secondaryAction} onClick={() => setTab('veille')}>
          {t.watch}
          <small>{dashboard.stats.watchNewCount} new</small>
        </button>
      </section>

      <section className={styles.stats}>
        <article className={styles.statCard}>
          <strong>{dashboard.stats.views.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}</strong>
          <span>{t.stats.views}</span>
        </article>
        <article className={styles.statCard}>
          <strong>{dashboard.stats.publicationsCount}</strong>
          <span>{t.stats.publications}</span>
        </article>
        <article className={styles.statCard}>
          <strong>{dashboard.stats.watchNewCount}</strong>
          <span>{t.stats.watchNew}</span>
        </article>
      </section>

      <section className={styles.tabs}>
        {(['veille', 'publications', 'profil'] as const).map((key) => (
          <button
            key={key}
            type="button"
            className={tab === key ? styles.tabActive : styles.tab}
            onClick={() => setTab(key)}
          >
            {t.tabs[key]}
          </button>
        ))}
      </section>

      {tab === 'veille' && (
        <section className={styles.stack}>
          {dashboard.watchItems.length > 0 ? (
            dashboard.watchItems.map((item) => (
              <article key={item.id} className={styles.card}>
                <h3>{item.keyword}</h3>
                <p>{item.dateLabel}</p>
                <span className={item.newCount > 0 ? styles.warning : styles.muted}>
                  {t.watchNew(item.newCount)}
                </span>
              </article>
            ))
          ) : (
            <EmptyState label={t.tabs.veille} />
          )}
        </section>
      )}

      {tab === 'publications' && (
        <section className={styles.stack}>
          {publicationsQuery.status === 'loading' && <LoadingState label={t.loading} />}
          {publicationsQuery.status === 'error' && <ErrorState label={t.error} />}
          {publicationsQuery.status === 'success' &&
            (myPublications.length > 0 ? (
              myPublications.map((pub) => (
                <article key={pub.id} className={styles.card}>
                  <h3>{pub.title}</h3>
                  <p>
                    {pub.category} — {pub.dateLabel}
                  </p>
                  <span className={styles.statusBadge}>{t.status[pub.status]}</span>
                  {pub.status === 'PENDING_AI_VALIDATION' && (
                    <Link to={`/compte/publications/${pub.id}/review`} className={styles.reviewLink}>
                      {t.reviewCta} →
                    </Link>
                  )}
                  {pub.status === 'PUBLISHED' && (
                    <Link to={`/publications/${pub.id}`} className={styles.reviewLink}>
                      Voir la version publique →
                    </Link>
                  )}
                </article>
              ))
            ) : (
              <EmptyState label={t.tabs.publications} />
            ))}
        </section>
      )}

      {tab === 'profil' && (
        <section className={styles.profile}>
          <p>{t.profileUnavailable}</p>
        </section>
      )}
    </main>
  )
}
