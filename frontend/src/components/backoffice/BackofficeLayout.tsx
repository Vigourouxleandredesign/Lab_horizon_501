import { Link, Outlet, useNavigate } from 'react-router-dom'
import { brandLogoSrc } from '../../assets/figmaHomeAssets'
import { useAuth } from '../../auth/AuthContext'
import { useLocale } from '../../hooks/useLocale'
import { accountPageCopy } from '../../i18n/account'
import { isDemoAuth } from '../../lib/config'
import styles from '../../style/backoffice/backoffice.module.css'

/**
 * Coque backoffice chercheur — séparée de l'app publique (doc 07 §5).
 * Les pages enfants (`/compte`, validation vulgarisation) ne changent pas
 * quand l'API Laravel sera branchée : seule la façade `api/` est concernée.
 */
export default function BackofficeLayout() {
  const { user, logout } = useAuth()
  const { locale } = useLocale()
  const navigate = useNavigate()
  const t = accountPageCopy[locale]

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className={styles.backoffice}>
      <header className={styles.topBar}>
        <Link to="/compte" className={styles.brand}>
          <img src={brandLogoSrc} alt="" width={36} height={36} />
          <span>Lab Horizon — {t.nav.dashboard}</span>
        </Link>
        <div className={styles.topActions}>
          <Link to="/recherche" className={styles.topLink}>
            {t.nav.search}
          </Link>
          <Link to="/" className={styles.topLink}>
            {t.nav.publicSite}
          </Link>
          {user && (
            <span className={styles.topLink} aria-hidden>
              {user.displayName}
            </span>
          )}
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            {t.logout}
          </button>
        </div>
      </header>

      {isDemoAuth && (
        <p className={styles.demoBanner} role="note">
          {t.demoBanner}
        </p>
      )}

      <div className={styles.body}>
        <Outlet />
      </div>
    </div>
  )
}
