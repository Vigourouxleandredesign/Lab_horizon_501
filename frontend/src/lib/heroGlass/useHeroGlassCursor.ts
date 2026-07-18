import { useEffect, useRef, type RefObject } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { getHeroGlassConfig, MAX_SPLASHES } from './config'

export type Splash = {
  x: number
  y: number
  dirX: number
  dirY: number
  speed: number
  age: number
  life: number
  size: number
}

export type HeroGlassCursorState = {
  splashes: Splash[]
  hover: number
}

function spacingOk(
  x: number,
  y: number,
  last: { x: number; y: number } | null,
  minPx: number,
): boolean {
  return !last || Math.hypot(x - last.x, y - last.y) >= minPx
}

export function useHeroGlassCursor(
  heroRef: RefObject<HTMLElement | null>,
  surfaceRef: RefObject<HTMLElement | null>,
  options: { active?: boolean } = {},
): RefObject<HeroGlassCursorState> {
  const { active = true } = options
  const canHover = useMediaQuery('(hover: hover)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const enabled = active && canHover && !reducedMotion

  const stateRef = useRef<HeroGlassCursorState>({
    splashes: [],
    hover: 0,
  })

  useEffect(() => {
    const hero = heroRef.current
    if (!hero || !enabled) return

    const glass = getHeroGlassConfig()
    const state = stateRef.current
    state.splashes = []

    let hovering = false
    let last: { x: number; y: number; t: number } | null = null
    let tickRaf = 0
    let lastTick = performance.now()
    let hoverTarget = 0
    let lastFullEmitAt = 0
    let lastMicroEmitAt = 0
    let lastFullEmitPos: { x: number; y: number } | null = null
    let lastMicroEmitPos: { x: number; y: number } | null = null

    const emit = (
      clientX: number,
      clientY: number,
      dirX: number,
      dirY: number,
      speed: number,
      size: number,
      life: number,
    ) => {
      const surface = surfaceRef.current
      if (!surface) return
      const rect = surface.getBoundingClientRect()
      if (rect.width < 1 || rect.height < 1) return

      if (state.splashes.length >= MAX_SPLASHES) state.splashes.shift()
      const jitter = () => (Math.random() - 0.5) * glass.splashJitter
      state.splashes.push({
        x: (clientX - rect.left) / rect.width + jitter(),
        y: (clientY - rect.top) / rect.height + jitter(),
        dirX,
        dirY,
        speed,
        age: 0,
        life,
        size,
      })
    }

    const tick = (now: number) => {
      const dt = Math.min((now - lastTick) / 1000, 0.05)
      lastTick = now

      state.hover += (hoverTarget - state.hover) * Math.min(1, dt * glass.hoverLerp)

      for (const s of state.splashes) s.age += dt * glass.splashAgeScale
      state.splashes = state.splashes.filter((s) => s.age < s.life)

      tickRaf = requestAnimationFrame(tick)
    }
    tickRaf = requestAnimationFrame(tick)

    const onEnter = (e: MouseEvent) => {
      hovering = true
      hoverTarget = 1
      last = { x: e.clientX, y: e.clientY, t: performance.now() }
    }

    const onLeave = () => {
      hovering = false
      hoverTarget = 0
      last = null
      lastFullEmitAt = 0
      lastMicroEmitAt = 0
      lastFullEmitPos = null
      lastMicroEmitPos = null
    }

    const onMove = (e: MouseEvent) => {
      if (!hovering) return

      const now = performance.now()

      if (last) {
        const dxPx = e.clientX - last.x
        const dyPx = e.clientY - last.y
        const dt = Math.max(0.001, (now - last.t) / 1000)
        const distPx = Math.hypot(dxPx, dyPx)
        const velPxs = distPx / dt

        if (distPx > 0.4) {
          const dirX = dxPx / distPx
          const dirY = dyPx / distPx
          const isFull = velPxs >= glass.splashThreshold
          const isMicro = !isFull && velPxs >= glass.splashMicroThreshold

          if (isFull) {
            const canEmit =
              now - lastFullEmitAt >= glass.splashEmitCooldownMs &&
              spacingOk(e.clientX, e.clientY, lastFullEmitPos, glass.splashMinSpacingPx)

            if (canEmit) {
              const speed = Math.min(
                1,
                Math.max(
                  0,
                  (velPxs - glass.splashThreshold) /
                    (glass.splashThreshold * (glass.splashSpeedRange - 1)),
                ),
              )
              const count = Math.min(
                glass.splashMaxPerMove,
                Math.max(1, Math.floor(velPxs / (glass.splashThreshold * 1.6))),
              )
              const lagScale = 1 - speed * glass.lagSpeedReduce
              const life = glass.splashLife * (0.75 + Math.random() * 0.5)
              const size = glass.splashSize * (0.75 + speed * glass.sizeSpeedGain)

              for (let i = 0; i < count; i++) {
                const lag = (glass.splashLagPx + i * glass.splashLagSpread) * lagScale
                emit(
                  e.clientX - dirX * lag,
                  e.clientY - dirY * lag,
                  dirX,
                  dirY,
                  speed,
                  size,
                  life,
                )
              }

              lastFullEmitAt = now
              lastFullEmitPos = { x: e.clientX, y: e.clientY }
            }
          } else if (isMicro) {
            const canEmit =
              now - lastMicroEmitAt >= glass.splashMicroEmitCooldownMs &&
              spacingOk(e.clientX, e.clientY, lastMicroEmitPos, glass.splashMicroMinSpacingPx)

            if (canEmit) {
              const range = glass.splashThreshold - glass.splashMicroThreshold
              const t = Math.min(1, Math.max(0, (velPxs - glass.splashMicroThreshold) / range))
              const speed =
                glass.splashMicroSpeedMin +
                t * (glass.splashMicroSpeedMax - glass.splashMicroSpeedMin)
              const lag = glass.splashMicroLagPx * (1 - t * 0.2)
              const life =
                glass.splashLife * glass.splashMicroLifeScale * (0.8 + Math.random() * 0.35)
              const size = glass.splashMicroSize * (0.88 + t * 0.18)

              emit(
                e.clientX - dirX * lag,
                e.clientY - dirY * lag,
                dirX,
                dirY,
                speed,
                size,
                life,
              )

              lastMicroEmitAt = now
              lastMicroEmitPos = { x: e.clientX, y: e.clientY }
            }
          }
        }
      }

      last = { x: e.clientX, y: e.clientY, t: now }
    }

    hero.addEventListener('mouseenter', onEnter)
    hero.addEventListener('mouseleave', onLeave)
    hero.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      hovering = false
      if (tickRaf) cancelAnimationFrame(tickRaf)
      hero.removeEventListener('mouseenter', onEnter)
      hero.removeEventListener('mouseleave', onLeave)
      hero.removeEventListener('mousemove', onMove)
      state.splashes = []
    }
  }, [enabled, heroRef, surfaceRef, active])

  return stateRef
}
