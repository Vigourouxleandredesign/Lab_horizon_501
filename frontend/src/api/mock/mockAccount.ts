/**
 * Adaptateur mock — espace chercheur connecté (dashboard, veille, publications).
 * Référence de comportement pour l'API Laravel (cf. api/account.ts).
 */

import { publications, researchers } from '../../data/labData'
import type {
  DashboardData,
  PublicationReview,
  ResearcherPublicationItem,
  ValidatePublicationPayload,
  WatchItem,
} from '../types'
import { mockGetPublication, toSummaryFromLabData } from './mockPublications'

/** Chercheur de démonstration — aligné sur DEMO_USER.researcherId. */
const DEMO_RESEARCHER_ID = '1'

const WATCH_ITEMS: WatchItem[] = [
  { id: 'w1', keyword: 'Récifs coralliens Pacifique', newCount: 3, dateLabel: "Aujourd'hui" },
  { id: 'w2', keyword: 'Chimie marine anticancéreux', newCount: 1, dateLabel: 'Hier' },
  { id: 'w3', keyword: 'Biodiversité marine Calédonie', newCount: 0, dateLabel: 'Il y a 3 j' },
]

/** Statuts simulés pour illustrer le flux de validation (D6). */
const STATUS_BY_ID: Record<string, ResearcherPublicationItem['status']> = {
  '1': 'PUBLISHED',
  '5': 'PUBLISHED',
  '6': 'PENDING_AI_VALIDATION',
}

function researcherPublications(researcherId: string): ResearcherPublicationItem[] {
  return publications
    .filter((p) => p.authorId === researcherId)
    .map((p) => ({
      ...toSummaryFromLabData(p),
      status: STATUS_BY_ID[p.id] ?? 'DRAFT',
    }))
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
}

export function mockGetDashboard(researcherId: string): DashboardData {
  const researcher = researchers.find((r) => r.id === researcherId) ?? researchers[0]
  const pubs = researcherPublications(researcher.id)
  const watchNewCount = WATCH_ITEMS.reduce((sum, w) => sum + w.newCount, 0)
  const draftsCount = pubs.filter((p) => p.status !== 'PUBLISHED').length

  return {
    dateLabel: new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date()),
    greeting: researcher.name.split(' ').slice(-1)[0] ?? researcher.name,
    stats: {
      views: 1240,
      publicationsCount: pubs.filter((p) => p.status === 'PUBLISHED').length,
      watchNewCount,
      draftsCount,
    },
    watchItems: WATCH_ITEMS,
  }
}

export function mockGetMyPublications(researcherId: string): ResearcherPublicationItem[] {
  return researcherPublications(researcherId)
}

export function mockGetPublicationReview(publicationId: string): PublicationReview | null {
  const pub = publications.find((p) => p.id === publicationId)
  if (!pub) return null

  const detail = mockGetPublication(publicationId)
  if (!detail) return null

  return {
    publicationId,
    originalTitle: pub.title,
    vulgarizedTitle: detail.title,
    vulgarizedLead: detail.lead ?? '',
    vulgarizedParagraphs: detail.paragraphs,
    status: STATUS_BY_ID[publicationId] ?? 'PENDING_AI_VALIDATION',
  }
}

export function mockValidatePublication(
  publicationId: string,
  payload: ValidatePublicationPayload,
): void {
  if (payload.accepted) {
    STATUS_BY_ID[publicationId] = 'PUBLISHED'
  }
}

/** Id chercheur utilisé en mode démo lorsque l'API n'est pas disponible. */
export const MOCK_DEMO_RESEARCHER_ID = DEMO_RESEARCHER_ID
