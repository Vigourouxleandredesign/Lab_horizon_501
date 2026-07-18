import { useCallback, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { searchPublications } from '../api/publications'
import { getDomainHeroLayerSrc, getDomainHeroSrc } from '../assets/figmaHomeAssets'
import DomainHero from '../components/DomainHero'
import PublicationCard from '../components/PublicationCard'
import { ErrorState, LoadingState } from '../components/QueryStates'
import { categoryBySlug, categoryLabel } from '../data/categories'
import type { CategorySlug } from '../data/categories'
import { useApiQuery } from '../hooks/useApiQuery'
import { useLocale } from '../hooks/useLocale'
import { useTextReveal } from '../hooks/useTextReveal'
import { domainDescription, domainPageCopy } from '../i18n/domains'
import NotFoundPage from './NotFoundPage'
import styles from '../style/pages/DomainPage.module.css'

export default function DomainPage() {
  const { slug } = useParams()
  const { locale } = useLocale()
  const publicationsRef = useRef<HTMLElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const category = categoryBySlug(slug)
  const typedSlug = category?.slug as CategorySlug | undefined
  const description =
    typedSlug !== undefined ? domainDescription(typedSlug, locale) : ''

  useTextReveal(descriptionRef, {
    active: Boolean(category),
    contentKey: description,
  })

  const scrollToPublications = useCallback(() => {
    publicationsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Filtre catégorie via la façade API — le libellé FR est la clé des filtres.
  const publicationsQuery = useApiQuery(
    (signal) =>
      category
        ? searchPublications({ category: category.labelFr }, signal)
        : Promise.resolve({ items: [], total: 0 }),
    [category?.labelFr],
  )

  if (!category || typedSlug === undefined) {
    return <NotFoundPage />
  }

  const copy = domainPageCopy[locale]
  const label = categoryLabel(typedSlug, locale)

  return (
    <main className={styles.page}>
      <DomainHero
        title={label}
        imageSrc={getDomainHeroSrc(typedSlug)}
        layerSrc={getDomainHeroLayerSrc(typedSlug)}
        scrollCta={copy.scrollCta}
        onScrollToContent={scrollToPublications}
      />

      <div className={styles.body}>
        <div className={styles.descriptionBlock}>
          <p ref={descriptionRef} className={`${styles.descriptionText} ${styles.textReveal}`}>
            {description}
          </p>
        </div>

        <section
          id="publications"
          ref={publicationsRef}
          className={styles.publicationsSection}
          aria-labelledby="domain-publications-title"
        >
          <div className={styles.sectionHeader}>
            <h2 id="domain-publications-title" className={styles.sectionTitle}>
              {copy.publicationsTitle}
            </h2>
            <Link
              to={`/recherche?category=${encodeURIComponent(category.labelFr)}`}
              className={styles.searchLink}
            >
              {copy.searchAll}
            </Link>
          </div>
          <p className={styles.sectionSubtitle}>{copy.publicationsSubtitle}</p>

          {publicationsQuery.status === 'loading' && <LoadingState label={copy.loading} />}
          {publicationsQuery.status === 'error' && <ErrorState label={copy.error} />}
          {publicationsQuery.status === 'success' &&
            (publicationsQuery.data.items.length > 0 ? (
              <div className={styles.list}>
                {publicationsQuery.data.items.map((pub) => (
                  <PublicationCard key={pub.id} publication={pub} />
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>{copy.emptyState}</p>
            ))}
        </section>

        <Link to="/categories" className={styles.backLink}>
          ← {copy.backToCategories}
        </Link>
      </div>
    </main>
  )
}
