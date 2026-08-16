/**
 * Client REST Laravel — endpoint `/api/recherches`.
 *
 * Les filtres front (q, category, year, sort, pageSize) ne sont pas envoyés :
 * l'API n'accepte que `page` pour l'instant (voir docs/front-back-status-v1.md).
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
    params: { page: params.page ?? 1 },
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
