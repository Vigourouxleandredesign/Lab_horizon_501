import { NavLink } from 'react-router-dom'
import { useSiteNavigation } from '../../hooks/useSiteNavigation'
import { useLocale } from '../../hooks/useLocale'
import { siteNavCopy } from '../../i18n/navigation'
import chrome from '../../style/chrome/siteChrome.module.css'

export default function SiteBottomNav() {
  const { locale } = useLocale()
  const t = siteNavCopy[locale]
  const quickNavItems = useSiteNavigation('bottomMobile')

  return (
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
  )
}
