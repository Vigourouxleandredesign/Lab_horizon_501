import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTextReveal } from '../../hooks/useTextReveal'
import { HeroGlassBackground } from '../../lib/heroGlass'
import { gsapMotion } from '../../lib/gsapDefaults'
import styles from '../../style/chrome/contentHero.module.css'

type Cta = {
  label: string
  to: string
}

type Props = {
  title: string
  subtitle?: string
  imageSrc: string
  badge?: string
  cta?: Cta
  /**
   * Clé de locale (ex. 'fr' / 'en') — force le remount des textes animés au
   * changement de langue, sinon SplitType restaure l'ancien contenu (cf. §1.2).
   */
  localeKey: string
}

/**
 * Héro de page de contenu (catégories, recherche UNC, à propos).
 * Fond image + effet vague WebGL partagé, titres en text reveal (norme héro).
 */
export default function ContentHero({
  title,
  subtitle,
  imageSrc,
  badge,
  cta,
  localeKey,
}: Props) {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useTextReveal(titleRef, {
    playOnMount: true,
    delay: gsapMotion.textReveal.heroDelay,
    contentKey: `${localeKey}:${title}`,
  })
  useTextReveal(subtitleRef, {
    playOnMount: true,
    delay: gsapMotion.textReveal.heroDelay + 0.12,
    contentKey: `${localeKey}:${subtitle ?? ''}`,
  })

  return (
    <section ref={heroRef} className={styles.hero} aria-label={title}>
      <div className={styles.background}>
        <HeroGlassBackground imageSrc={imageSrc} heroRef={heroRef} />
      </div>

      <div className={styles.overlay} aria-hidden />

      <div className={styles.content}>
        {badge ? <p className={styles.badge}>{badge}</p> : null}
        <h1
          key={`title:${localeKey}`}
          ref={titleRef}
          className={`${styles.title} ${styles.textReveal}`}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            key={`subtitle:${localeKey}`}
            ref={subtitleRef}
            className={`${styles.subtitle} ${styles.textReveal}`}
          >
            {subtitle}
          </p>
        ) : null}
        {cta ? (
          <Link to={cta.to} className={styles.cta}>
            {cta.label}
          </Link>
        ) : null}
      </div>
    </section>
  )
}
