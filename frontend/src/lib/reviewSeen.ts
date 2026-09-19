/**
 * Suivi local « vulgarisation déjà ouverte » — UI V2 (icône en couleur
 * tant que le chercheur n'a pas ouvert la review). Remplacé plus tard par
 * un flag serveur (`review_seen_at` / statut workflow).
 */

const STORAGE_PREFIX = 'lab-horizon-review-seen:'

export function hasSeenPublicationReview(publicationId: string): boolean {
  try {
    return sessionStorage.getItem(`${STORAGE_PREFIX}${publicationId}`) === '1'
  } catch {
    return false
  }
}

export function markPublicationReviewSeen(publicationId: string): void {
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${publicationId}`, '1')
  } catch {
    // sessionStorage indisponible (mode privé strict) — l'icône restera accentuée.
  }
}

/** Icône review colorée = en attente côté données ET pas encore ouverte ici. */
export function isReviewPendingUnread(
  publicationId: string,
  reviewPending: boolean | undefined,
): boolean {
  return Boolean(reviewPending) && !hasSeenPublicationReview(publicationId)
}
