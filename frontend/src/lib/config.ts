/**
 * Configuration d'environnement — source unique de vérité.
 *
 * Le front est conçu pour être branché sur le back Laravel (API REST) sans
 * réécriture : seul `VITE_DATA_SOURCE` change (cf. docs/ux/08, arbitrage D9).
 *
 * | Valeur | Comportement |
 * |--------|--------------|
 * | mock   | Données de démonstration locales (défaut, aucun réseau) |
 * | hal    | Recherche publique branchée sur l'API HAL (archives-ouvertes.fr) |
 * | rest   | API Laravel + SQLite (auth réelle via cookies de session) |
 */

export type DataSource = 'mock' | 'hal' | 'rest'

function readDataSource(): DataSource {
  const raw = import.meta.env.VITE_DATA_SOURCE
  if (raw === 'hal' || raw === 'rest') return raw
  return 'mock'
}

export const appConfig = {
  dataSource: readDataSource(),
  /** Base API Laravel — requis en mode 'rest', ignoré sinon. */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  /** API publique HAL (recherche ouverte, lecture seule). */
  halApiUrl: 'https://api.archives-ouvertes.fr/search/',
} as const

/** L'authentification réelle exige le back ; sinon mode démo assumé et visible. */
export const isDemoAuth = appConfig.dataSource !== 'rest'
