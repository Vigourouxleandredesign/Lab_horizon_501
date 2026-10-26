/**
 * Contexte d'authentification (objet + types) et hook de lecture `useAuth()`.
 * Le Provider vit dans AuthContext.tsx : un fichier composant n'exporte que des composants.
 */

import { createContext, useContext } from 'react'
import type { LoginPayload, RegisterPayload, SessionUser } from '../api/types'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export type AuthContextValue = {
  status: AuthStatus
  user: SessionUser | null
  login: (payload: LoginPayload) => Promise<SessionUser>
  register: (payload: RegisterPayload) => Promise<SessionUser>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth doit être utilisé sous <AuthProvider>.')
  }
  return ctx
}
