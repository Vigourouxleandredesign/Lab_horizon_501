import { NavLink } from 'react-router-dom'
import { BACKOFFICE_NAV_ICONS, BACKOFFICE_NAV_ITEMS } from '../../data/backofficeNavigation'
import { useLocale } from '../../hooks/useLocale'
import { backofficeNavCopy } from '../../i18n/backoffice'
import styles from '../../style/backoffice/backoffice.module.css'

/** Barre basse fixe (mobile) — même esprit que la nav publique, 4 items backoffice. */
export default function BackofficeBottomNav() {
  const { locale } = useLocale()
  const t = backofficeNavCopy[locale]

  return (
    <nav className={styles.bottomNav} aria-label={t.aria}>
      {BACKOFFICE_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.id}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            isActive ? `${styles.bottomNavItem} ${styles.bottomNavActive}` : styles.bottomNavItem
          }
        >
          <img src={BACKOFFICE_NAV_ICONS[item.id]} alt="" width={20} height={20} />
          {t.items[item.id]}
        </NavLink>
      ))}
    </nav>
  )
}
