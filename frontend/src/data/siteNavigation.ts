import { figmaHomeAssets } from '../assets/figmaHomeAssets'
import { publicUrl } from '../lib/publicAsset'
import type { Locale } from '../i18n/home'
import { siteNavLabel } from '../i18n/navigation'

/**
 * Modèle unique de navigation Lab Horizon.
 * - Desktop (≥900px) : menu complet dans le header, pas de barre basse.
 * - Mobile : header minimal (logo + connexion) + barre basse.
 */
export type NavSurface = 'headerDesktop' | 'bottomMobile'

export const SITE_NAV_ITEM_IDS = [
  'home',
  'publications',
  'researchers',
  'about',
  'categories',
  'account',
] as const

export type SiteNavItemId = (typeof SITE_NAV_ITEM_IDS)[number]

const BOTTOM_NAV_ICONS: Partial<Record<SiteNavItemId, string>> = {
  home: figmaHomeAssets.bottomNav[0],
  publications: figmaHomeAssets.bottomNav[1],
  researchers: figmaHomeAssets.bottomNav[2],
  categories: publicUrl('ui/stat-grid.svg'),
}

/** Ordre d’affichage par surface. */
const SURFACE_ORDER: Record<NavSurface, readonly SiteNavItemId[]> = {
  headerDesktop: ['home', 'publications', 'categories', 'researchers', 'about', 'account'],
  bottomMobile: ['home', 'publications', 'researchers', 'categories'],
}

export type SiteNavItemConfig = {
  id: SiteNavItemId
  to: string
  surfaces: readonly NavSurface[]
  end?: boolean
}

export const SITE_NAV_CONFIG: readonly SiteNavItemConfig[] = [
  { id: 'home', to: '/', surfaces: ['headerDesktop', 'bottomMobile'], end: true },
  { id: 'publications', to: '/recherche', surfaces: ['headerDesktop', 'bottomMobile'] },
  { id: 'researchers', to: '/chercheurs', surfaces: ['headerDesktop', 'bottomMobile'] },
  { id: 'about', to: '/a-propos', surfaces: ['headerDesktop'] },
  { id: 'categories', to: '/categories', surfaces: ['headerDesktop', 'bottomMobile'] },
  { id: 'account', to: '/compte', surfaces: ['headerDesktop'] },
] as const

export type ResolvedSiteNavItem = {
  id: SiteNavItemId
  to: string
  label: string
  end?: boolean
  icon?: string
}

const configById = Object.fromEntries(SITE_NAV_CONFIG.map((item) => [item.id, item])) as Record<
  SiteNavItemId,
  SiteNavItemConfig
>

export function getSiteNavItems(locale: Locale, surface: NavSurface): ResolvedSiteNavItem[] {
  const labelZone = surface === 'headerDesktop' ? 'headerDesktop' : 'bottom'

  return SURFACE_ORDER[surface]
    .map((id) => configById[id])
    .filter((item): item is SiteNavItemConfig => item.surfaces.includes(surface))
    .map((item) => ({
      id: item.id,
      to: item.to,
      label: siteNavLabel(locale, item.id, labelZone),
      end: item.end,
      icon: surface === 'bottomMobile' ? BOTTOM_NAV_ICONS[item.id] : undefined,
    }))
}
