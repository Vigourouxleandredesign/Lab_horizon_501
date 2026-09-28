import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { figmaHomeAssets as A, getDomainPillSrc, getHomeHeroSrc } from '../assets/figmaHomeAssets'
import DomainFieldCarousel, {
  type DomainFieldCarouselHandle,
} from '../components/DomainFieldCarousel'
import HomeHero from '../components/HomeHero'
import { uncTeams } from '../data/uncResearch'
import { domainSlides, homeCopy } from '../i18n/home'
import { useLocale } from '../hooks/useLocale'
import { localizedText } from '../lib/localizedText'
import styles from '../style/pages/HomePage.module.css'

export default function HomePage() {
  const { locale } = useLocale()
  const t = homeCopy[locale]
  const slides = domainSlides[locale]
  const domainCarouselRef = useRef<DomainFieldCarouselHandle>(null)
  const searchRef = useRef<HTMLElement>(null)
  const [domainIndex, setDomainIndex] = useState(0)
  const nSlide = slides.length
  const prevDomainSlide = nSlide ? slides[(domainIndex - 1 + nSlide) % nSlide] : slides[0]
  const nextDomainSlide = nSlide ? slides[(domainIndex + 1) % nSlide] : slides[0]

  const scrollToSearch = useCallback(() => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  return (
    <div className={styles.page}>
      <HomeHero
        title={t.hero.title}
        titleKey={`${locale}:home-hero`}
        platformBadge={t.platformBadge}
        imageSrc={getHomeHeroSrc()}
        scrollCta={t.hero.scrollCta}
        onScrollToContent={scrollToSearch}
      />

      <main className={styles.main}>
        <section
          ref={searchRef}
          className={styles.searchWrap}
          aria-label={t.search.sectionLabel}
        >
          <form className={styles.searchPill} action="/recherche" method="get" role="search">
            <label htmlFor="q" className="visually-hidden">
              {t.search.placeholder}
            </label>
            <div className={styles.searchLead}>
              <img src={A.searchLeading} alt="" width={16} height={16} />
            </div>
            <input
              id="q"
              name="q"
              type="search"
              className={styles.searchInput}
              placeholder={t.search.placeholder}
              autoComplete="off"
            />
            <button type="submit" className={styles.searchSubmit}>
              {t.search.submit}
            </button>
          </form>
          <p className={styles.searchHint}>
            <Link to="/recherche">{t.search.advanced}</Link>{' '}
            <span className={styles.searchHintMuted}>{t.search.advancedHint}</span>
          </p>
        </section>

        <section className={styles.sectionDomain} aria-labelledby="domain-heading">
          <div className={styles.sectionHead}>
            <h2 id="domain-heading">{t.categories.title}</h2>
            <Link to="/categories" className={styles.seeAll}>
              {t.categories.seeAll}{' '}
              <img src={A.seeAllArrow} alt="" width={16} height={16} />
            </Link>
          </div>
          <div className={styles.domainCarousel}>
            <button
              type="button"
              className={styles.carouselArrow}
              onClick={() => domainCarouselRef.current?.step(-1)}
              disabled={nSlide <= 1}
              aria-label={prevDomainSlide.label}
            >
              <img src={A.carouselChevronLeft} alt="" width={14} height={14} />
            </button>
            <div className={styles.domainCarouselStage}>
              <DomainFieldCarousel
                ref={domainCarouselRef}
                slides={slides}
                pillImageForId={getDomainPillSrc}
                pubsCountLabel={t.categories.pubsCount}
                onCenterChange={setDomainIndex}
              />
            </div>
            <button
              type="button"
              className={styles.carouselArrow}
              onClick={() => domainCarouselRef.current?.step(1)}
              disabled={nSlide <= 1}
              aria-label={nextDomainSlide.label}
            >
              <img src={A.carouselChevronRight} alt="" width={14} height={14} />
            </button>
          </div>
          <div className={styles.carouselDots}>
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                className={i === domainIndex ? styles.dotActive : styles.dot}
                onClick={() => domainCarouselRef.current?.goToIndex(i)}
                aria-label={slide.label}
              />
            ))}
          </div>
        </section>

        <section className={styles.sectionResearchers} aria-labelledby="unc-teams-heading">
          <div className={styles.sectionHead}>
            <h2 id="unc-teams-heading">{t.uncTeams.title}</h2>
            <Link to="/chercheurs" className={styles.seeAll}>
              {t.uncTeams.cta}{' '}
              <img src={A.researcherChevron} alt="" width={16} height={16} />
            </Link>
          </div>
          <div className={styles.researcherGrid}>
            {uncTeams.map((team) => (
              <article key={team.id} className={styles.researcherCard}>
                <div className={styles.researcherBody}>
                  <div className={styles.researcherName}>{team.name}</div>
                  <div className={styles.researcherOrg}>{localizedText(team.summary, locale)}</div>
                  <div className={styles.researcherTags}>
                    {team.websiteUrl ? (
                      <a
                        href={team.websiteUrl}
                        className={styles.tagBlue}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t.uncTeams.visitSite}
                      </a>
                    ) : (
                      <span className={styles.tagGreen}>{t.uncTeams.comingSoon}</span>
                    )}
                  </div>
                </div>
                <img
                  src={A.researcherChevron}
                  alt=""
                  width={16}
                  height={16}
                  className={styles.cardChevron}
                />
              </article>
            ))}
          </div>
        </section>

        <section className={styles.mission} aria-labelledby="mission-title">
          <div className={styles.missionInner}>
            <p className={styles.missionBadge}>
              <img src={A.missionBadgeIcon} alt="" width={14} height={14} />
              {t.mission.badge}
            </p>
            <h2 id="mission-title">{t.mission.title}</h2>
            <p>{t.mission.body}</p>
            <Link to="/a-propos" className={styles.missionCta}>
              {t.mission.cta}{' '}
              <img src={A.missionCtaArrow} alt="" width={16} height={16} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
