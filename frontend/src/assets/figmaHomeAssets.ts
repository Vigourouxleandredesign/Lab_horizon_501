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
export const brandDetectiveLogoSrc = publicUrl('brand/logo-detective.svg')

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

const DOMAIN_HERO_DIR = 'hero/heros avant retravaille'

/** Fond (zindex0) + calque (zindex1) par catégorie. */
const DOMAIN_HERO_BY_SLUG: Record<string, { background: string; layer: string }> = {
  geosciences: {
    background: 'Geoscience zindex0.jpg',
    layer: 'Geoscience zindex1.png',
  },
  'education-sante': {
    background: 'Education zindex0.jpg',
    layer: 'Education zindex1.png',
  },
  'economie-gestion': {
    background: 'Economie zindex0.jpg',
    layer: 'Economie zindex1.png',
  },
  'droit-sciences-politiques': {
    background: 'Droit zindex0.jpg',
    layer: 'Droit zindex1.png',
  },
  'histoire-archeologie': {
    background: 'History zindex0.jpg',
    layer: 'History zindex1.png',
  },
  'societes-langues-cultures-oceaniennes': {
    background: 'Culture zindex0.jpg',
    layer: 'Culture zindex1.png',
  },
}

function domainHeroAssetUrl(filename: string): string {
  const dir = DOMAIN_HERO_DIR.split('/').map(encodeURIComponent).join('/')
  return publicUrl(`${dir}/${encodeURIComponent(filename)}`)
}

/** Image héro des pages domaine (fond, zindex 0). */
export function getDomainHeroSrc(slug: string): string {
  const entry = DOMAIN_HERO_BY_SLUG[slug]
  if (!entry) return publicUrl('hero/hero_biodiversite_ss_arbre.png')
  return domainHeroAssetUrl(entry.background)
}

/** Calque PNG transparent au-dessus du héro (zindex 1). */
export function getDomainHeroLayerSrc(slug: string): string {
  const entry = DOMAIN_HERO_BY_SLUG[slug]
  if (!entry) return publicUrl('hero/layer-placeholder.png')
  return domainHeroAssetUrl(entry.layer)
}
