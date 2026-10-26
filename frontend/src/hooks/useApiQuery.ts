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

type Settled<T> = Exclude<ApiQueryState<T>, { status: 'loading' }>

const LOADING = { status: 'loading', data: null, error: null } as const

function sameDeps(a: readonly unknown[], b: readonly unknown[]): boolean {
  return a.length === b.length && a.every((value, i) => Object.is(value, b[i]))
}

/**
 * @param fetcher fonction de la façade API — DOIT être stable ou dépendre de `deps`.
 * @param deps    valeurs qui relancent la requête (query, filtres, id de route…).
 */
export function useApiQuery<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[],
): ApiQueryState<T> {
  // Résultat + deps qui l'ont produit : « loading » se déduit au rendu quand les deps changent,
  // sans setState synchrone dans l'effet (et sans afficher les données de la requête précédente).
  const [result, setResult] = useState<{ deps: readonly unknown[]; state: Settled<T> } | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetcher(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setResult({ deps, state: { status: 'success', data, error: null } })
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setResult({
            deps,
            state: {
              status: 'error',
              data: null,
              error: error instanceof Error ? error : new Error(String(error)),
            },
          })
        }
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps portées par l'appelant
  }, deps)

  return result && sameDeps(result.deps, deps) ? result.state : LOADING
}
