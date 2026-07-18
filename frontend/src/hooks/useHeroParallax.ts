import { useEffect, type RefObject } from 'react'

type ParallaxLayer = {
  ref: RefObject<HTMLElement | null>
  factor: number
  scale?: number
}

type Options = {
  mediaFactor?: number
  /** Zoom commun fond + calque PNG (marge pour le parallax). */
  mediaScale?: number
  /** Calques calés sur le même transform que le fond (alignement pixel-perfect). */
  syncWithMediaRefs?: RefObject<HTMLElement | null>[]
}

function setTransform(el: HTMLElement, y: number, scale = 1): void {
  const scalePart = scale !== 1 ? ` scale(${scale})` : ''
  el.style.transform = `translate3d(0, ${y}px, 0)${scalePart}`
}

/**
 * Parallax léger au scroll pour les héros plein écran (couches indépendantes).
 * Désactivé si l’utilisateur préfère moins de mouvement.
 */
export function useHeroParallax(
  heroRef: RefObject<HTMLElement | null>,
  mediaRef: RefObject<HTMLElement | null>,
  layers: ParallaxLayer[],
  { mediaFactor = 0.42, mediaScale = 1.04, syncWithMediaRefs = [] }: Options = {},
): void {
  useEffect(() => {
    const hero = heroRef.current
    const media = mediaRef.current
    if (!hero || !media) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    let rafId = 0

    const update = () => {
      rafId = 0
      const rect = hero.getBoundingClientRect()
      const base = -rect.top
      const y = base * mediaFactor

      setTransform(media, y, mediaScale)

      for (const syncRef of syncWithMediaRefs) {
        const el = syncRef.current
        if (el) setTransform(el, y, mediaScale)
      }

      for (const layer of layers) {
        const el = layer.ref.current
        if (el) setTransform(el, base * layer.factor, layer.scale)
      }
    }

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
      media.style.transform = ''
      for (const syncRef of syncWithMediaRefs) {
        const el = syncRef.current
        if (el) el.style.transform = ''
      }
      for (const layer of layers) {
        const el = layer.ref.current
        if (el) el.style.transform = ''
      }
    }
  }, [heroRef, mediaRef, layers, mediaFactor, mediaScale, syncWithMediaRefs])
}
