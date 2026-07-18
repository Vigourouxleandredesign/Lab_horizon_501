import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchPublications } from '../api/publications'
import { searchResearchers } from '../api/researchers'
import type { PublicationSort } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import PublicationCard from '../components/PublicationCard'
import { EmptyState, ErrorState, LoadingState } from '../components/QueryStates'
import { categoryLabels } from '../data/categories'
import { useApiQuery } from '../hooks/useApiQuery'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useLocale } from '../hooks/useLocale'
import { categoryFromDomain } from '../lib/domainCategory'
import { searchPageCopy } from '../i18n/search'
import styles from '../style/pages/SearchPage.module.css'

type Tab = 'publications' | 'chercheurs'

/** Années proposées au filtre — bornées aux données réellement couvertes. */
const YEAR_OPTIONS = [2025, 2024, 2023, 2022, 2021, 2020]

function parseSort(raw: string | null): PublicationSort {
  return raw === 'relevance' ? 'relevance' : 'recent'
}

/**
 * Recherche — filtres D8 (catégorie, année, tri, type) branchés sur la façade
 * API. L'URL est la source de vérité (liens partageables, retour arrière sain).
 * L'onglet chercheurs n'existe que connecté (D3) — le serveur reste le garant.
 */
export default function SearchPage() {
  const { locale } = useLocale()
  const { status: authStatus } = useAuth()
  const t = searchPageCopy[locale]
  const [searchParams, setSearchParams] = useSearchParams()

  const urlQuery = searchParams.get('q') ?? ''
  const category =
    searchParams.get('category') ??
    categoryFromDomain(searchParams.get('domain'), locale) ??
    ''
  const year = Number(searchParams.get('year')) || undefined
  const sort = parseSort(searchParams.get('sort'))

  const canSeeResearchers = authStatus === 'authenticated'
  const tab: Tab =
    canSeeResearchers && searchParams.get('tab') === 'chercheurs'
      ? 'chercheurs'
      : 'publications'

  // Saisie immédiate à l'écran, requête (et URL) retardées.
  const [inputValue, setInputValue] = useState(urlQuery)
  const debouncedInput = useDebouncedValue(inputValue)

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  useEffect(() => {
    if (debouncedInput === urlQuery) return
    setSearchParams(
      (params) => {
        if (debouncedInput) params.set('q', debouncedInput)
        else params.delete('q')
        return params
      },
      { replace: true },
    )
  }, [debouncedInput, urlQuery, setSearchParams])

  useEffect(() => {
    // Changement d'URL externe (formulaire accueil, lien partagé) : resynchroniser la saisie.
    if (urlQuery !== debouncedInput) setInputValue(urlQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ne réagir qu'à l'URL
  }, [urlQuery])

  const setParam = (key: string, value: string) => {
    setSearchParams((params) => {
      if (value) params.set(key, value)
      else params.delete(key)
      return params
    })
  }

  const publicationsQuery = useApiQuery(
    (signal) =>
      searchPublications(
        { query: urlQuery, category: category || undefined, year, sort },
        signal,
      ),
    [urlQuery, category, year, sort],
  )

  const researchersQuery = useApiQuery(
    (signal) =>
      canSeeResearchers
        ? searchResearchers({ query: urlQuery, category: category || undefined }, signal)
        : Promise.resolve({ items: [], total: 0 }),
    [urlQuery, category, canSeeResearchers],
  )

  return (
    <main className={styles.page}>
      <section className={styles.searchSection}>
        <div className={styles.searchRow}>
          <input
            type="search"
            placeholder={t.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.searchInput}
            aria-label={t.placeholder}
          />
        </div>

        <div className={styles.filtersRow}>
          <label className={styles.filterField}>
            <span className={styles.filterLabel}>{t.filters.category}</span>
            <select
              value={category}
              onChange={(e) => setParam('category', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">{t.filters.allCategories}</option>
              {categoryLabels('fr').map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.filterField}>
            <span className={styles.filterLabel}>{t.filters.year}</span>
            <select
              value={year ?? ''}
              onChange={(e) => setParam('year', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">{t.filters.allYears}</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.filterField}>
            <span className={styles.filterLabel}>{t.filters.sort}</span>
            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="recent">{t.filters.sortRecent}</option>
              <option value="relevance">{t.filters.sortRelevance}</option>
            </select>
          </label>
        </div>
      </section>

      <section className={styles.tabs} aria-label={t.resultsLabel}>
        <button
          className={tab === 'publications' ? styles.tabActive : styles.tab}
          onClick={() => setParam('tab', '')}
          type="button"
        >
          {t.tabPublications}
          {publicationsQuery.status === 'success' ? ` (${publicationsQuery.data.total})` : ''}
        </button>
        {canSeeResearchers && (
          <button
            className={tab === 'chercheurs' ? styles.tabActive : styles.tab}
            onClick={() => setParam('tab', 'chercheurs')}
            type="button"
          >
            {t.tabResearchers}
            {researchersQuery.status === 'success' ? ` (${researchersQuery.data.total})` : ''}
          </button>
        )}
      </section>

      {!canSeeResearchers && <p className={styles.hint}>{t.researcherHint}</p>}

      {tab === 'publications' && (
        <>
          {publicationsQuery.status === 'loading' && <LoadingState label={t.loading} />}
          {publicationsQuery.status === 'error' && <ErrorState label={t.error} />}
          {publicationsQuery.status === 'success' &&
            (publicationsQuery.data.items.length > 0 ? (
              <section className={styles.list}>
                {publicationsQuery.data.items.map((pub) => (
                  <PublicationCard key={pub.id} publication={pub} />
                ))}
              </section>
            ) : (
              <EmptyState label={t.empty} />
            ))}
        </>
      )}

      {tab === 'chercheurs' && (
        <>
          {researchersQuery.status === 'loading' && <LoadingState label={t.loading} />}
          {researchersQuery.status === 'error' && <ErrorState label={t.error} />}
          {researchersQuery.status === 'success' &&
            (researchersQuery.data.items.length > 0 ? (
              <section className={styles.grid}>
                {researchersQuery.data.items.map((researcher) => (
                  <Link
                    key={researcher.id}
                    to={`/chercheurs/${researcher.id}`}
                    className={styles.researcherCard}
                  >
                    <img
                      src={researcher.photoUrl}
                      alt={researcher.displayName}
                      className={styles.avatar}
                    />
                    <h3 className={styles.cardTitle}>{researcher.displayName}</h3>
                    <p className={styles.cardAuthor}>{researcher.domain}</p>
                    <small>{researcher.institution}</small>
                  </Link>
                ))}
              </section>
            ) : (
              <EmptyState label={t.empty} />
            ))}
        </>
      )}
    </main>
  )
}
