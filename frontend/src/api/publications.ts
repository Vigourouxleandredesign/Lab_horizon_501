/**
 * Façade publications — point d'entrée unique des pages.
 *
 * La source réelle est choisie par `VITE_DATA_SOURCE` (cf. lib/config) :
 * les pages ne connaissent jamais l'adaptateur, seulement ces fonctions.
 *
 * Mode `rest` : `GET /api/recherches` (Laravel) via `api/rest/recherches.ts`.
 * Les filtres q/category/year/sort ne sont pas encore supportés côté API.
 */

import { appConfig } from '../lib/config'
import { halGetPublication, halSearchPublications } from './hal/halPublications'
import { mockGetPublication, mockSearchPublications } from './mock/mockPublications'
import { restGetPublication, restSearchPublications } from './rest/recherches'
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
      return restSearchPublications(params, signal)
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
      return restGetPublication(id, signal)
    default:
      return mockGetPublication(id)
  }
}
