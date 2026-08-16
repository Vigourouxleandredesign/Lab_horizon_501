/**
 * Client HTTP centralisé — unique point de sortie réseau du front.
 *
 * Sécurité (charte projet) :
 * - Session via cookies httpOnly (`credentials: 'include'`) : aucun token
 *   stocké en localStorage, pattern attendu par Laravel Sanctum / Breeze SPA.
 * - Header `X-XSRF-TOKEN` sur les mutations (cookie `XSRF-TOKEN` posé par
 *   `GET /sanctum/csrf-cookie`).
 * - Timeout systématique (disponibilité : pas d'I/O externe sans borne).
 * - Erreurs typées, jamais absorbées silencieusement.
 */

import { appConfig } from '../lib/config'

const DEFAULT_TIMEOUT_MS = 10_000

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  /** Query string — les valeurs undefined sont omises. */
  params?: Record<string, string | number | undefined>
  signal?: AbortSignal
  timeoutMs?: number
}

function buildUrl(base: string, path: string, params?: RequestOptions['params']): string {
  const url = new URL(path, base)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

/** Combine l'abort appelant (unmount React) et le timeout réseau. */
function combineSignals(timeoutMs: number, external?: AbortSignal): AbortSignal {
  const signals = [AbortSignal.timeout(timeoutMs)]
  if (external) signals.push(external)
  return AbortSignal.any(signals)
}

function readXsrfToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)
  if (!match?.[1]) return null
  try {
    return decodeURIComponent(match[1])
  } catch {
    return match[1]
  }
}

function isMutatingMethod(method: string): boolean {
  return method !== 'GET' && method !== 'HEAD'
}

async function parseJsonBody<T>(response: Response): Promise<T> {
  const text = await response.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

async function request<T>(baseUrl: string, path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = options
  const towardLaravel = baseUrl === appConfig.apiBaseUrl

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
  }

  if (towardLaravel && isMutatingMethod(method)) {
    const xsrf = readXsrfToken()
    if (xsrf) headers['X-XSRF-TOKEN'] = xsrf
  }

  const response = await fetch(buildUrl(baseUrl, path, params), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    // Cookies de session — le back doit répondre avec CORS credentials.
    credentials: towardLaravel ? 'include' : 'omit',
    signal: combineSignals(timeoutMs, signal),
  })

  if (!response.ok) {
    throw new ApiError(`Requête échouée (${response.status}) — ${path}`, response.status)
  }

  return parseJsonBody<T>(response)
}

/** Requête vers l'API Laravel (mode 'rest'). */
export function apiRequest<T>(path: string, options?: RequestOptions): Promise<T> {
  if (!appConfig.apiBaseUrl) {
    return Promise.reject(
      new ApiError('VITE_API_BASE_URL non configurée — mode rest indisponible.', 0),
    )
  }
  return request<T>(appConfig.apiBaseUrl, path, options)
}

/** Requête vers l'API publique HAL (lecture seule, sans credentials). */
export function halRequest<T>(
  params: Record<string, string | number | undefined>,
  signal?: AbortSignal,
): Promise<T> {
  return request<T>(appConfig.halApiUrl, '', { params, signal })
}
