/**
 * Client REST Laravel — endpoint `/api/recherches`.
 *
 * Filtres front (q, category, year, sort, pageSize) envoyés en query params ;
 * le back filtre côté serveur (titre/résumé/mots-clés/auteurs pour `q`,
 * domaine pour `category`, année pour `year`). Voir docs/api-contract-v1.md.
 */

import { apiRequest, ApiError } from '../http'
import type { PublicationDetail, PublicationSearchParams, PublicationSummary, SearchResult } from '../types'
import {
  mapRecherchePaginator,
  mapRechercheToDetail,
  type LaravelPaginator,
  type LaravelRecherche,
} from './mapRecherche'

export async function restSearchPublications(
  params: PublicationSearchParams,
  signal?: AbortSignal,
): Promise<SearchResult<PublicationSummary>> {
  const page = await apiRequest<LaravelPaginator<LaravelRecherche>>('/api/recherches', {
    params: {
      q: params.query || undefined,
      category: params.category,
      year: params.year,
      sort: params.sort,
      page: params.page ?? 1,
      pageSize: params.pageSize,
    },
    signal,
  })
  return mapRecherchePaginator(page)
}

export async function restGetPublication(
  id: string,
  signal?: AbortSignal,
): Promise<PublicationDetail | null> {
  try {
    const recherche = await apiRequest<LaravelRecherche>(
      `/api/recherches/${encodeURIComponent(id)}`,
      { signal },
    )
    return mapRechercheToDetail(recherche)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}
