import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Remonte systématiquement en haut de page à chaque navigation
 * (pathname ou query), pour éviter de garder le scroll de la page précédente.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])

  return null
}
