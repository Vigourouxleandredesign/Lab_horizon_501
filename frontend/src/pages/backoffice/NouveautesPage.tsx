import { useEffect } from 'react'
import { searchPublications } from '../../api/publications'
import PublicationCard from '../../components/PublicationCard'
import { EmptyState, ErrorState, LoadingState } from '../../components/QueryStates'
import { useApiQuery } from '../../hooks/useApiQuery'
import { useLocale } from '../../hooks/useLocale'
import { nouveautesPageCopy } from '../../i18n/backoffice'
import styles from '../../style/backoffice/NouveautesPage.module.css'

/**
 * Nouveautés (`/compte/nouveautes`) — dashboard simple, contenu réel.
 * Veille personnalisée (chercheurs suivis, mots-clés) hors périmètre back
 * actuel ; en attendant, on met en avant les publications les plus récentes
 * de la plateforme via `GET /api/recherches?sort=recent` (déjà branché).
 */
export default function NouveautesPage() {
  const { locale } = useLocale()
  const t = nouveautesPageCopy[locale]

  const query = useApiQuery(
    (signal) => searchPublications({ sort: 'recent', pageSize: 8 }, signal),
    [],
  )

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>{t.title}</h1>
        <p className={styles.lead}>{t.lead}</p>
        <p className={styles.note} role="note">
          {t.comingSoonNote}
        </p>
      </header>

      {query.status === 'loading' && <LoadingState label={t.loading} />}
      {query.status === 'error' && <ErrorState label={t.error} />}
      {query.status === 'success' &&
        (query.data.items.length > 0 ? (
          <section className={styles.list}>
            {query.data.items.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </section>
        ) : (
          <EmptyState label={t.empty} />
        ))}
    </main>
  )
}
