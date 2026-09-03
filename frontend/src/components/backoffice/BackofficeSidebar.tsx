import { NavLink } from 'react-router-dom'
import { brandLogoSrc } from '../../assets/figmaHomeAssets'
import { BACKOFFICE_NAV_ICONS, BACKOFFICE_NAV_ITEMS } from '../../data/backofficeNavigation'
import { useLocale } from '../../hooks/useLocale'
import { backofficeNavCopy } from '../../i18n/backoffice'
import styles from '../../style/backoffice/backoffice.module.css'

/** Sidebar verticale fixe (desktop ≥900px) — remplace la top bar globale. */
export default function BackofficeSidebar() {
  const { locale } = useLocale()
  const t = backofficeNavCopy[locale]

  return (
    <nav className={styles.sidebar} aria-label={t.aria}>
      <NavLink to="/compte/nouveautes" className={styles.sidebarBrand}>
        <img src={brandLogoSrc} alt="" width={36} height={36} />
        <span>{t.brand}</span>
      </NavLink>

      <ul className={styles.sidebarList}>
        {BACKOFFICE_NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? `${styles.sidebarLink} ${styles.sidebarLinkActive}`
                  : styles.sidebarLink
              }
            >
              <img src={BACKOFFICE_NAV_ICONS[item.id]} alt="" width={20} height={20} />
              <span>{t.items[item.id]}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
