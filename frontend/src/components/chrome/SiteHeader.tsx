import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { brandLogoSrc } from '../../assets/figmaHomeAssets'
import LanguageMenu from './LanguageMenu'
import { useSiteNavigation } from '../../hooks/useSiteNavigation'
import { useLocale } from '../../hooks/useLocale'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { siteNavCopy } from '../../i18n/navigation'
import chrome from '../../style/chrome/siteChrome.module.css'

type Props = {
  /** Header flottant au-dessus du héro (pages domaine). */
  overlay?: boolean
}

/**
 * Sur desktop, le header est fixe : plein largeur en haut de page, puis il se
 * rétracte en pillule flottante dès que l'utilisateur scrolle.
 * Sur mobile (< 900px), le header haut est masqué tant que la barre de
 * navigation basse est présente (voir .headerZone / .bottomNav).
 */
export default function SiteHeader({ overlay = false }: Props) {
  const { locale } = useLocale()
  const t = siteNavCopy[locale]
  const mainNavItems = useSiteNavigation('headerDesktop')

  const isDesktop = useMediaQuery('(min-width: 900px)')
  const [pill, setPill] = useState(false)
  const rafRef = useRef(0)

  useEffect(() => {
    if (!isDesktop) {
      setPill(false)
      return
    }

    const update = () => {
      rafRef.current = 0
      setPill(window.scrollY > 24)
    }
    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
  }, [isDesktop])

  const zoneClass = [
    chrome.headerZone,
    overlay ? chrome.headerZoneOverHero : '',
    isDesktop ? chrome.headerZoneDesktop : '',
    isDesktop && pill ? chrome.headerZonePill : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <div className={zoneClass}>
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
            <LanguageMenu />
          </div>
        </div>
        </header>
      </div>
    </div>
      {/* Réserve la hauteur du header fixe (desktop, hors pages à héro plein écran). */}
      {!overlay ? <div className={chrome.headerSpacerDesktop} aria-hidden="true" /> : null}
    </>
  )
}
