/**
 * Façade espace chercheur — dashboard, veille, publications, validation (D5, D6).
 *
 * Contrat REST cible (back à livrer) :
 *   GET  /api/me/dashboard
 *   GET  /api/me/publications
 *   GET  /api/me/publications/:id/review
 *   POST /api/me/publications/:id/validate
 *
 * Mode hybride : même en `rest`, mock tant que ces endpoints n'existent pas
 * (évite de casser `/compte`). TODO : F7–F8 docs/front-back-status-v1.md.
 */

import {
  mockGetDashboard,
  mockGetMyPublications,
  mockGetPublicationReview,
  mockValidatePublication,
  MOCK_DEMO_RESEARCHER_ID,
} from './mock/mockAccount'
import { apiRequest } from './http'
import type {
  DashboardData,
  PublicationReview,
  ResearcherPublicationItem,
  ValidatePublicationPayload,
} from './types'

/** Passe à true quand le back expose le dashboard / mes publications / review. */
const ACCOUNT_API_READY = false

export async function getDashboard(signal?: AbortSignal): Promise<DashboardData> {
  if (ACCOUNT_API_READY) {
    return apiRequest<DashboardData>('/api/me/dashboard', { signal })
  }
  return mockGetDashboard(MOCK_DEMO_RESEARCHER_ID)
}

export async function getMyPublications(
  signal?: AbortSignal,
): Promise<ResearcherPublicationItem[]> {
  if (ACCOUNT_API_READY) {
    return apiRequest<ResearcherPublicationItem[]>('/api/me/publications', { signal })
  }
  return mockGetMyPublications(MOCK_DEMO_RESEARCHER_ID)
}

export async function getPublicationReview(
  publicationId: string,
  signal?: AbortSignal,
): Promise<PublicationReview | null> {
  if (ACCOUNT_API_READY) {
    return apiRequest<PublicationReview>(
      `/api/me/publications/${encodeURIComponent(publicationId)}/review`,
      { signal },
    )
  }
  return mockGetPublicationReview(publicationId)
}

export async function validatePublication(
  publicationId: string,
  payload: ValidatePublicationPayload,
): Promise<void> {
  if (ACCOUNT_API_READY) {
    await apiRequest<void>(`/api/me/publications/${encodeURIComponent(publicationId)}/validate`, {
      method: 'POST',
      body: payload,
    })
    return
  }
  mockValidatePublication(publicationId, payload)
}
