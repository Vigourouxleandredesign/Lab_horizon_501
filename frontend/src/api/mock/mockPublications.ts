/**
 * Adaptateur mock — enrichit les données de démonstration (`data/labData`)
 * au format des contrats DTO (`api/types`).
 *
 * Sert de référence de comportement pour l'API Laravel : mêmes filtres,
 * même tri, même pagination que le contrat REST documenté dans
 * `api/publications.ts`.
 */

import { publications, researchers } from '../../data/labData'
import type {
  PublicationDetail,
  PublicationSearchParams,
  PublicationSummary,
  ResearcherProfile,
  ResearcherSearchParams,
  ResearcherSummary,
  SearchResult,
} from '../types'

/** Mois FR (sans accents, comme dans labData) → index pour le tri chronologique. */
const MONTH_INDEX: Record<string, number> = {
  janvier: 0,
  fevrier: 1,
  février: 1,
  mars: 2,
  avril: 3,
  mai: 4,
  juin: 5,
  juillet: 6,
  aout: 7,
  août: 7,
  septembre: 8,
  octobre: 9,
  novembre: 10,
  decembre: 11,
  décembre: 11,
}

function parseFrenchDate(label: string): { year: number | null; sortKey: number } {
  const yearMatch = label.match(/(\d{4})/)
  const year = yearMatch ? Number(yearMatch[1]) : null
  const monthName = label.trim().split(/\s+/)[0]?.toLowerCase() ?? ''
  const month = MONTH_INDEX[monthName] ?? 0
  return { year, sortKey: (year ?? 0) * 12 + month }
}

function toSummary(pub: (typeof publications)[number]): PublicationSummary {
  const { year } = parseFrenchDate(pub.date)
  return {
    id: pub.id,
    title: pub.title,
    category: pub.category,
    year,
    dateLabel: pub.date,
    authorName: pub.authorName,
    authorId: pub.authorId,
    institution: pub.institution,
    source: 'local',
  }
}

/** Exporté pour mockAccount — conversion labData → DTO. */
export function toSummaryFromLabData(pub: (typeof publications)[number]): PublicationSummary {
  return toSummary(pub)
}

function matchesQuery(pub: (typeof publications)[number], lower: string): boolean {
  return (
    pub.title.toLowerCase().includes(lower) ||
    pub.authorName.toLowerCase().includes(lower) ||
    pub.category.toLowerCase().includes(lower)
  )
}

export function mockSearchPublications(
  params: PublicationSearchParams,
): SearchResult<PublicationSummary> {
  const { query = '', category, year, sort = 'recent', page = 1, pageSize = 20 } = params
  const lower = query.trim().toLowerCase()

  const filtered = publications.filter((pub) => {
    if (category && pub.category !== category) return false
    if (year && parseFrenchDate(pub.date).year !== year) return false
    if (lower && !matchesQuery(pub, lower)) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'relevance' && lower) {
      const scoreA = a.title.toLowerCase().includes(lower) ? 1 : 0
      const scoreB = b.title.toLowerCase().includes(lower) ? 1 : 0
      if (scoreA !== scoreB) return scoreB - scoreA
    }
    return parseFrenchDate(b.date).sortKey - parseFrenchDate(a.date).sortKey
  })

  const start = (page - 1) * pageSize
  return {
    items: sorted.slice(start, start + pageSize).map(toSummary),
    total: sorted.length,
  }
}

export function mockGetPublication(id: string): PublicationDetail | null {
  const pub = publications.find((p) => p.id === id)
  if (!pub) return null

  const related = publications
    .filter((p) => p.category === pub.category && p.id !== pub.id)
    .slice(0, 3)
    .map(toSummary)

  // Corps vulgarisé de démonstration — remplacé par l'API (champ `body`).
  return {
    ...toSummary(pub),
    status: 'PUBLISHED',
    lead: 'Version vulgarisée de démonstration — le contenu final sera fourni par l’API Lab Horizon.',
    paragraphs: [
      `${pub.title} : cette étude menée par ${pub.authorName} (${pub.institution}) s’inscrit dans le domaine « ${pub.category} ».`,
      'Ce paragraphe illustre la mise en page du résumé vulgarisé : contexte de la recherche, question posée par l’équipe et méthode employée, expliqués sans jargon pour être accessibles à toutes et tous.',
      'Ce second paragraphe illustre la restitution des résultats : ce que l’étude a montré, pourquoi c’est important pour la Nouvelle-Calédonie et le Pacifique, et les pistes ouvertes pour la suite.',
    ],
    meta: {
      scientificTitle: pub.title,
      authors: pub.authorName,
      publishedAt: pub.date,
      lab: pub.institution,
    },
    sourceUrl: `https://hal.science/search/index/?q=${encodeURIComponent(pub.title)}`,
    related,
  }
}

function toResearcherSummary(r: (typeof researchers)[number]): ResearcherSummary {
  return {
    id: r.id,
    displayName: r.name,
    institution: r.institution,
    domain: r.domain,
    category: r.category,
    photoUrl: r.photo,
  }
}

export function mockSearchResearchers(
  params: ResearcherSearchParams,
): SearchResult<ResearcherSummary> {
  const { query = '', category } = params
  const lower = query.trim().toLowerCase()

  const filtered = researchers.filter((r) => {
    if (category && r.category !== category) return false
    if (!lower) return true
    return (
      r.name.toLowerCase().includes(lower) ||
      r.domain.toLowerCase().includes(lower) ||
      r.institution.toLowerCase().includes(lower)
    )
  })

  return { items: filtered.map(toResearcherSummary), total: filtered.length }
}

export function mockGetResearcher(id: string): ResearcherProfile | null {
  const researcher = researchers.find((r) => r.id === id)
  if (!researcher) return null

  return {
    ...toResearcherSummary(researcher),
    available: researcher.available,
    publications: publications
      .filter((p) => p.authorId === id)
      .map(toSummary)
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0)),
  }
}
