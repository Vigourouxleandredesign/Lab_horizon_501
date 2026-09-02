import { useEffect } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import ContentHero from '../components/chrome/ContentHero'
import { getCategoriesHeroSrc } from '../assets/figmaHomeAssets'
import { UNC_CATEGORIES } from '../data/categories'
import { useLocale } from '../hooks/useLocale'
import { categoriesPageCopy } from '../i18n/categoriesPage'
import styles from '../style/pages/SimplePage.module.css'

export default function CategoriesPage() {
  const { locale } = useLocale()
  const t = categoriesPageCopy[locale]
  const [searchParams] = useSearchParams()
  const domain = searchParams.get('domain')

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  if (domain) {
    return <Navigate to={`/categories/${encodeURIComponent(domain)}`} replace />
  }

  return (
    <>
      <ContentHero
        title={t.title}
        subtitle={t.lead}
        imageSrc={getCategoriesHeroSrc()}
        localeKey={locale}
      />
      <main className={styles.page}>
        <div className={styles.grid}>
          {UNC_CATEGORIES.map((category) => {
            const label = locale === 'fr' ? category.labelFr : category.labelEn
            return (
              <article key={category.slug} className={styles.card}>
                <h2 className={styles.cardTitle}>{label}</h2>
                <div className={styles.cardLinks}>
                  <Link to={`/categories/${category.slug}`}>{t.exploreDomain}</Link>
                  <Link to={`/recherche?category=${encodeURIComponent(category.slug)}`}>
                    {t.allPublications}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        <Link to="/" className={styles.backLink}>
          {t.backHome}
        </Link>
      </main>
    </>
  )
}
