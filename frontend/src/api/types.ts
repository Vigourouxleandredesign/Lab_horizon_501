/**
 * Contrats de données (DTO) partagés entre le front et les adaptateurs.
 *
 * Alignés sur `docs/data-dictionary-v1.md` (entités `publication`,
 * `researcher_profile`, `user`) : quand l'API Laravel arrivera, ces types
 * sont le contrat attendu des réponses JSON.
 */

/** Statuts du dictionnaire de données — le public ne voit que PUBLISHED (D4). */
export type PublicationStatus = 'DRAFT' | 'PENDING_AI_VALIDATION' | 'PUBLISHED'

/** Provenance d'un résultat — affichée à l'utilisateur (transparence). */
export type PublicationSource = 'local' | 'hal'

/** Carte de liste (recherche, domaine, publications liées). */
export type PublicationSummary = {
  id: string
  title: string
  /** Libellé de catégorie (null pour les sources externes non mappées). */
  category: string | null
  year: number | null
  /** Date d'affichage brute (ex. « Mars 2024 »). */
  dateLabel: string
  authorName: string
  /** Id du profil chercheur local — null pour une source externe (HAL). */
  authorId: string | null
  institution: string | null
  source: PublicationSource
  /** Accroche courte affichée dans les listes. */
  lead: string | null
  /** Lien PDF / HAL / source — le clic liste ouvre cette URL. */
  sourceUrl: string | null
  /** Première image de couverture si disponible (rest / extract local). */
  coverUrl?: string | null
  /** Mots-clés — utilisés par la recherche (q) et affichés en tags. */
  keywords: string[]
}

/** Grille méta Quoi / Qui / Quand / Lab (cf. docs/ux/03). */
export type PublicationMeta = {
  scientificTitle: string | null
  authors: string | null
  publishedAt: string | null
  lab: string | null
}

/** Page détail — corps vulgarisé + méta + aperçus. */
export type PublicationDetail = PublicationSummary & {
  status: PublicationStatus
  /** Corps vulgarisé, par paragraphes. */
  paragraphs: string[]
  meta: PublicationMeta
  /** Images extraites du PDF (tests locaux) — vide si absentes. */
  coverUrls: string[]
  related: PublicationSummary[]
}

/** Fiche chercheur — réservée aux chercheurs connectés (D3). */
export type ResearcherProfile = {
  id: string
  displayName: string
  institution: string
  domain: string
  category: string
  photoUrl: string
  available: boolean
  publications: PublicationSummary[]
}

/** Carte chercheur dans les résultats de recherche (connecté uniquement, D3). */
export type ResearcherSummary = {
  id: string
  displayName: string
  institution: string
  domain: string
  category: string
  photoUrl: string
}

export type PublicationSort = 'recent' | 'relevance'

export type PublicationSearchParams = {
  query?: string
  /** Libellé FR de catégorie (aligné sur les filtres actuels). */
  category?: string
  year?: number
  sort?: PublicationSort
  page?: number
  pageSize?: number
}

export type ResearcherSearchParams = {
  query?: string
  category?: string
}

export type SearchResult<T> = {
  items: T[]
  total: number
}

/** Utilisateur de session — rôle aligné sur `user.role` du dictionnaire. */
export type SessionUser = {
  id: string
  displayName: string
  email: string
  role: 'RESEARCHER' | 'ADMIN'
  /** Profil chercheur associé (1–1 pour le rôle RESEARCHER). */
  researcherId: string | null
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

/** Élément de veille (alerte mot-clé ou chercheur suivi). */
export type WatchItem = {
  id: string
  keyword: string
  newCount: number
  dateLabel: string
}

/** Statistiques du tableau de bord chercheur. */
export type DashboardStats = {
  views: number
  publicationsCount: number
  watchNewCount: number
  draftsCount: number
}

/** Données agrégées du tableau de bord — GET /api/me/dashboard (à implémenter). */
export type DashboardData = {
  dateLabel: string
  greeting: string
  stats: DashboardStats
  watchItems: WatchItem[]
}

/** Publication de l'auteur connecté (inclut les statuts non publics). */
export type ResearcherPublicationItem = PublicationSummary & {
  status: PublicationStatus
}

/** Contenu proposé pour validation vulgarisation (D6) — corps mocké en V1. */
export type PublicationReview = {
  publicationId: string
  originalTitle: string
  vulgarizedTitle: string
  vulgarizedLead: string
  vulgarizedParagraphs: string[]
  status: PublicationStatus
}

export type ValidatePublicationPayload = {
  accepted: boolean
  /** Corrections éventuelles du chercheur avant publication. */
  vulgarizedTitle?: string
  vulgarizedLead?: string
  vulgarizedParagraphs?: string[]
}
