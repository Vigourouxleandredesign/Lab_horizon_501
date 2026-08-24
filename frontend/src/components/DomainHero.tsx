import { useMemo, useRef } from 'react'
import { useHeroParallax } from '../hooks/useHeroParallax'
import { useTextReveal } from '../hooks/useTextReveal'
import { HeroGlassBackground } from '../lib/heroGlass'
import { gsapMotion } from '../lib/gsapDefaults'
import styles from '../style/pages/DomainPage.module.css'

type Props = {
  title: string
  imageSrc: string
  layerSrc: string
  scrollCta: string
  onScrollToContent: () => void
}

export default function DomainHero({
  title,
  imageSrc,
  layerSrc,
  scrollCta,
  onScrollToContent,
}: Props) {
  const heroRef = useRef<HTMLElement>(null)
  const distortStackRef = useRef<HTMLDivElement>(null)
  const primaryTitleRef = useRef<HTMLHeadingElement>(null)
  const ghostTitleRef = useRef<HTMLParagraphElement>(null)
  const leftTextRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const rightTextRef = useRef<HTMLDivElement>(null)

  const parallaxLayers = useMemo(
    () => [
      { ref: leftTextRef, factor: 0.1 },
      { ref: rightTextRef, factor: 0.16 },
    ],
    [],
  )

  useHeroParallax(heroRef, distortStackRef, parallaxLayers, {
    syncWithMediaRefs: [],
  })

  useTextReveal(primaryTitleRef, {
    playOnMount: true,
    delay: gsapMotion.textReveal.heroDelay,
    contentKey: title,
  })
  useTextReveal(ghostTitleRef, {
    playOnMount: true,
    delay: gsapMotion.textReveal.heroGhostDelay,
    contentKey: title,
  })

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      data-lh-domain-hero
      aria-label={title}
    >
      <div ref={distortStackRef} className={styles.heroDistortStack}>
        <HeroGlassBackground imageSrc={imageSrc} heroRef={heroRef} />
      </div>

      <div className={styles.heroOverlay} aria-hidden />

      <div ref={leftTextRef} className={styles.heroTitlePrimaryWrap}>
        <h1
          ref={primaryTitleRef}
          className={`${styles.heroTitlePrimary} ${styles.heroTitlePrimaryReveal} ${styles.textReveal}`}
        >
          {title}
        </h1>
      </div>

      <div ref={layerRef} className={styles.heroForegroundLayer} aria-hidden>
        <div className={styles.heroForegroundLayerInner}>
          <img src={layerSrc} alt="" className={styles.heroForegroundImage} decoding="async" />
        </div>
      </div>

      <div ref={rightTextRef} className={styles.heroTitleGhostWrap}>
        <p
          ref={ghostTitleRef}
          className={`${styles.heroTitleGhost} ${styles.heroTitleGhostReveal} ${styles.textReveal}`}
          aria-hidden
        >
          {title}
        </p>
      </div>

      <div className={styles.scrollCtaAnchor}>
        <button type="button" className={styles.scrollCta} onClick={onScrollToContent}>
          <span className={styles.scrollCtaIcon} aria-hidden>
            ↓
          </span>
          {scrollCta}
        </button>
      </div>
    </section>
  )
}
