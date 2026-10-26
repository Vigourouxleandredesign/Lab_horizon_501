import { describe, expect, it } from 'vitest'
import {
  categoryOptions,
  categorySlugFromDomain,
  parseCategorySlug,
  toApiCategoryParam,
} from '../../src/lib/categoryFilter'

describe('parseCategorySlug', () => {
  it('accepte un slug connu', () => {
    expect(parseCategorySlug('informatique')).toBe('informatique')
    expect(parseCategorySlug('geosciences')).toBe('geosciences')
  })

  it('résout un libellé FR historique', () => {
    expect(parseCategorySlug('Informatique')).toBe('informatique')
    expect(parseCategorySlug('Géosciences (sciences de la Terre)')).toBe('geosciences')
  })

  it('résout un libellé EN', () => {
    expect(parseCategorySlug('Computer Science')).toBe('informatique')
  })

  it('retourne vide pour null / inconnu', () => {
    expect(parseCategorySlug(null)).toBe('')
    expect(parseCategorySlug(undefined)).toBe('')
    expect(parseCategorySlug('mathématiques')).toBe('')
  })
})

describe('categorySlugFromDomain', () => {
  it('mappe un domain carrousel vers le slug catégorie', () => {
    expect(categorySlugFromDomain('informatique')).toBe('informatique')
  })

  it('retourne vide si domaine inconnu', () => {
    expect(categorySlugFromDomain('')).toBe('')
    expect(categorySlugFromDomain('astronomie')).toBe('')
  })
})

describe('toApiCategoryParam', () => {
  it('utilise le libellé seed pour les domaines catalogue', () => {
    expect(toApiCategoryParam('informatique')).toBe('Informatique')
    expect(toApiCategoryParam('geosciences')).toBe('Géosciences')
    expect(toApiCategoryParam('mathematiques')).toBe('Mathématiques')
    expect(toApiCategoryParam('physique')).toBe('Physique')
    expect(toApiCategoryParam('chimie')).toBe('Chimie')
    expect(toApiCategoryParam('biodiversite-environnement-sante')).toBe(
      'Biodiversité, environnement, santé',
    )
  })

  it('retombe sur labelFr pour les autres slugs', () => {
    expect(toApiCategoryParam('economie-gestion')).toBe('Économie & gestion')
  })

  it('retourne undefined si slug vide', () => {
    expect(toApiCategoryParam('')).toBeUndefined()
  })
})

describe('categoryOptions', () => {
  it('expose tous les domaines en FR/EN', () => {
    const fr = categoryOptions('fr')
    const en = categoryOptions('en')
    expect(fr).toHaveLength(11)
    expect(en).toHaveLength(11)
    expect(fr.find((o) => o.slug === 'informatique')?.label).toBe('Informatique')
    expect(en.find((o) => o.slug === 'informatique')?.label).toBe('Computer Science')
  })
})
