/**
 * Adaptateur HAL — recherche réelle sur l'API publique archives-ouvertes.fr.
 *
 * Démonstration concrète du flux « recherche connectée » avant l'API Laravel :
 * mêmes contrats DTO que le mock, seule la provenance change (`source: 'hal'`).
 * Lecture seule, sans credentials (l'API HAL est ouverte).
 */

import { halRequest } from '../http'
import type {
  PublicationDetail,
  PublicationSearchParams,
  PublicationSummary,
  SearchResult,
} from '../types'

/** Champs demandés à HAL — le strict nécessaire (moindre exposition, réponses légères). */
const HAL_FIELDS = 'docid,title_s,authFullName_s,producedDate_s,uri_s,labStructName_s,abstract_s'

type HalDoc = {
  docid: number | string
  title_s?: string[]
  authFullName_s?: string[]
  producedDate_s?: string
  uri_s?: string
  labStructName_s?: string[]
  abstract_s?: string[]
}

type HalResponse = {
  response?: {
    numFound?: number
    docs?: HalDoc[]
  }
}

function halYear(date: string | undefined): number | null {
  const match = date?.match(/^(\d{4})/)
  return match ? Number(match[1]) : null
}

function toSummary(doc: HalDoc): PublicationSummary {
  const year = halYear(doc.producedDate_s)
  return {
    id: String(doc.docid),
    title: doc.title_s?.[0] ?? 'Sans titre',
    category: null,
    year,
    dateLabel: doc.producedDate_s ?? '',
    authorName: doc.authFullName_s?.join(', ') ?? 'Auteur inconnu',
    authorId: null,
    institution: doc.labStructName_s?.[0] ?? null,
    source: 'hal',
  }
}

export async function halSearchPublications(
  params: PublicationSearchParams,
  signal?: AbortSignal,
): Promise<SearchResult<PublicationSummary>> {
  const { query = '', category, year, sort = 'recent', page = 1, pageSize = 20 } = params

  const filters: string[] = []
  if (year) filters.push(`producedDateY_i:${year}`)

  // HAL ne connaît pas nos catégories : le libellé sert de texte de recherche.
  const data = await halRequest<HalResponse>(
    {
      q: query.trim() || category || '*',
      wt: 'json',
      fl: HAL_FIELDS,
      rows: pageSize,
      start: (page - 1) * pageSize,
      sort: sort === 'recent' ? 'producedDate_tdate desc' : undefined,
      fq: filters.length ? filters.join(' AND ') : undefined,
    },
    signal,
  )

  return {
    items: (data.response?.docs ?? []).map(toSummary),
    total: data.response?.numFound ?? 0,
  }
}

export async function halGetPublication(
  id: string,
  signal?: AbortSignal,
): Promise<PublicationDetail | null> {
  const data = await halRequest<HalResponse>(
    { q: `docid:${id}`, wt: 'json', fl: HAL_FIELDS, rows: 1 },
    signal,
  )

  const doc = data.response?.docs?.[0]
  if (!doc) return null

  const abstract = doc.abstract_s?.[0]
  return {
    ...toSummary(doc),
    status: 'PUBLISHED',
    lead: 'Résultat issu de HAL — la vulgarisation Lab Horizon sera fournie par l’API.',
    paragraphs: abstract ? [abstract] : [],
    meta: {
      scientificTitle: doc.title_s?.[0] ?? null,
      authors: doc.authFullName_s?.join(', ') ?? null,
      publishedAt: doc.producedDate_s ?? null,
      lab: doc.labStructName_s?.[0] ?? null,
    },
    sourceUrl: doc.uri_s ?? null,
    related: [],
  }
}
