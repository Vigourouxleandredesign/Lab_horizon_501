/**
 * Façade « mes publications » chercheur — CRUD sur `/api/recherches` (auth requise).
 *
 * Contournement temporaire (doc plan backoffice) : le back n'expose ni
 * `?mine=1` ni `GET /api/me/publications`. `listMyRecherches` récupère donc
 * un lot de recherches récentes et filtre côté client par `user_id`.
 * Limite assumée : seules les 50 recherches les plus récentes de la
 * plateforme sont scannées — une publication plus ancienne du chercheur peut
 * ne pas apparaître. À remplacer dès que le back livre le vrai filtre
 * (todolist, roadmap back P1).
 */

import { apiRequest, ApiError } from '../http'
import type { PublicationSummary } from '../types'
import {
  mapRechercheToSummary,
  type LaravelPaginator,
  type LaravelRecherche,
} from './mapRecherche'

const MINE_SCAN_PAGE_SIZE = 50

export type MyRecherchePayload = {
  titre: string
  description?: string
  pdf?: File | null
}

export type MyRechercheEditPayload = {
  titre: string
  description?: string
}

function toFormData(payload: MyRecherchePayload): FormData {
  const form = new FormData()
  form.append('titre', payload.titre)
  if (payload.description) form.append('description', payload.description)
  if (payload.pdf) form.append('pdf', payload.pdf)
  return form
}

/**
 * Liste « mes publications » — contournement client (voir doc en tête de fichier).
 * TODO(back) : remplacer par `GET /api/me/publications` ou `GET /api/recherches?mine=1`.
 */
export async function listMyRecherches(
  userId: string,
  signal?: AbortSignal,
): Promise<PublicationSummary[]> {
  const page = await apiRequest<LaravelPaginator<LaravelRecherche>>('/api/recherches', {
    params: { pageSize: MINE_SCAN_PAGE_SIZE, sort: 'recent' },
    signal,
  })
  const numericUserId = Number(userId)
  return (page.data ?? [])
    .filter((item) => item.user_id != null && Number(item.user_id) === numericUserId)
    .map(mapRechercheToSummary)
}

/** Lecture brute (titre/description) pour préremplir un formulaire d'édition. */
export async function getRechercheRaw(
  id: string,
  signal?: AbortSignal,
): Promise<{ id: string; titre: string; description: string } | null> {
  try {
    const recherche = await apiRequest<LaravelRecherche>(
      `/api/recherches/${encodeURIComponent(id)}`,
      { signal },
    )
    return {
      id: String(recherche.id),
      titre: recherche.titre ?? '',
      description: recherche.description ?? '',
    }
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

export async function createRecherche(
  payload: MyRecherchePayload,
  signal?: AbortSignal,
): Promise<PublicationSummary> {
  const recherche = await apiRequest<LaravelRecherche>('/api/recherches', {
    method: 'POST',
    body: toFormData(payload),
    signal,
  })
  return mapRechercheToSummary(recherche)
}

export async function updateRecherche(
  id: string,
  payload: MyRechercheEditPayload,
  signal?: AbortSignal,
): Promise<PublicationSummary> {
  const recherche = await apiRequest<LaravelRecherche>(
    `/api/recherches/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body: { titre: payload.titre, description: payload.description },
      signal,
    },
  )
  return mapRechercheToSummary(recherche)
}

export async function deleteRecherche(id: string, signal?: AbortSignal): Promise<void> {
  await apiRequest<void>(`/api/recherches/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    signal,
  })
}
