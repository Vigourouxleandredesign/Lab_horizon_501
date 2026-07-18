/**
 * Préfixe Vite pour tout fichier servi depuis `public/`.
 * Évite les 404 si l’app est déployée sous un sous-chemin (`base` ≠ `/`).
 */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  return `${normalizedBase}${normalizedPath}`
}
