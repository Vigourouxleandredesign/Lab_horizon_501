/**
 * Façade « Votre compte » (RGPD) — UI-only tant que le back n'expose pas de
 * routes dédiées (`PATCH /api/me`, changement mot de passe, `DELETE /api/me`).
 *
 * Distinct de `api/account.ts` (dashboard / mes publications / review, D5-D6) :
 * ce module ne couvre que les actions RGPD de la page « Votre compte »
 * (identité, email, mot de passe, ORCID, suppression).
 *
 * Même convention que `RESEARCHERS_API_READY` (cf. `api/researchers.ts`) :
 * un seul flag à basculer quand le back livre ces routes, sans changer les
 * pages (elles ne connaissent que ces fonctions). Les appels `apiRequest`
 * ci-dessous sont la cible attendue mais restent inatteignables tant que le
 * flag est à `false` — aucune requête réseau n'est faite pour l'instant.
 */

import { apiRequest } from './http'

/** Passe à true quand le back expose les routes RGPD dédiées. */
export const ACCOUNT_RGPD_API_READY = false

export type AccountActionResult = { ok: boolean }

export type UpdateIdentityPayload = {
  firstName: string
  lastName: string
}

export type UpdateEmailPayload = {
  email: string
  currentPassword: string
}

export type UpdatePasswordPayload = {
  currentPassword: string
  newPassword: string
}

export type UpdateOrcidPayload = {
  orcid: string
}

export async function updateAccountIdentity(
  payload: UpdateIdentityPayload,
): Promise<AccountActionResult> {
  if (ACCOUNT_RGPD_API_READY) {
    await apiRequest<void>('/api/me', {
      method: 'PATCH',
      body: { name: `${payload.firstName} ${payload.lastName}`.trim() },
    })
    return { ok: true }
  }
  return { ok: false }
}

export async function updateAccountEmail(
  payload: UpdateEmailPayload,
): Promise<AccountActionResult> {
  if (ACCOUNT_RGPD_API_READY) {
    await apiRequest<void>('/api/me', {
      method: 'PATCH',
      body: { email: payload.email, current_password: payload.currentPassword },
    })
    return { ok: true }
  }
  return { ok: false }
}

export async function updateAccountPassword(
  payload: UpdatePasswordPayload,
): Promise<AccountActionResult> {
  if (ACCOUNT_RGPD_API_READY) {
    await apiRequest<void>('/api/me/password', {
      method: 'PUT',
      body: { current_password: payload.currentPassword, new_password: payload.newPassword },
    })
    return { ok: true }
  }
  return { ok: false }
}

export async function updateAccountOrcid(
  payload: UpdateOrcidPayload,
): Promise<AccountActionResult> {
  if (ACCOUNT_RGPD_API_READY) {
    await apiRequest<void>('/api/me', { method: 'PATCH', body: { orcid: payload.orcid } })
    return { ok: true }
  }
  return { ok: false }
}

/** Suppression RGPD du compte — la déconnexion reste à la charge de l'appelant. */
export async function deleteAccount(): Promise<AccountActionResult> {
  if (ACCOUNT_RGPD_API_READY) {
    await apiRequest<void>('/api/me', { method: 'DELETE' })
    return { ok: true }
  }
  return { ok: false }
}
