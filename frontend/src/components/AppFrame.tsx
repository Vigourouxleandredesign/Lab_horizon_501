import { NavLink, Outlet, useMatch } from 'react-router-dom'
import { brandLogoSrc } from '../assets/figmaHomeAssets'
import SiteBottomNav from './chrome/SiteBottomNav'
import SiteHeader from './chrome/SiteHeader'
import chrome from '../style/chrome/siteChrome.module.css'

export default function AppFrame() {
  const isHomePage = Boolean(useMatch({ path: '/', end: true }))
  const isCategoryDomainPage = Boolean(useMatch('/categories/:slug'))
  const headerOverHero = isHomePage || isCategoryDomainPage

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
            <NavLink to="/mentions-legales">Mentions legales</NavLink>
            <span className={chrome.footerSep}>|</span>
            <NavLink to="/confidentialite">Confidentialite</NavLink>
            <span className={chrome.footerSep}>|</span>
            <NavLink to="/cookies">Cookies</NavLink>
          </nav>
          <p className={chrome.footerCopy}>© {new Date().getFullYear()} Lab Horizon</p>
        </div>
      </footer>

      <SiteBottomNav />
    </div>
  )
}
