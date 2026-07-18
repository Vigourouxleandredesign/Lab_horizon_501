/**
 * Contexte d'authentification — état de session unique pour toute l'app.
 *
 * L'état est hydraté au montage via `fetchSessionUser` (cookie httpOnly côté
 * Laravel, sessionStorage en démo). Les pages consomment `useAuth()` et ne
 * parlent jamais directement à l'API d'auth.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as authApi from '../api/auth'
import type { LoginPayload, RegisterPayload, SessionUser } from '../api/types'

type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

type AuthContextValue = {
  status: AuthStatus
  user: SessionUser | null
  login: (payload: LoginPayload) => Promise<SessionUser>
  register: (payload: RegisterPayload) => Promise<SessionUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<SessionUser | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    authApi
      .fetchSessionUser(controller.signal)
      .then((sessionUser) => {
        setUser(sessionUser)
        setStatus(sessionUser ? 'authenticated' : 'anonymous')
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('anonymous')
      })

    return () => controller.abort()
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const sessionUser = await authApi.login(payload)
    setUser(sessionUser)
    setStatus('authenticated')
    return sessionUser
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const sessionUser = await authApi.register(payload)
    setUser(sessionUser)
    setStatus('authenticated')
    return sessionUser
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
    setStatus('anonymous')
  }, [])

  const value = useMemo(
    () => ({ status, user, login, register, logout }),
    [status, user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth doit être utilisé sous <AuthProvider>.')
  }
  return ctx
}
