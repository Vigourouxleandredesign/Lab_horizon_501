import { useEffect, useRef, type RefObject } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { getHeroGlassConfig, heroGlassConfig, MAX_SPLASHES } from './config'
import styles from './HeroGlassBackground.module.css'
import { useHeroGlassCursor } from './useHeroGlassCursor'
import {
  createFullscreenQuad,
  createGlassProgram,
  getGlassUniforms,
  loadTexture,
} from './webgl'

type Props = {
  imageSrc: string
  heroRef: RefObject<HTMLElement | null>
}

/**
 * Fond héro avec effet splash cursor WebGL.
 * Point d'entrée unique pour tous les héros du site (accueil + domaines).
 */
export function HeroGlassBackground({ imageSrc, heroRef }: Props) {
  const mediaRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canHover = useMediaQuery('(hover: hover)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const useGlass = canHover && !reducedMotion
  const cursorState = useHeroGlassCursor(heroRef, mediaRef, { active: useGlass })

  useEffect(() => {
    if (!useGlass) return

    const canvas = canvasRef.current
    const hero = heroRef.current
    if (!canvas || !hero) return

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    })

    if (!gl) return

    const program = createGlassProgram(gl)
    if (!program) return

    gl.useProgram(program)
    createFullscreenQuad(gl, program)
    const uniforms = getGlassUniforms(gl, program)
    const glass = getHeroGlassConfig()

    let texture: WebGLTexture | null = null
    let texW = 1
    let texH = 1
    let raf = 0
    let disposed = false

    const splashA = new Float32Array(MAX_SPLASHES * 4)
    const splashB = new Float32Array(MAX_SPLASHES * 4)

    const image = new Image()
    image.decoding = 'async'
    image.src = imageSrc

    const resize = () => {
      const rect = hero.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.floor(rect.width * dpr))
      const h = Math.max(1, Math.floor(rect.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    const packSplashes = () => {
      const { splashes } = cursorState.current
      splashA.fill(0)
      splashB.fill(0)
      const count = Math.min(splashes.length, MAX_SPLASHES)
      for (let i = 0; i < count; i++) {
        const s = splashes[i]
        const o = i * 4
        splashA[o] = s.x
        splashA[o + 1] = s.y
        splashA[o + 2] = s.dirX
        splashA[o + 3] = s.dirY
        splashB[o] = Math.min(1, s.age / s.life)
        splashB[o + 1] = s.speed
        splashB[o + 2] = s.size
        splashB[o + 3] = 1
      }
    }

    const renderFrame = () => {
      if (disposed || !texture) return

      resize()
      const state = cursorState.current
      packSplashes()

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.uniform1i(uniforms.texture, 0)
      gl.uniform2f(uniforms.texSize, texW, texH)
      gl.uniform2f(uniforms.screenSize, canvas.width, canvas.height)
      gl.uniform1f(uniforms.strength, glass.strength)
      gl.uniform1f(uniforms.hover, state.hover)
      gl.uniform1f(uniforms.highlight, glass.highlight)
      gl.uniform1f(uniforms.splashTail, glass.splashTail)
      gl.uniform1f(uniforms.splashDirectionBias, glass.splashDirectionBias)
      gl.uniform1f(uniforms.speedPower, glass.splashSpeedPower)
      gl.uniform1f(uniforms.deformStrengthMin, glass.deformStrengthMin)
      gl.uniform1f(uniforms.deformStrengthMax, glass.deformStrengthMax)
      gl.uniform1f(uniforms.stretchMin, glass.stretchMin)
      gl.uniform1f(uniforms.stretchMax, glass.stretchMax)
      gl.uniform2f(uniforms.objectPosition, glass.objectPositionX, glass.objectPositionY)
      if (uniforms.splashA) gl.uniform4fv(uniforms.splashA, splashA)
      if (uniforms.splashB) gl.uniform4fv(uniforms.splashB, splashB)

      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    const draw = () => {
      raf = 0
      if (disposed || !texture) return

      renderFrame()

      const state = cursorState.current
      const animating = state.hover > 0.002 || state.splashes.length > 0
      if (animating) {
        raf = requestAnimationFrame(draw)
      }
    }

    const ensureLoop = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }

    const onImageLoad = () => {
      if (disposed) return
      const loaded = loadTexture(gl, image)
      if (!loaded) return
      texture = loaded.texture
      texW = loaded.width
      texH = loaded.height
      renderFrame()
    }

    if (image.complete) onImageLoad()
    else image.addEventListener('load', onImageLoad)

    const onHeroEnter = () => ensureLoop()
    const onHeroLeave = () => ensureLoop()
    const onHeroMove = () => ensureLoop()
    hero.addEventListener('mouseenter', onHeroEnter)
    hero.addEventListener('mouseleave', onHeroLeave)
    hero.addEventListener('mousemove', onHeroMove, { passive: true })

    const ro = new ResizeObserver(() => {
      if (!texture) return
      renderFrame()
    })
    ro.observe(hero)

    return () => {
      disposed = true
      if (raf) cancelAnimationFrame(raf)
      hero.removeEventListener('mouseenter', onHeroEnter)
      hero.removeEventListener('mouseleave', onHeroLeave)
      hero.removeEventListener('mousemove', onHeroMove)
      ro.disconnect()
      image.removeEventListener('load', onImageLoad)
      if (texture) gl.deleteTexture(texture)
      gl.deleteProgram(program)
    }
  }, [cursorState, heroRef, imageSrc, useGlass])

  const objectPosition = `${heroGlassConfig.objectPositionX * 100}% ${heroGlassConfig.objectPositionY * 100}%`

  return (
    <div ref={mediaRef} className={styles.media} data-lh-hero-glass>
      {useGlass ? (
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
      ) : (
        <img
          src={imageSrc}
          alt=""
          className={styles.image}
          style={{ objectPosition }}
          loading="eager"
          decoding="async"
        />
      )}
    </div>
  )
}
