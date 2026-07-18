/**
 * Façade authentification — session chercheur (rôles V1 : RESEARCHER, ADMIN).
 *
 * Mode 'rest' (cible Laravel Sanctum) :
 *   GET  /sanctum/csrf-cookie   → pose le cookie CSRF avant login
 *   POST /api/login             → ouvre la session (cookie httpOnly)
 *   POST /api/logout            → ferme la session
 *   GET  /api/me                → SessionUser ou 401
 *   POST /api/register          → création de compte (mécanisme de validation à trancher, doc 07 §9)
 *
 * Mode démo (mock/hal) : session simulée côté front, clairement signalée dans
 * l'UI (`isDemoAuth`). Garde-fou documenté : aucune donnée sensible n'existe
 * en mode démo, et le mode 'rest' repose exclusivement sur la session serveur —
 * ce mock ne contourne aucun contrôle réel.
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
    return await apiRequest<SessionUser>('/api/me', { signal })
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

  // Sanctum : cookie CSRF d'abord, puis login — la session vit en cookie httpOnly.
  await apiRequest<void>('/sanctum/csrf-cookie')
  return apiRequest<SessionUser>('/api/login', { method: 'POST', body: payload })
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
    // Mécanisme d'inscription réel non tranché (doc 07 §9) : la démo refuse
    // la création et oriente vers le compte de démonstration.
    throw new ApiError(
      `Inscription indisponible en démo — utilisez ${DEMO_EMAIL} sur la page de connexion.`,
      501,
    )
  }
  await apiRequest<void>('/sanctum/csrf-cookie')
  return apiRequest<SessionUser>('/api/register', { method: 'POST', body: payload })
}
