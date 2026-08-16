/**
 * Façade chercheurs — accès réservé aux chercheurs connectés (D3).
 *
 * Contrat REST cible (back à livrer) :
 *   GET /api/researchers?q=&category=   → SearchResult<ResearcherSummary>
 *   GET /api/researchers/:id            → ResearcherProfile
 *   POST /api/researchers/:id/follow    → veille (D5)
 *
 * Mode hybride : même en `VITE_DATA_SOURCE=rest`, on reste sur le mock tant que
 * l'API researchers n'existe pas (évite de casser `/chercheurs/:id`).
 * TODO : brancher l'API dès livraison back (docs/front-back-status-v1.md F9).
 */

import { apiRequest } from './http'
import { mockGetResearcher, mockSearchResearchers } from './mock/mockPublications'
import type {
  ResearcherProfile,
  ResearcherSearchParams,
  ResearcherSummary,
  SearchResult,
} from './types'

/** Passe à true quand le back expose `/api/researchers`. */
const RESEARCHERS_API_READY = false

export async function searchResearchers(
  params: ResearcherSearchParams,
  signal?: AbortSignal,
): Promise<SearchResult<ResearcherSummary>> {
  if (RESEARCHERS_API_READY) {
    return apiRequest<SearchResult<ResearcherSummary>>('/api/researchers', {
      params: { q: params.query, category: params.category },
      signal,
    })
  }
  return mockSearchResearchers(params)
}

export async function getResearcher(
  id: string,
  signal?: AbortSignal,
): Promise<ResearcherProfile | null> {
  if (RESEARCHERS_API_READY) {
    return apiRequest<ResearcherProfile>(`/api/researchers/${encodeURIComponent(id)}`, { signal })
  }
  return mockGetResearcher(id)
}

/** Suivre un chercheur (veille D5) — no-op tant que l'API n'est pas prête. */
export async function followResearcher(id: string): Promise<void> {
  if (RESEARCHERS_API_READY) {
    await apiRequest<void>(`/api/researchers/${encodeURIComponent(id)}/follow`, {
      method: 'POST',
    })
  }
}
