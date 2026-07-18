import { useEffect, type RefObject } from 'react'
import { gsapMotion } from '../lib/gsapDefaults'
import { debounce, setupTextReveal } from '../lib/textReveal'

type Options = {
  active?: boolean
  /** Sans ScrollTrigger — lecture au montage (titres héro). */
  playOnMount?: boolean
  delay?: number
  stagger?: number
  /** Re-split quand le contenu change (i18n, titre). */
  contentKey?: string
}

export function useTextReveal(
  ref: RefObject<HTMLElement | null>,
  {
    active = true,
    playOnMount = false,
    delay = 0,
    stagger,
    contentKey,
  }: Options = {},
): void {
  useEffect(() => {
    if (!active) return
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const setupOptions = { playOnMount, delay, stagger }
    let cleanup = setupTextReveal(el, setupOptions)

    const rebuild = debounce(() => {
      cleanup()
      cleanup = setupTextReveal(el, setupOptions)
    }, gsapMotion.textReveal.resizeDebounceMs)

    const resizeObserver = new ResizeObserver(() => rebuild())
    resizeObserver.observe(el)

    return () => {
      resizeObserver.disconnect()
      cleanup()
    }
  }, [active, playOnMount, delay, stagger, contentKey, ref])
}
