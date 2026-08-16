/**
 * Mappers Laravel `Recherche` → DTO front (`PublicationSummary` / `PublicationDetail`).
 *
 * Le back expose `/api/recherches` en snake_case + pagination Laravel.
 * Les pages consomment uniquement les DTO camelCase de `types.ts`.
 *
 * Contournements front (tant que le back n'expose pas `pdf_url` / `covers`) :
 * - URL PDF construite depuis `pdf_path` + `VITE_API_BASE_URL`
 * - covers parsées depuis `description` (format produit par le script d'extract)
 */

import { appConfig } from '../../lib/config'
import type {
  PublicationDetail,
  PublicationSource,
  PublicationSummary,
  SearchResult,
} from '../types'

/** Sous-ensemble des champs renvoyés par l'API recherches. */
export type LaravelDomaine = {
  id: number
  code?: string
  label?: string
}

export type LaravelAuteur = {
  id: number
  nom?: string
}

export type LaravelStructure = {
  id: number
  nom?: string
}

export type LaravelVulgarisation = {
  id: number
  titre?: string
  resume?: string | null
  niveau_public?: string
  langue?: string
  pdf_path?: string | null
  pdf_url?: string | null
  created_at?: string
}

export type LaravelRecherche = {
  id: number
  titre?: string
  description?: string | null
  abstract?: string | null
  date_production?: string | null
  source?: string | null
  hal_id?: string | null
  hal_url?: string | null
  pdf_path?: string | null
  pdf_url?: string | null
  vulgarisations_count?: number
  domaines?: LaravelDomaine[]
  auteurs?: LaravelAuteur[]
  structures?: LaravelStructure[]
  vulgarisations?: LaravelVulgarisation[]
}

export type LaravelPaginator<T> = {
  data: T[]
  meta?: {
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
  }
  // Certaines réponses Laravel mettent total à la racine
  total?: number
}

function mapSource(raw: string | null | undefined): PublicationSource {
  return raw === 'hal' ? 'hal' : 'local'
}

function yearFromDate(dateProduction: string | null | undefined): number | null {
  if (!dateProduction) return null
  const year = Number.parseInt(dateProduction.slice(0, 4), 10)
  return Number.isFinite(year) ? year : null
}

function dateLabelFrom(dateProduction: string | null | undefined): string {
  if (!dateProduction) return ''
  const year = yearFromDate(dateProduction)
  return year != null ? String(year) : dateProduction
}

function pickPrimaryDomaine(domaines: LaravelDomaine[] | undefined): string | null {
  return domaines?.[0]?.label ?? domaines?.[0]?.code ?? null
}

function pickPrimaryAuteur(auteurs: LaravelAuteur[] | undefined): {
  name: string
  id: string | null
} {
  const first = auteurs?.[0]
  if (!first) return { name: 'Auteur inconnu', id: null }
  return {
    name: first.nom?.trim() || 'Auteur inconnu',
    id: String(first.id),
  }
}

function pickInstitution(structures: LaravelStructure[] | undefined): string | null {
  return structures?.[0]?.nom ?? null
}

/** Construit une URL absolue vers un fichier servi par Laravel (`/files/...`). */
export function resolveFilesUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl?.trim()) return null
  const raw = pathOrUrl.trim()
  if (/^https?:\/\//i.test(raw)) return raw

  const base = appConfig.apiBaseUrl.replace(/\/$/, '')
  if (!base) return raw.startsWith('/') ? raw : `/files/${raw.replace(/^\/+/, '')}`

  let path = raw.startsWith('/') ? raw : `/${raw}`
  if (!path.startsWith('/files/')) {
    path = `/files/${path.replace(/^\/+/, '')}`
  }
  return `${base}${path}`
}

/**
 * Format attendu (script extract) :
 * `Test extract — covers: /files/.../a.jpg | /files/.../b.jpg`
 */
export function parseCoverUrlsFromDescription(
  description: string | null | undefined,
): string[] {
  if (!description?.trim()) return []
  const match = description.match(/covers:\s*(.+)$/i)
  if (!match?.[1]) return []

  return match[1]
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => resolveFilesUrl(part))
    .filter((url): url is string => Boolean(url))
}

function pickSourceUrl(recherche: LaravelRecherche): string | null {
  return (
    recherche.hal_url ??
    resolveFilesUrl(recherche.pdf_url) ??
    resolveFilesUrl(recherche.pdf_path)
  )
}

function pickCoverUrls(recherche: LaravelRecherche): string[] {
  return parseCoverUrlsFromDescription(recherche.description)
}

function splitResume(resume: string | null | undefined): { lead: string | null; paragraphs: string[] } {
  if (!resume?.trim()) return { lead: null, paragraphs: [] }
  const parts = resume
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts.length === 0) return { lead: null, paragraphs: [] }
  if (parts.length === 1) {
    // Un seul bloc : lead = première phrase approximative, reste en un paragraphe
    const text = parts[0]
    const sentenceBreak = text.search(/[.!?]\s+/)
    if (sentenceBreak > 40 && sentenceBreak < text.length - 20) {
      const cut = sentenceBreak + 1
      return {
        lead: text.slice(0, cut).trim(),
        paragraphs: [text.slice(cut).trim()].filter(Boolean),
      }
    }
    return { lead: text, paragraphs: [] }
  }
  return { lead: parts[0], paragraphs: parts.slice(1) }
}

function pickVulgarisation(
  list: LaravelVulgarisation[] | undefined,
): LaravelVulgarisation | undefined {
  if (!list?.length) return undefined
  return list.find((v) => v.niveau_public === 'grand_public') ?? list[0]
}

export function mapRechercheToSummary(recherche: LaravelRecherche): PublicationSummary {
  const author = pickPrimaryAuteur(recherche.auteurs)
  const coverUrls = pickCoverUrls(recherche)
  const vulga = pickVulgarisation(recherche.vulgarisations)
  const { lead } = splitResume(vulga?.resume ?? recherche.abstract)
  return {
    id: String(recherche.id),
    title: recherche.titre?.trim() || 'Sans titre',
    category: pickPrimaryDomaine(recherche.domaines),
    year: yearFromDate(recherche.date_production),
    dateLabel: dateLabelFrom(recherche.date_production),
    authorName: author.name,
    authorId: author.id,
    institution: pickInstitution(recherche.structures),
    source: mapSource(recherche.source),
    lead,
    sourceUrl: pickSourceUrl(recherche),
    coverUrl: coverUrls[0] ?? null,
  }
}

export function mapRechercheToDetail(recherche: LaravelRecherche): PublicationDetail {
  const summary = mapRechercheToSummary(recherche)
  const vulga = pickVulgarisation(recherche.vulgarisations)
  const { lead, paragraphs } = splitResume(vulga?.resume ?? recherche.abstract)
  const coverUrls = pickCoverUrls(recherche)

  const authorsLabel =
    recherche.auteurs?.map((a) => a.nom).filter(Boolean).join(', ') || summary.authorName

  return {
    ...summary,
    // Pas de statut côté back — catalogue public traité comme publié.
    status: 'PUBLISHED',
    lead: lead ?? summary.lead,
    paragraphs,
    meta: {
      scientificTitle: recherche.titre ?? null,
      authors: authorsLabel,
      publishedAt: recherche.date_production ?? null,
      lab: pickInstitution(recherche.structures),
    },
    coverUrls,
    related: [],
  }
}

export function mapRecherchePaginator(
  page: LaravelPaginator<LaravelRecherche>,
): SearchResult<PublicationSummary> {
  const items = (page.data ?? []).map(mapRechercheToSummary)
  const total = page.meta?.total ?? page.total ?? items.length
  return { items, total }
}
