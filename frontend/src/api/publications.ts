/**
 * Façade publications — point d'entrée unique des pages.
 *
 * La source réelle est choisie par `VITE_DATA_SOURCE` (cf. lib/config) :
 * les pages ne connaissent jamais l'adaptateur, seulement ces fonctions.
 *
 * Contrat REST attendu (back Laravel, à implémenter) :
 *   GET /api/publications?q=&category=&year=&sort=&page=&pageSize=  → SearchResult<PublicationSummary>
 *   GET /api/publications/:id                                       → PublicationDetail (404 si absent/privé)
 * Le back ne renvoie que les publications `PUBLISHED` aux non-connectés (D4).
 */

import { appConfig } from '../lib/config'
import { halGetPublication, halSearchPublications } from './hal/halPublications'
import { apiRequest } from './http'
import { mockGetPublication, mockSearchPublications } from './mock/mockPublications'
import type {
  PublicationDetail,
  PublicationSearchParams,
  PublicationSummary,
  SearchResult,
} from './types'

export async function searchPublications(
  params: PublicationSearchParams,
  signal?: AbortSignal,
): Promise<SearchResult<PublicationSummary>> {
  switch (appConfig.dataSource) {
    case 'hal':
      return halSearchPublications(params, signal)
    case 'rest':
      return apiRequest<SearchResult<PublicationSummary>>('/api/publications', {
        params: {
          q: params.query,
          category: params.category,
          year: params.year,
          sort: params.sort,
          page: params.page,
          pageSize: params.pageSize,
        },
        signal,
      })
    default:
      return mockSearchPublications(params)
  }
}

export async function getPublication(
  id: string,
  signal?: AbortSignal,
): Promise<PublicationDetail | null> {
  switch (appConfig.dataSource) {
    case 'hal':
      return halGetPublication(id, signal)
    case 'rest':
      return apiRequest<PublicationDetail>(`/api/publications/${encodeURIComponent(id)}`, {
        signal,
      })
    default:
      return mockGetPublication(id)
  }
}
