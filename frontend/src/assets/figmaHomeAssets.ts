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

/** Logos réels des laboratoires / unités partenaires — `public/logos/`. */
const LAB_LOGO_BY_ID: Record<string, string> = {
  isea: 'logos/logo-isea.svg',
  larje: 'logos/logo-larje.svg',
  entropie: 'logos/logo-entropie.webp',
  'espace-dev': 'logos/logo-espace-dev.webp',
}

/** Logo d'un labo/UMR, ou `undefined` si non fourni (repli monogramme côté UI). */
export function getLabLogoSrc(id: string): string | undefined {
  const path = LAB_LOGO_BY_ID[id]
  return path ? publicUrl(path) : undefined
}

/** Pastilles domaine — WebP dans `public/pillules/` (une image par catégorie UNC). */
const DOMAIN_PILL_BY_SLUG: Record<string, string> = {
  'biodiversite-environnement-sante': 'pillules/biologie.webp',
  geosciences: 'pillules/geoscience.webp',
  'education-sante': 'pillules/Education.webp',
  'economie-gestion': 'pillules/Economie.webp',
  'droit-sciences-politiques': 'pillules/droit.webp',
  'histoire-archeologie': 'pillules/Histoire.webp',
  'societes-langues-cultures-oceaniennes': 'pillules/Culture.webp',
  informatique: 'pillules/Informatique.webp',
}

const pillFallback = publicUrl(DOMAIN_PILL_BY_SLUG['biodiversite-environnement-sante'])

export const domainPillImageById: Record<string, string> = Object.fromEntries(
  Object.entries(DOMAIN_PILL_BY_SLUG).map(([slug, path]) => [slug, publicUrl(path)]),
)

export function getDomainPillSrc(id: string): string {
  return domainPillImageById[id] ?? pillFallback
}

export function getHomeHeroSrc(): string {
  return publicUrl('hero/hero_lab_horizon.webp')
}

/** Héro page /categories — réutilise l'ambiance labo de l'accueil. */
export function getCategoriesHeroSrc(): string {
  return publicUrl('hero/hero_lab_horizon.webp')
}

/** Héro page /chercheurs — chercheuse en laboratoire (Unsplash, libre de droit). */
export function getUncResearchHeroSrc(): string {
  return publicUrl('hero/unc-research.jpg')
}

/** Héro page /a-propos — équipe au travail (Unsplash, libre de droit). */
export function getAboutHeroSrc(): string {
  return publicUrl('hero/about-corporate.jpg')
}

const DOMAIN_HERO_DIR = 'hero/heros avant retravaille'

/** Fond (zindex0) + calque (zindex1) par catégorie. */
const DOMAIN_HERO_BY_SLUG: Record<string, { background: string; layer: string }> = {
  geosciences: {
    background: 'Geoscience zindex0.jpg',
    layer: 'Geoscience zindex1.webp',
  },
  'education-sante': {
    background: 'Education zindex0.jpg',
    layer: 'Education zindex1.webp',
  },
  'economie-gestion': {
    background: 'Economie zindex0.jpg',
    layer: 'Economie zindex1.webp',
  },
  'droit-sciences-politiques': {
    background: 'Droit zindex0.jpg',
    layer: 'Droit zindex1.webp',
  },
  'histoire-archeologie': {
    background: 'History zindex0.jpg',
    layer: 'History zindex1.webp',
  },
  'societes-langues-cultures-oceaniennes': {
    background: 'Culture zindex0.jpg',
    layer: 'Culture zindex1.webp',
  },
  informatique: {
    background: 'Informatique zindex0.jpg',
    layer: 'Informatique zindex1.webp',
  },
}

function domainHeroAssetUrl(filename: string): string {
  const dir = DOMAIN_HERO_DIR.split('/').map(encodeURIComponent).join('/')
  return publicUrl(`${dir}/${encodeURIComponent(filename)}`)
}

/** Image héro des pages domaine (fond, zindex 0). */
export function getDomainHeroSrc(slug: string): string {
  const entry = DOMAIN_HERO_BY_SLUG[slug]
  if (!entry) return publicUrl('hero/hero_biodiversite_ss_arbre.webp')
  return domainHeroAssetUrl(entry.background)
}

/** Calque WebP transparent au-dessus du héro (zindex 1). */
export function getDomainHeroLayerSrc(slug: string): string {
  const entry = DOMAIN_HERO_BY_SLUG[slug]
  if (!entry) return publicUrl('hero/layer-placeholder.webp')
  return domainHeroAssetUrl(entry.layer)
}
