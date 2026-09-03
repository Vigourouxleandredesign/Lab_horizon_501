import { Link } from 'react-router-dom'
import { useLocale } from '../../hooks/useLocale'
import { backofficeSearchPageCopy } from '../../i18n/backoffice'
import SearchPage from '../SearchPage'
import styles from '../../style/backoffice/BackofficeSearchPage.module.css'

/**
 * Recherche (`/compte/recherche`) — réutilise directement `SearchPage`
 * (aucune duplication de logique de filtres) à l'intérieur du layout
 * backoffice, avec un lien de sortie vers le site public.
 */
export default function BackofficeSearchPage() {
  const { locale } = useLocale()
  const t = backofficeSearchPageCopy[locale]

  return (
    <div className={styles.wrapper}>
      <div className={styles.banner}>
        <Link to="/recherche" className={styles.backLink}>
          ← {t.backToPublicSite}
        </Link>
      </div>
      <SearchPage />
    </div>
  )
}
