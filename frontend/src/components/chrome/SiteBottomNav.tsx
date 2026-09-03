import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { useSiteNavigation } from '../../hooks/useSiteNavigation'
import { useLocale } from '../../hooks/useLocale'
import { siteNavCopy, siteNavLabel } from '../../i18n/navigation'
import chrome from '../../style/chrome/siteChrome.module.css'

export default function SiteBottomNav() {
  const { locale } = useLocale()
  const t = siteNavCopy[locale]
  const { status } = useAuth()
  const location = useLocation()
  const quickNavItems = useSiteNavigation('bottomMobile')

  const researcherActive =
    location.pathname === '/connexion' || location.pathname === '/inscription'
  const accountActive = location.pathname.startsWith('/compte')

  return (
    <div className={chrome.bottomNavZone}>
      {status !== 'authenticated' ? (
        <NavLink
          to="/connexion"
          className={
            researcherActive
              ? `${chrome.bottomResearcherTab} ${chrome.bottomResearcherTabActive}`
              : chrome.bottomResearcherTab
          }
          aria-label={t.aria.researchersAccess}
        >
          {t.researchersAccess}
        </NavLink>
      ) : (
        <NavLink
          to="/compte"
          className={
            accountActive
              ? `${chrome.bottomResearcherTab} ${chrome.bottomResearcherTabActive}`
              : chrome.bottomResearcherTab
          }
        >
          {siteNavLabel(locale, 'account', 'bottom')}
        </NavLink>
      )}

      <nav className={chrome.bottomNav} aria-label={t.aria.quickNav}>
        {quickNavItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? `${chrome.bottomNavItem} ${chrome.bottomNavActive}` : chrome.bottomNavItem
            }
          >
            {item.icon ? <img src={item.icon} alt="" width={20} height={20} /> : null}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
