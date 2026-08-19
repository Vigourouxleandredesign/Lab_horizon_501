import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getResearcher, followResearcher } from '../api/researchers'
import PublicationCard from '../components/PublicationCard'
import { EmptyState, ErrorState, LoadingState } from '../components/QueryStates'
import { useApiQuery } from '../hooks/useApiQuery'
import { useLocale } from '../hooks/useLocale'
import { researcherPageCopy } from '../i18n/researcher'
import styles from '../style/pages/ResearcherPage.module.css'

/**
 * Fiche chercheur — réservée aux chercheurs connectés (D3, garde RequireAuth
 * au niveau du routing). Structure fixe, contenu dynamique via la façade API.
 */
export default function ResearcherPage() {
  const { id } = useParams()
  const { locale } = useLocale()
  const t = researcherPageCopy[locale]
  const [followed, setFollowed] = useState(false)

  const query = useApiQuery(
    (signal) => getResearcher(id ?? '', signal),
    [id],
  )

  useEffect(() => {
    if (query.status === 'success' && query.data) {
      document.title = `${query.data.displayName}, Lab Horizon`
    }
  }, [query])

  const handleFollow = async () => {
    // Optimiste : l'API veille (D5) confirmera côté Laravel.
    setFollowed(true)
    try {
      await followResearcher(id ?? '')
    } catch {
      setFollowed(false)
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
      </main>
    )
  }

  const researcher = query.data
  if (!researcher) {
    return (
      <main className={styles.page}>
        <EmptyState label={t.notFound} />
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <img
          src={researcher.photoUrl}
          alt={researcher.displayName}
          className={styles.avatar}
        />
        <div className={styles.identity}>
          <h1 className={styles.name}>{researcher.displayName}</h1>
          <p className={styles.domain}>{researcher.domain}</p>
          <p className={styles.institution}>{researcher.institution}</p>
          {researcher.available && <span className={styles.available}>{t.available}</span>}
        </div>
        <button
          type="button"
          className={followed ? styles.followBtnActive : styles.followBtn}
          onClick={handleFollow}
          disabled={followed}
        >
          {followed ? t.following : t.follow}
        </button>
      </header>

      <section aria-labelledby="researcher-pubs-title" className={styles.publications}>
        <h2 id="researcher-pubs-title" className={styles.sectionTitle}>
          {t.publicationsTitle} ({researcher.publications.length})
        </h2>
        {researcher.publications.length > 0 ? (
          <div className={styles.list}>
            {researcher.publications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>
        ) : (
          <EmptyState label={t.noPublications} />
        )}
      </section>

      <Link to="/recherche" className={styles.backLink}>
        ← {t.backToSearch}
      </Link>
    </main>
  )
}
