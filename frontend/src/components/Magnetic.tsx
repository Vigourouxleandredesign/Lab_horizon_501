import gsap from 'gsap'
import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { gsapMotion } from '../lib/gsapDefaults'
import styles from './Magnetic.module.css'

type Props = {
  children: ReactNode
  /** Décalage magnétique (0–1 typique : 0.2–0.4). */
  strength?: number
  className?: string
  /** Désactive l’effet sans retirer le wrapper. */
  disabled?: boolean
}

export default function Magnetic({
  children,
  strength = 0.3,
  className,
  disabled = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const xTo = useRef<gsap.QuickToFunc | null>(null)
  const yTo = useRef<gsap.QuickToFunc | null>(null)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const coarsePointer = useMediaQuery('(pointer: coarse)')
  const inactive = disabled || reducedMotion || coarsePointer

  useEffect(() => {
    const el = ref.current
    if (!el || inactive) return

    gsap.set(el, { x: 0, y: 0, force3D: true })
    xTo.current = gsap.quickTo(el, 'x', {
      duration: gsapMotion.magnetic.followDuration,
      ease: gsapMotion.magnetic.followEase,
    })
    yTo.current = gsap.quickTo(el, 'y', {
      duration: gsapMotion.magnetic.followDuration,
      ease: gsapMotion.magnetic.followEase,
    })

    return () => {
      xTo.current = null
      yTo.current = null
      gsap.killTweensOf(el)
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [inactive])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (inactive) return
      const el = ref.current
      if (!el || !xTo.current || !yTo.current) return

      const rect = el.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)

      xTo.current(x * strength)
      yTo.current(y * strength)
    },
    [inactive, strength],
  )

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el || inactive) return

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: gsapMotion.magnetic.resetDuration,
      ease: gsapMotion.magnetic.resetEase,
      overwrite: 'auto',
    })
  }, [inactive])

  const rootClass = className ? `${styles.root} ${className}` : styles.root

  if (inactive) {
    return <div className={rootClass}>{children}</div>
  }

  return (
    <div
      ref={ref}
      className={rootClass}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
