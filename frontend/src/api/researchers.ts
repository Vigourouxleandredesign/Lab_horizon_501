/**
 * Façade chercheurs — accès réservé aux chercheurs connectés (D3).
 *
 * Le front conditionne l'affichage, mais la règle de visibilité est une
 * règle serveur : l'API Laravel devra répondre 401/403 sans session valide.
 *
 * Contrat REST attendu (back Laravel, à implémenter) :
 *   GET /api/researchers?q=&category=   → SearchResult<ResearcherSummary>   (auth requise)
 *   GET /api/researchers/:id            → ResearcherProfile                 (auth requise)
 *   POST /api/researchers/:id/follow    → veille (D5)                       (auth requise)
 */

import { appConfig } from '../lib/config'
import { apiRequest } from './http'
import { mockGetResearcher, mockSearchResearchers } from './mock/mockPublications'
import type {
  ResearcherProfile,
  ResearcherSearchParams,
  ResearcherSummary,
  SearchResult,
} from './types'

export async function searchResearchers(
  params: ResearcherSearchParams,
  signal?: AbortSignal,
): Promise<SearchResult<ResearcherSummary>> {
  if (appConfig.dataSource === 'rest') {
    return apiRequest<SearchResult<ResearcherSummary>>('/api/researchers', {
      params: { q: params.query, category: params.category },
      signal,
    })
  }
  // HAL n'expose pas d'annuaire chercheurs : le mock sert aussi en mode 'hal'.
  return mockSearchResearchers(params)
}

export async function getResearcher(
  id: string,
  signal?: AbortSignal,
): Promise<ResearcherProfile | null> {
  if (appConfig.dataSource === 'rest') {
    return apiRequest<ResearcherProfile>(`/api/researchers/${encodeURIComponent(id)}`, { signal })
  }
  return mockGetResearcher(id)
}

/** Suivre un chercheur (veille D5) — no-op documenté hors mode 'rest'. */
export async function followResearcher(id: string): Promise<void> {
  if (appConfig.dataSource === 'rest') {
    await apiRequest<void>(`/api/researchers/${encodeURIComponent(id)}/follow`, {
      method: 'POST',
    })
    return
  }
  // Mode démo : l'action est visuelle uniquement (aucune persistance).
}
