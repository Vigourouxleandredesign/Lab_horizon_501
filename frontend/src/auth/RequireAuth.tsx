/**
 * Garde de route — réserve un sous-arbre aux chercheurs connectés (D3).
 *
 * Rappel sécurité : ce composant est un confort d'UX. La vraie barrière est
 * côté API (401/403 sans session) — le front ne fait que rediriger proprement.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  // Hydratation de session en cours : ne pas flasher une redirection.
  if (status === 'loading') return null

  if (status === 'anonymous') {
    return <Navigate to="/connexion" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
