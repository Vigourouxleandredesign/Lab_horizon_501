import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { UNC_CATEGORIES } from '../data/categories'
import { useLocale } from '../hooks/useLocale'
import styles from '../style/pages/SimplePage.module.css'

export default function CategoriesPage() {
  const { locale } = useLocale()
  const [searchParams] = useSearchParams()
  const domain = searchParams.get('domain')

  if (domain) {
    return <Navigate to={`/categories/${encodeURIComponent(domain)}`} replace />
  }

  return (
    <main className={styles.page}>
      <h1>Domaines scientifiques</h1>
      <p className={styles.lead}>
        Parcourez les publications par domaine de recherche UNC.
      </p>

      <div className={styles.grid}>
        {UNC_CATEGORIES.map((category) => {
          const label = locale === 'fr' ? category.labelFr : category.labelEn
          return (
            <article key={category.slug} className={styles.card}>
              <h2 className={styles.cardTitle}>{label}</h2>
              <p className={styles.cardMeta}>
                {category.publicationCount} publications
              </p>
              <div className={styles.cardLinks}>
                <Link to={`/categories/${category.slug}`}>Découvrir le domaine</Link>
                <Link to={`/recherche?category=${encodeURIComponent(category.labelFr)}`}>
                  Toutes les publications
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      <Link to="/" className={styles.backLink}>
        Retour à l&apos;accueil
      </Link>
    </main>
  )
}
