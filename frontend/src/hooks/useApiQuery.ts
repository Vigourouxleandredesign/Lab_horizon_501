/**
 * Hook générique de lecture API — motif unique pour toutes les pages connectées.
 *
 * Centralise : états loading/erreur/données, annulation à l'unmount (AbortController)
 * et protection contre les réponses obsolètes (races). Quand l'API Laravel
 * arrivera, aucune page ne change : seule la façade `src/api/` est branchée.
 */

import { useEffect, useState } from 'react'

export type ApiQueryState<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error }

/**
 * @param fetcher fonction de la façade API — DOIT être stable ou dépendre de `deps`.
 * @param deps    valeurs qui relancent la requête (query, filtres, id de route…).
 */
export function useApiQuery<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[],
): ApiQueryState<T> {
  const [state, setState] = useState<ApiQueryState<T>>({
    status: 'loading',
    data: null,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading', data: null, error: null })

    fetcher(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ status: 'success', data, error: null })
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            status: 'error',
            data: null,
            error: error instanceof Error ? error : new Error(String(error)),
          })
        }
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps portées par l'appelant
  }, deps)

  return state
}
