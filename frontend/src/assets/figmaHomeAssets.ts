import { researchers } from '../data/labData'
import { publicUrl } from '../lib/publicAsset'

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

/** Pillules domaine — PNG dans `public/pillules/` (une image par catégorie UNC). */
const DOMAIN_PILL_BY_SLUG: Record<string, string> = {
  'biodiversite-environnement-sante': 'pillules/biologie.png',
  geosciences: 'pillules/geoscience.png',
  'education-sante': 'pillules/Education.png',
  'economie-gestion': 'pillules/Economie.png',
  'droit-sciences-politiques': 'pillules/droit.png',
  'histoire-archeologie': 'pillules/Histoire.png',
  'societes-langues-cultures-oceaniennes': 'pillules/Culture.png',
}

const pillFallback = publicUrl(DOMAIN_PILL_BY_SLUG['biodiversite-environnement-sante'])

export const domainPillImageById: Record<string, string> = Object.fromEntries(
  Object.entries(DOMAIN_PILL_BY_SLUG).map(([slug, path]) => [slug, publicUrl(path)]),
)

export function getDomainPillSrc(id: string): string {
  return domainPillImageById[id] ?? pillFallback
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
