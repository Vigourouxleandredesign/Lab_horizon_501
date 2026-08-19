import { NavLink } from 'react-router-dom'
import { brandLogoSrc, figmaHomeAssets as A } from '../../assets/figmaHomeAssets'
import { useSiteNavigation } from '../../hooks/useSiteNavigation'
import { useLocale } from '../../hooks/useLocale'
import { commonCopy } from '../../i18n/common'
import { siteNavCopy } from '../../i18n/navigation'
import chrome from '../../style/chrome/siteChrome.module.css'

type Props = {
  /** Header flottant au-dessus du héro (pages domaine). */
  overlay?: boolean
}

export default function SiteHeader({ overlay = false }: Props) {
  const { locale, toggleLocale } = useLocale()
  const t = siteNavCopy[locale]
  const mainNavItems = useSiteNavigation('headerDesktop')

  return (
    <div
      className={overlay ? `${chrome.headerZone} ${chrome.headerZoneOverHero}` : chrome.headerZone}
    >
      <div className={chrome.headerStack}>
        {/*
          Accès chercheur (connexion / inscription) volontairement absent de la navigation
          grand public : V1 diffuse l'URL directement au référent chercheur.
          Voir docs/ux/07-pages-roles-roadmap.md.
        */}
        <header className={chrome.headerBar}>
          <div className={chrome.headerInner}>
          <NavLink to="/" className={chrome.logo}>
            <img src={brandLogoSrc} alt="" className={chrome.logoImg} width={42} height={42} />
            <span className={chrome.logoText}>Lab Horizon</span>
          </NavLink>
          <nav className={chrome.navCenter} aria-label={t.aria.mainNav}>
            {mainNavItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? chrome.navCenterLinkActive : undefined)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className={chrome.headerActions}>
            <button
              type="button"
              className={chrome.langBtn}
              onClick={toggleLocale}
              aria-label={commonCopy[locale].langToggle(locale)}
            >
              <img src={A.langGlobe} alt="" width={14} height={14} />
              <span>{locale.toUpperCase()}</span>
            </button>
          </div>
        </div>
        </header>
      </div>
    </div>
  )
}
