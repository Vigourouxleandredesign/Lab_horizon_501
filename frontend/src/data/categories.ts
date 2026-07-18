import type { Locale } from '../i18n/home'

export type CategorySlug =
  | 'biodiversite-environnement-sante'
  | 'geosciences'
  | 'education-sante'
  | 'economie-gestion'
  | 'droit-sciences-politiques'
  | 'histoire-archeologie'
  | 'societes-langues-cultures-oceaniennes'

export type UncCategory = {
  slug: CategorySlug
  labelFr: string
  labelEn: string
  publicationCount: number
}

export const UNC_CATEGORIES: UncCategory[] = [
  {
    slug: 'biodiversite-environnement-sante',
    labelFr: 'Biodiversité, environnement et santé',
    labelEn: 'Biodiversity, environment and health',
    publicationCount: 24,
  },
  {
    slug: 'geosciences',
    labelFr: 'Géosciences (sciences de la Terre)',
    labelEn: 'Geosciences (Earth sciences)',
    publicationCount: 18,
  },
  {
    slug: 'education-sante',
    labelFr: 'Éducation & Santé',
    labelEn: 'Education & Health',
    publicationCount: 15,
  },
  {
    slug: 'economie-gestion',
    labelFr: 'Économie & gestion',
    labelEn: 'Economics & management',
    publicationCount: 12,
  },
  {
    slug: 'droit-sciences-politiques',
    labelFr: 'Droit & sciences politiques',
    labelEn: 'Law & political science',
    publicationCount: 14,
  },
  {
    slug: 'histoire-archeologie',
    labelFr: 'Histoire & Archéologie',
    labelEn: 'History & Archaeology',
    publicationCount: 9,
  },
  {
    slug: 'societes-langues-cultures-oceaniennes',
    labelFr: 'Sociétés, langues & cultures océaniennes',
    labelEn: 'Oceanian societies, languages & cultures',
    publicationCount: 11,
  },
]

export function categoryBySlug(slug: string | null | undefined): UncCategory | undefined {
  if (!slug) return undefined
  return UNC_CATEGORIES.find((c) => c.slug === slug)
}

export function categoryLabel(slug: string, locale: Locale): string {
  const cat = categoryBySlug(slug)
  if (!cat) return slug
  return locale === 'fr' ? cat.labelFr : cat.labelEn
}

export function categoryLabels(locale: Locale): string[] {
  return UNC_CATEGORIES.map((c) => (locale === 'fr' ? c.labelFr : c.labelEn))
}

export function slugFromLabel(label: string): CategorySlug | undefined {
  const found = UNC_CATEGORIES.find((c) => c.labelFr === label || c.labelEn === label)
  return found?.slug
}

/** Libellés FR — compatibilité filtres mock `labData`. */
export const categories = UNC_CATEGORIES.map((c) => c.labelFr) as readonly string[]
