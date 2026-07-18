import { useMemo, useRef } from 'react'
import { useHeroParallax } from '../hooks/useHeroParallax'
import { useTextReveal } from '../hooks/useTextReveal'
import { HeroGlassBackground } from '../lib/heroGlass'
import { gsapMotion } from '../lib/gsapDefaults'
import styles from '../style/pages/HomePage.module.css'

type Props = {
  title: string
  imageSrc: string
  scrollCta: string
  onScrollToContent: () => void
}

export default function HomeHero({ title, imageSrc, scrollCta, onScrollToContent }: Props) {
  const heroRef = useRef<HTMLElement>(null)
  const distortStackRef = useRef<HTMLDivElement>(null)
  const parallaxInnerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleWrapRef = useRef<HTMLDivElement>(null)

  const parallaxLayers = useMemo(() => [{ ref: titleWrapRef, factor: 0.1 }], [])

  useHeroParallax(heroRef, parallaxInnerRef, parallaxLayers, {
    syncWithMediaRefs: [],
  })

  useTextReveal(titleRef, {
    playOnMount: true,
    delay: gsapMotion.homeHero.introDelay,
    contentKey: title,
  })

  return (
    <section
      ref={heroRef}
      className={styles.homeHero}
      data-lh-home-hero
      aria-labelledby="home-hero-title"
    >
      <div ref={distortStackRef} className={styles.homeHeroDistortStack}>
        <div ref={parallaxInnerRef} className={styles.homeHeroParallaxInner}>
          <HeroGlassBackground imageSrc={imageSrc} heroRef={heroRef} />
        </div>
      </div>

      <div className={styles.homeHeroOverlay} aria-hidden />

      <div ref={titleWrapRef} className={styles.homeHeroTitleWrap}>
        <h1
          id="home-hero-title"
          ref={titleRef}
          className={`${styles.homeHeroTitle} ${styles.textReveal}`}
        >
          {title}
        </h1>
      </div>

      <div className={styles.homeHeroScrollAnchor}>
        <button type="button" className={styles.homeHeroScrollCta} onClick={onScrollToContent}>
          <span className={styles.homeHeroScrollIcon} aria-hidden>
            ↓
          </span>
          <span className={styles.homeHeroScrollLabel}>{scrollCta}</span>
        </button>
      </div>
    </section>
  )
}
