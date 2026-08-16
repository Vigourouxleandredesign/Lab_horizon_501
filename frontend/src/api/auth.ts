/**
 * Façade authentification — session chercheur (rôles V1 : RESEARCHER, ADMIN).
 *
 * Mode 'rest' (Laravel session cookie) :
 *   GET  /sanctum/csrf-cookie   → pose le cookie CSRF avant login
 *   POST /api/login             → ouvre la session (cookie httpOnly)
 *   POST /api/logout            → ferme la session
 *   GET  /api/me                → SessionUser ou 401
 *   POST /api/register          → pas encore exposé en JSON côté back (501)
 *
 * Mode démo (mock/hal) : session simulée côté front, clairement signalée dans
 * l'UI (`isDemoAuth`).
 */

import { isDemoAuth } from '../lib/config'
import { apiRequest, ApiError } from './http'
import type { LoginPayload, RegisterPayload, SessionUser } from './types'

/** Compte de démonstration — accepté avec n'importe quel mot de passe non vide. */
export const DEMO_EMAIL = 'chercheur@demo.unc.nc'

const DEMO_USER: SessionUser = {
  id: 'demo-user',
  displayName: 'Dr. Marie Dupont',
  email: DEMO_EMAIL,
  role: 'RESEARCHER',
  researcherId: '1',
}

/** sessionStorage (pas localStorage) : la session démo meurt avec l'onglet. */
const DEMO_SESSION_KEY = 'lab-horizon-demo-session'

/** Shape brute renvoyée par Laravel AuthApiController. */
type LaravelUser = {
  id: number | string
  name: string
  email: string
  orcid?: string | null
  orcid_verified?: boolean
}

type LaravelLoginResponse = {
  user: LaravelUser
}

function mapLaravelUser(user: LaravelUser): SessionUser {
  const id = String(user.id)
  return {
    id,
    displayName: user.name,
    email: user.email,
    // Absents du modèle User back — défauts assumés jusqu'à livraison rôle / profil.
    role: 'RESEARCHER',
    researcherId: id,
  }
}

function readDemoSession(): SessionUser | null {
  try {
    const raw = sessionStorage.getItem(DEMO_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SessionUser
    return parsed.id === DEMO_USER.id ? parsed : null
  } catch {
    return null
  }
}

export async function fetchSessionUser(signal?: AbortSignal): Promise<SessionUser | null> {
  if (isDemoAuth) return readDemoSession()

  try {
    const user = await apiRequest<LaravelUser>('/api/me', { signal })
    return mapLaravelUser(user)
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 419)) {
      return null
    }
    throw error
  }
}

export async function login(payload: LoginPayload): Promise<SessionUser> {
  if (isDemoAuth) {
    if (payload.email.trim().toLowerCase() !== DEMO_EMAIL || !payload.password) {
      throw new ApiError('Identifiants invalides.', 401)
    }
    sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(DEMO_USER))
    return DEMO_USER
  }

  await apiRequest<void>('/sanctum/csrf-cookie')
  const response = await apiRequest<LaravelLoginResponse>('/api/login', {
    method: 'POST',
    body: payload,
  })
  return mapLaravelUser(response.user)
}

export async function logout(): Promise<void> {
  if (isDemoAuth) {
    sessionStorage.removeItem(DEMO_SESSION_KEY)
    return
  }
  await apiRequest<void>('/api/logout', { method: 'POST' })
}

export async function register(payload: RegisterPayload): Promise<SessionUser> {
  if (isDemoAuth) {
    throw new ApiError(
      `Inscription indisponible en démo — utilisez ${DEMO_EMAIL} sur la page de connexion.`,
      501,
    )
  }
  // Back : register JSON absent (Blade /register seulement).
  void payload
  throw new ApiError(
    'Inscription API indisponible — le back n’expose pas encore POST /api/register.',
    501,
  )
}
