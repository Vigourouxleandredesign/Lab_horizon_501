import { researchers } from '../data/labData'
import { publicUrl } from '../lib/publicAsset'
import { UNC_CATEGORIES } from '../data/categories'

/** Icônes et images UI — fichiers locaux dans `public/ui` et `public/brand`. */
export const figmaHomeAssets = {
  researcherPhoto: researchers.slice(0, 3).map((r) => r.photo),
  chatFab: publicUrl('ui/chat.svg'),
  bottomNav: [
    publicUrl('ui/nav-home.svg'),
    publicUrl('ui/nav-search.svg'),
    publicUrl('ui/nav-users.svg'),
    publicUrl('ui/nav-account.svg'),
  ],
  searchLeading: publicUrl('ui/search.svg'),
  seeAllArrow: publicUrl('ui/arrow-right.svg'),
  carouselChevronLeft: publicUrl('ui/chevron-left.svg'),
  carouselChevronRight: publicUrl('ui/chevron-right.svg'),
  researcherChevron: publicUrl('ui/arrow-right.svg'),
  hintPillIcon: publicUrl('ui/sparkle.svg'),
  statIcons: [
    publicUrl('ui/stat-users.svg'),
    publicUrl('ui/stat-book.svg'),
    publicUrl('ui/stat-grid.svg'),
    publicUrl('ui/stat-globe.svg'),
  ],
  platformBadgeIcon: publicUrl('ui/sparkle.svg'),
  missionCtaArrow: publicUrl('ui/arrow-right.svg'),
  missionBadgeIcon: publicUrl('ui/sparkle.svg'),
  langGlobe: publicUrl('ui/globe.svg'),
  loginUser: publicUrl('ui/user.svg'),
} as const

export const brandLogoSrc = publicUrl('brand/logo-color-v3.svg')

const pillPlaceholder = publicUrl('pillules/biologie.png')

export const domainPillImageById: Record<string, string> = Object.fromEntries(
  UNC_CATEGORIES.map((c) => [c.slug, pillPlaceholder]),
)

export function getDomainPillSrc(id: string): string {
  return domainPillImageById[id] ?? pillPlaceholder
}

export function getHomeHeroSrc(): string {
  return publicUrl('hero/hero_lab_horizon.png')
}

/** Image héro des pages domaine (toutes catégories). */
export function getDomainHeroSrc(_slug: string): string {
  return publicUrl('hero/hero_biodiversite_ss_arbre.png')
}

/** Calque PNG transparent au-dessus du héro (branche, etc.). */
export function getDomainHeroLayerSrc(_slug: string): string {
  return publicUrl('hero/layer-placeholder.png')
}
