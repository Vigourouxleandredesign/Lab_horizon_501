import {
  categoryBySlug,
  slugFromLabel,
  UNC_CATEGORIES,
  type CategorySlug,
} from '../data/categories'
import type { Locale } from '../i18n/home'

/** Parse une valeur d'URL `category` (slug ou ancien libellé FR/EN). */
export function parseCategorySlug(raw: string | null | undefined): CategorySlug | '' {
  if (!raw) return ''
  if (categoryBySlug(raw)) return raw as CategorySlug
  return slugFromLabel(raw) ?? ''
}

/** Slug carrousel / param `domain` → slug catégorie. */
export function categorySlugFromDomain(domain: string | null | undefined): CategorySlug | '' {
  if (!domain) return ''
  const cat = categoryBySlug(domain)
  return cat?.slug ?? ''
}

/** Libellés envoyés à l'API — alignés sur la table `domaines` du seed back. */
const API_CATEGORY_LABEL_BY_SLUG: Partial<Record<CategorySlug, string>> = {
  'biodiversite-environnement-sante': 'Biodiversité, environnement, santé',
  geosciences: 'Géosciences',
}

/** Paramètre `category` pour `GET /api/recherches` (matching normalisé côté Laravel). */
export function toApiCategoryParam(slug: CategorySlug | ''): string | undefined {
  if (!slug) return undefined
  return API_CATEGORY_LABEL_BY_SLUG[slug] ?? categoryBySlug(slug)?.labelFr
}

export function categoryOptions(locale: Locale) {
  return UNC_CATEGORIES.map((c) => ({
    slug: c.slug,
    label: locale === 'fr' ? c.labelFr : c.labelEn,
  }))
}
