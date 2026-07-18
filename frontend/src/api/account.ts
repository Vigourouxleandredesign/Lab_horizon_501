/**
 * Façade espace chercheur — dashboard, veille, publications, validation (D5, D6).
 *
 * Contrat REST attendu (back Laravel, à implémenter) :
 *   GET  /api/me/dashboard                      → DashboardData
 *   GET  /api/me/publications                   → ResearcherPublicationItem[]
 *   GET  /api/me/publications/:id/review        → PublicationReview
 *   POST /api/me/publications/:id/validate      → void (passe en PUBLISHED si accepté)
 */

import { appConfig } from '../lib/config'
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

export async function getDashboard(signal?: AbortSignal): Promise<DashboardData> {
  if (appConfig.dataSource === 'rest') {
    return apiRequest<DashboardData>('/api/me/dashboard', { signal })
  }
  return mockGetDashboard(MOCK_DEMO_RESEARCHER_ID)
}

export async function getMyPublications(
  signal?: AbortSignal,
): Promise<ResearcherPublicationItem[]> {
  if (appConfig.dataSource === 'rest') {
    return apiRequest<ResearcherPublicationItem[]>('/api/me/publications', { signal })
  }
  return mockGetMyPublications(MOCK_DEMO_RESEARCHER_ID)
}

export async function getPublicationReview(
  publicationId: string,
  signal?: AbortSignal,
): Promise<PublicationReview | null> {
  if (appConfig.dataSource === 'rest') {
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
  if (appConfig.dataSource === 'rest') {
    await apiRequest<void>(`/api/me/publications/${encodeURIComponent(publicationId)}/validate`, {
      method: 'POST',
      body: payload,
    })
    return
  }
  mockValidatePublication(publicationId, payload)
}
