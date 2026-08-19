import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'

export type DomainSlide = { id: string; label: string; count?: number }

export type DomainFieldCarouselHandle = {
  step: (delta: number) => void
  goToIndex: (index: number) => void
  focus: () => void
}

type Props = {
  slides: readonly DomainSlide[]
  pillImageForId: (id: string) => string
  pubsCountLabel: string
  onCenterChange?: (index: number) => void
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

/** Plus de slots sur desktop = illusion de ruban infini ; mobile reste 3 pillules visibles. */
const SLOT_COUNT_DESKTOP = 11
const SLOT_COUNT_MOBILE = 3

const SPACING_DESKTOP = 210
const SPACING_MOBILE = 152

const HEIGHT_DESKTOP = 390
const HEIGHT_MOBILE = 280
const PILL_H_DESKTOP = 280
const PILL_H_MOBILE = 168

function buildSlotOffsets(slotCount: number): number[] {
  const half = Math.floor(slotCount / 2)
  return Array.from({ length: slotCount }, (_, i) => i - half)
}

/** Ressort vers une cible arbitraire (équilibre à `target`). */
function runSpringToTarget(
  from: number,
  target: number,
  setX: (v: number) => void,
  onComplete: () => void,
): () => void {
  let x = from
  let v = 0
  let cancelled = false
  let rafId = 0
  const stiffness = 280
  const damping = 34
  const mass = 1
  const dt = 1 / 60

  const tick = () => {
    if (cancelled) return
    const f = -stiffness * (x - target) - damping * v
    v += (f / mass) * dt
    x += v * dt
    setX(x)

    if (Math.abs(x - target) < 0.35 && Math.abs(v) < 3) {
      setX(target)
      onComplete()
      return
    }
    rafId = requestAnimationFrame(tick)
  }

  rafId = requestAnimationFrame(tick)

  return () => {
    cancelled = true
    cancelAnimationFrame(rafId)
  }
}

function runSpringToZero(
  from: number,
  setX: (v: number) => void,
  onComplete: () => void,
): () => void {
  return runSpringToTarget(from, 0, setX, onComplete)
}

function shortestLogicalDelta(fromLogical: number, toLogical: number, len: number): number {
  let d = toLogical - fromLogical
  if (d > len / 2) d -= len
  if (d < -len / 2) d += len
  return d
}

const DomainFieldCarousel = forwardRef<DomainFieldCarouselHandle, Props>(
  function DomainFieldCarousel(
    { slides, pillImageForId, pubsCountLabel, onCenterChange },
    ref,
  ) {
    const navigate = useNavigate()
    const isNarrow = useMediaQuery('(max-width: 639px)')
    const spacing = isNarrow ? SPACING_MOBILE : SPACING_DESKTOP
    const slotOffsets = useMemo(
      () =>
        buildSlotOffsets(isNarrow ? SLOT_COUNT_MOBILE : SLOT_COUNT_DESKTOP),
      [isNarrow],
    )
    const stageHeight = isNarrow ? HEIGHT_MOBILE : HEIGHT_DESKTOP
    const pillHeight = isNarrow ? PILL_H_MOBILE : PILL_H_DESKTOP

    const len = slides.length
    /** Index linéaire sans borne : le contenu réel est `slides[mod(virtualCenter, len)]`. */
    const [virtualCenter, setVirtualCenter] = useState(() => len * 1000)
    const logicalCenter = mod(virtualCenter, len)

    const [dragDisplay, setDragDisplay] = useState(0)
    const dragRef = useRef(0)
    const dragRafRef = useRef(0)
    const springCancelRef = useRef<(() => void) | null>(null)
    const gestureMovedRef = useRef(false)
    const rootRef = useRef<HTMLDivElement>(null)

    const setDrag = useCallback((v: number) => {
      dragRef.current = v
      setDragDisplay(v)
    }, [])

    useEffect(() => {
      onCenterChange?.(logicalCenter)
    }, [logicalCenter, onCenterChange])

    const cancelSpring = useCallback(() => {
      springCancelRef.current?.()
      springCancelRef.current = null
    }, [])

    const runSnapAnimation = useCallback(() => {
      cancelSpring()
      const current = dragRef.current
      if (Math.abs(current) < 0.5) {
        setDrag(0)
        return
      }
      springCancelRef.current = runSpringToZero(current, setDrag, () => {
        springCancelRef.current = null
      })
    }, [cancelSpring, setDrag])

    const getCat = useCallback(
      (vi: number): DomainSlide => slides[mod(vi, len)],
      [slides, len],
    )

    /** Anime le décalage jusqu’à ce que la pillule au slot `slotOffset` soit au centre, puis avance `virtualCenter`. */
    const animateSnapBySlotOffset = useCallback(
      (slotOffset: number) => {
        if (len <= 1 || slotOffset === 0) return
        cancelSpring()
        const from = dragRef.current
        const targetDrag = -slotOffset * spacing
        springCancelRef.current = runSpringToTarget(from, targetDrag, setDrag, () => {
          // Commit atomique : le contenu garde sa position écran (clés = index virtuel).
          setVirtualCenter((vc) => vc + slotOffset)
          setDrag(0)
          springCancelRef.current = null
        })
      },
      [cancelSpring, len, setDrag, spacing],
    )

    /** Plusieurs pas d’un coup (flèches / dots) : un seul tir de ressort. */
    const animateSnapByLogicalDelta = useCallback(
      (deltaLogical: number) => {
        if (len <= 1 || deltaLogical === 0) return
        cancelSpring()
        const from = dragRef.current
        const targetDrag = -deltaLogical * spacing
        springCancelRef.current = runSpringToTarget(from, targetDrag, setDrag, () => {
          setVirtualCenter((vc) => vc + deltaLogical)
          setDrag(0)
          springCancelRef.current = null
        })
      },
      [cancelSpring, len, setDrag, spacing],
    )

    const applyStep = useCallback(
      (delta: number) => {
        if (len <= 1) return
        animateSnapByLogicalDelta(delta)
      },
      [animateSnapByLogicalDelta, len],
    )

    const goToIndex = useCallback(
      (targetIndex: number) => {
        if (len <= 1) return
        cancelSpring()
        const safe = Math.max(0, Math.min(len - 1, targetIndex))
        const d = shortestLogicalDelta(logicalCenter, safe, len)
        animateSnapByLogicalDelta(d)
      },
      [
        animateSnapByLogicalDelta,
        cancelSpring,
        len,
        logicalCenter,
      ],
    )

    useImperativeHandle(
      ref,
      () => ({
        step: (delta: number) => applyStep(delta),
        goToIndex,
        focus: () => rootRef.current?.focus(),
      }),
      [applyStep, goToIndex],
    )

    const handleCenterDomainClick = useCallback(
      (cat: DomainSlide) => {
        navigate(`/categories/${encodeURIComponent(cat.id)}`)
      },
      [navigate],
    )

    const flushDragRaf = useCallback(() => {
      dragRafRef.current = 0
      setDrag(dragRef.current)
    }, [setDrag])

    const onPointerDown = (e: React.PointerEvent) => {
      cancelSpring()
      gestureMovedRef.current = false
      const originX = e.clientX
      const startVal = dragRef.current

      const onWinMove = (ev: PointerEvent) => {
        const dx = ev.clientX - originX
        if (Math.abs(dx) > 8) gestureMovedRef.current = true
        dragRef.current = startVal + dx
        if (!dragRafRef.current) {
          dragRafRef.current = requestAnimationFrame(flushDragRaf)
        }
      }

      const onWinUp = () => {
        if (dragRafRef.current) {
          cancelAnimationFrame(dragRafRef.current)
          dragRafRef.current = 0
        }
        setDrag(dragRef.current)

        const d = dragRef.current
        const steps = -Math.round(d / spacing)

        // Ne pas avancer virtualCenter tout de suite : on termine le snap en anim,
        // puis on commit (évite le « retour » visuel à l’origine).
        if (steps !== 0 && len > 1) {
          animateSnapByLogicalDelta(steps)
        } else {
          runSnapAnimation()
        }

        window.removeEventListener('pointermove', onWinMove)
        window.removeEventListener('pointerup', onWinUp)
        window.removeEventListener('pointercancel', onWinUp)
      }

      window.addEventListener('pointermove', onWinMove)
      window.addEventListener('pointerup', onWinUp)
      window.addEventListener('pointercancel', onWinUp)
    }

    useEffect(() => () => cancelSpring(), [cancelSpring])

    return (
      <div
        ref={rootRef}
        tabIndex={0}
        role="region"
        aria-label={slides[logicalCenter]?.label ?? 'Domaines'}
        style={{
          position: 'relative',
          width: '100%',
          height: stageHeight,
          overflow: 'hidden',
          userSelect: 'none',
          touchAction: 'none',
          cursor: 'grab',
          outline: 'none',
        }}
        onPointerDown={onPointerDown}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            applyStep(-1)
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            applyStep(1)
          }
        }}
      >
        {slotOffsets.map((slotOffset) => {
          const vi = virtualCenter + slotOffset
          const cat = getCat(vi)
          const vx = slotOffset * spacing + dragDisplay
          const absD = Math.min(Math.abs(vx) / spacing, 3.5)
          const scale = Math.max(0.36, 1 - absD * 0.26)
          const opacity = Math.max(0, 1 - absD * 0.42)
          const zIdx = Math.round(30 - absD * 8)
          const isCenter = absD < 0.35

          return (
            <div
              key={vi}
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                transform: `translateX(calc(-50% + ${vx}px)) scale(${scale})`,
                transformOrigin: 'center top',
                opacity,
                zIndex: zIdx,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
                willChange: 'transform, opacity',
                pointerEvents: opacity < 0.04 ? 'none' : 'auto',
              }}
            >
              <img
                src={pillImageForId(cat.id)}
                alt=""
                draggable={false}
                onClick={(ev) => {
                  if (gestureMovedRef.current) {
                    ev.preventDefault()
                    return
                  }
                  if (isCenter) {
                    handleCenterDomainClick(cat)
                  } else {
                    animateSnapBySlotOffset(slotOffset)
                  }
                }}
                style={{
                  height: pillHeight,
                  width: 'auto',
                  maxWidth: isNarrow ? 'min(92vw, 260px)' : 'none',
                  objectFit: 'contain',
                  filter: isCenter
                    ? 'var(--lh-carousel-pill-drop-center)'
                    : 'var(--lh-carousel-pill-drop-side)',
                  userSelect: 'none',
                  cursor: 'pointer',
                  touchAction: 'none',
                }}
              />
              <div
                style={{
                  opacity: Math.max(0, 1 - absD * 5),
                  textAlign: 'center',
                  transition: 'opacity 0.15s',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: isNarrow ? '0.9rem' : '1rem',
                    color: 'var(--lh-heading)',
                  }}
                >
                  {cat.label}
                </div>
                {cat.count != null && (
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--lh-link)',
                      marginTop: 2,
                    }}
                  >
                    {cat.count} {pubsCountLabel}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  },
)

export default DomainFieldCarousel
