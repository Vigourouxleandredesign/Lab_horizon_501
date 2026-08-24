import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ABOUT_TEAM } from '../data/team'
import { useLocale } from '../hooks/useLocale'
import { useTextReveal } from '../hooks/useTextReveal'
import { aboutCopy } from '../i18n/about'
import { gsapMotion } from '../lib/gsapDefaults'
import styles from '../style/pages/AboutPage.module.css'

export default function AboutPage() {
  const { locale } = useLocale()
  const t = aboutCopy[locale]
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
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="about-hero-title">
        <p className={styles.badge}>{t.badge}</p>
        <h1
          id="about-hero-title"
          ref={titleRef}
          className={`${styles.heroTitle} ${styles.textReveal}`}
        >
          {t.title}
        </h1>
        <p ref={leadRef} className={`${styles.heroLead} ${styles.textReveal}`}>
          {t.lead}
        </p>
        <Link to="/recherche" className={styles.heroCta}>
          {t.exploreCta}
        </Link>
      </section>

      <main className={styles.main}>
        <section className={styles.section} aria-labelledby="about-project-title">
          <h2 id="about-project-title">{t.projectTitle}</h2>
          {t.projectBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section className={styles.section} aria-labelledby="about-why-title">
          <h2 id="about-why-title">{t.whyTitle}</h2>
          <p>{t.whyBody}</p>
          <div className={styles.pillars}>
            {t.pillars.map((pillar) => (
              <article key={pillar.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{pillar.title}</h3>
                <p className={styles.cardBody}>{pillar.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="about-team-title">
          <h2 id="about-team-title">{t.teamTitle}</h2>
          <p>{t.teamLead}</p>
          <ul className={styles.team}>
            {ABOUT_TEAM.map((member) => (
              <li key={member.id} className={styles.card}>
                <p className={styles.memberName}>
                  {member.firstName} {member.lastName}
                </p>
                <p className={styles.memberRole}>{t.roles[member.id]}</p>
              </li>
            ))}
          </ul>
        </section>

        <p className={styles.discover}>
          {t.discoverLead}{' '}
          <Link to="/categories">{t.categoriesCta}</Link> {t.discoverJoin}{' '}
          <Link to="/chercheurs">{t.institutesCta}</Link>.
        </p>
        <Link to="/" className={styles.backHome}>
          {t.backHome}
        </Link>
      </main>
    </div>
  )
}
