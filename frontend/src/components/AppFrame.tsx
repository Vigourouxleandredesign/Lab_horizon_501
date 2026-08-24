import { NavLink, Outlet, useMatch, useMatches } from 'react-router-dom'
import { brandLogoSrc } from '../assets/figmaHomeAssets'
import { useLocale } from '../hooks/useLocale'
import { commonCopy } from '../i18n/common'
import SiteBottomNav from './chrome/SiteBottomNav'
import SiteHeader from './chrome/SiteHeader'
import chrome from '../style/chrome/siteChrome.module.css'

export default function AppFrame() {
  const { locale } = useLocale()
  const footer = commonCopy[locale].footer
  const isHomePage = Boolean(useMatch({ path: '/', end: true }))
  const isCategoryDomainPage = Boolean(useMatch('/categories/:slug'))
  const overlayFromRoute = useMatches().some(
    (match) => (match.handle as { overlayHeader?: boolean } | undefined)?.overlayHeader,
  )
  const headerOverHero = isHomePage || isCategoryDomainPage || overlayFromRoute

  return (
    <div className={headerOverHero ? chrome.frameCategoryDomain : undefined}>
      <SiteHeader overlay={headerOverHero} />

      <Outlet />

      <footer className={chrome.footer}>
        <div className={chrome.footerInner}>
          <div className={chrome.footerBrand}>
            <img src={brandLogoSrc} alt="" width={42} height={42} className={chrome.footerLogo} />
            <span>Lab Horizon</span>
          </div>
          <nav className={chrome.footerLinks} aria-label="Pied de page">
            <NavLink to="/mentions-legales">{footer.legal}</NavLink>
            <span className={chrome.footerSep}>|</span>
            <NavLink to="/confidentialite">{footer.privacy}</NavLink>
            <span className={chrome.footerSep}>|</span>
            <NavLink to="/cookies">{footer.cookies}</NavLink>
          </nav>
          <p className={chrome.footerCopy}>© {new Date().getFullYear()} Lab Horizon</p>
        </div>
      </footer>

      <SiteBottomNav />
    </div>
  )
}
