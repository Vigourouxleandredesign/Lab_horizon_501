import { Outlet } from 'react-router-dom'
import { useLocale } from '../../hooks/useLocale'
import { backofficeShellCopy } from '../../i18n/backoffice'
import { isDemoAuth } from '../../lib/config'
import styles from '../../style/backoffice/backoffice.module.css'
import BackofficeBottomNav from './BackofficeBottomNav'
import BackofficeSidebar from './BackofficeSidebar'

/**
 * Coque backoffice chercheur — séparée de l'app publique (doc 07 §5).
 *
 * Sidebar verticale fixe sur desktop (≥900px), barre basse fixe sur mobile —
 * plus de top bar globale : « Retour au site public » vit dans Recherche,
 * « Déconnexion » vit uniquement dans Votre compte (cf. plan refonte backoffice).
 */
export default function BackofficeLayout() {
  const { locale } = useLocale()
  const t = backofficeShellCopy[locale]

  return (
    <div className={styles.shell}>
      <BackofficeSidebar />

      <div className={styles.content}>
        {isDemoAuth && (
          <p className={styles.demoBanner} role="note">
            {t.demoBanner}
          </p>
        )}
        <Outlet />
      </div>

      <BackofficeBottomNav />
    </div>
  )
}
