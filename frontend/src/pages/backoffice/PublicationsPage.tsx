import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteRecherche, listMyRecherches } from '../../api/rest/myRecherches'
import { useAuth } from '../../auth/AuthContext'
import PublicationCard from '../../components/PublicationCard'
import { EmptyState, ErrorState, LoadingState } from '../../components/QueryStates'
import { useApiQuery } from '../../hooks/useApiQuery'
import { useLocale } from '../../hooks/useLocale'
import { publicationsPageCopy } from '../../i18n/backoffice'
import styles from '../../style/backoffice/PublicationsPage.module.css'

/**
 * Vos publications (`/compte/publications`) — dashboard simple (compteurs
 * calculés côté client, pas de stats inventées) + liste « mes publications »
 * (contournement client tant que le back n'a pas `?mine=1`, cf. `myRecherches.ts`)
 * + actions (nouvelle, éditer, supprimer, valider la vulgarisation).
 */
export default function PublicationsPage() {
  const { locale } = useLocale()
  const t = publicationsPageCopy[locale]
  const { user } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const query = useApiQuery(
    (signal) => (user ? listMyRecherches(user.id, signal) : Promise.resolve([])),
    [user?.id, refreshKey],
  )

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  const stats = useMemo(() => {
    if (query.status !== 'success') return null
    const currentYear = new Date().getFullYear()
    return {
      total: query.data.length,
      thisYear: query.data.filter((item) => item.year === currentYear).length,
    }
  }, [query])

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.deleteConfirm)) return
    setDeleteError(null)
    setDeletingId(id)
    try {
      await deleteRecherche(id)
      setRefreshKey((key) => key + 1)
    } catch {
      setDeleteError(t.error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>{t.title}</h1>
        <p className={styles.lead}>{t.lead}</p>
      </header>

      <section className={styles.quickActions}>
        <Link to="/compte/publications/nouvelle" className={styles.primaryAction}>
          {t.newPublication}
        </Link>
      </section>

      {stats && (
        <section className={styles.stats}>
          <article className={styles.statCard}>
            <strong>{stats.total}</strong>
            <span>{t.stats.total}</span>
          </article>
          <article className={styles.statCard}>
            <strong>{stats.thisYear}</strong>
            <span>{t.stats.thisYear}</span>
          </article>
          <article className={styles.statCardMuted}>
            <span>{t.stats.comingSoon}</span>
          </article>
        </section>
      )}

      {query.status === 'loading' && <LoadingState label={t.loading} />}
      {query.status === 'error' && <ErrorState label={t.error} />}

      {query.status === 'success' && (
        <>
          {deleteError && (
            <p className={styles.formError} role="alert">
              {deleteError}
            </p>
          )}
          {query.data.length > 0 ? (
            <>
              <section className={styles.list}>
                {query.data.map((pub) => (
                  <article key={pub.id} className={styles.listItem}>
                    <PublicationCard publication={pub} />
                    <div className={styles.itemActions}>
                      <Link to={`/compte/publications/${pub.id}/modifier`} className={styles.itemLink}>
                        {t.editCta}
                      </Link>
                      <Link to={`/compte/publications/${pub.id}/review`} className={styles.itemLink}>
                        {t.reviewCta}
                      </Link>
                      <button
                        type="button"
                        className={styles.itemDeleteBtn}
                        disabled={deletingId === pub.id}
                        onClick={() => handleDelete(pub.id)}
                      >
                        {deletingId === pub.id ? t.deleting : t.deleteCta}
                      </button>
                    </div>
                  </article>
                ))}
              </section>
              <p className={styles.scanLimitNote}>{t.scanLimitNote}</p>
            </>
          ) : (
            <EmptyState label={t.empty} />
          )}
        </>
      )}
    </main>
  )
}
