/**
 * Années réellement présentes dans les publications — dérivées côté client
 * (pas d'endpoint dédié `/api/recherches/years` côté back). `pageSize: 50`
 * est le plafond accepté par l'API et couvre largement le volume actuel
 * (~17 recherches, cf. README) : un seul appel suffit à tout récupérer.
 */

import { useEffect, useState } from 'react'
import { searchPublications } from '../api/publications'

/** Repli affiché pendant le chargement (ou en cas d'échec réseau). */
const FALLBACK_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020]

export function useAvailableYears(): number[] {
  const [years, setYears] = useState<number[]>(FALLBACK_YEARS)

  useEffect(() => {
    const controller = new AbortController()

    searchPublications({ pageSize: 50 }, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        const distinct = new Set<number>()
        for (const item of result.items) {
          if (item.year) distinct.add(item.year)
        }
        if (distinct.size > 0) {
          setYears(Array.from(distinct).sort((a, b) => b - a))
        }
      })
      .catch(() => {
        // Échec réseau : on reste sur FALLBACK_YEARS, déjà affiché.
      })

    return () => controller.abort()
  }, [])

  return years
}
