/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Source de données du front : 'mock' (défaut), 'hal' ou 'rest'. */
  readonly VITE_DATA_SOURCE?: string
  /** URL de base de l'API Laravel (mode 'rest' uniquement). */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
