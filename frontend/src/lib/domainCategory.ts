import { UNC_CATEGORIES } from '../data/categories'
import type { Locale } from '../i18n/home'

/** Slug carrousel → libellé catégorie UNC (locale). */
export function categoryFromDomain(domain: string | null, locale: Locale = 'fr'): string | null {
  if (!domain) return null
  const cat = UNC_CATEGORIES.find((c) => c.slug === domain)
  if (!cat) return null
  return locale === 'fr' ? cat.labelFr : cat.labelEn
}

export function domainSlugFromCategoryLabel(label: string): string | null {
  const cat = UNC_CATEGORIES.find((c) => c.labelFr === label || c.labelEn === label)
  return cat?.slug ?? null
}
