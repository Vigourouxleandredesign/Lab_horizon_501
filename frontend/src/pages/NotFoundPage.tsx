import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { brandDetectiveLogoSrc, figmaHomeAssets as A } from '../assets/figmaHomeAssets'
import { useLocale } from '../hooks/useLocale'
import { useTextReveal } from '../hooks/useTextReveal'
import { notFoundCopy } from '../i18n/notFound'
import { gsapMotion } from '../lib/gsapDefaults'
import styles from '../style/pages/NotFoundPage.module.css'

export default function NotFoundPage() {
  const { locale } = useLocale()
  const t = notFoundCopy[locale]
  const titleRef = useRef<HTMLHeadingElement>(null)
  const leadRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  useTextReveal(titleRef, {
    playOnMount: true,
    delay: gsapMotion.textReveal.heroDelay,
    contentKey: t.title,
  })
  useTextReveal(leadRef, {
    playOnMount: true,
    delay: gsapMotion.textReveal.heroDelay + 0.12,
    contentKey: t.lead,
  })

  return (
    <main className={styles.page}>
      <section className={styles.panel} aria-labelledby="not-found-title">
        <div className={styles.mascot}>
          <img
            src={brandDetectiveLogoSrc}
            alt={t.logoAlt}
            className={styles.logo}
            width={402}
            height={540}
          />
        </div>
        <div className={styles.copy}>
          <h1
            id="not-found-title"
            ref={titleRef}
            className={`${styles.title} ${styles.textReveal}`}
          >
            {t.title}
          </h1>
          <p ref={leadRef} className={`${styles.lead} ${styles.textReveal}`}>
            {t.lead}
          </p>

          <form className={styles.searchPill} action="/recherche" method="get" role="search">
            <label htmlFor="not-found-q" className="visually-hidden">
              {t.searchLabel}
            </label>
            <div className={styles.searchLead}>
              <img src={A.searchLeading} alt="" width={16} height={16} />
            </div>
            <input
              id="not-found-q"
              name="q"
              type="search"
              className={styles.searchInput}
              placeholder={t.searchPlaceholder}
              autoComplete="off"
            />
            <button type="submit" className={styles.searchSubmit}>
              {t.searchSubmit}
            </button>
          </form>

          <p className={styles.discover}>
            {t.discoverLead}{' '}
            <Link to="/categories">{t.categoriesCta}</Link> {t.discoverJoin}{' '}
            <Link to="/chercheurs">{t.institutesCta}</Link>.
          </p>
          <Link to="/" className={styles.backHome}>
            {t.backHome}
          </Link>
        </div>
      </section>
    </main>
  )
}
