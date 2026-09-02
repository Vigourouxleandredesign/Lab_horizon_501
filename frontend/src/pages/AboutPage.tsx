import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ContentHero from '../components/chrome/ContentHero'
import { getAboutHeroSrc } from '../assets/figmaHomeAssets'
import { ABOUT_TEAM } from '../data/team'
import { useLocale } from '../hooks/useLocale'
import { aboutCopy } from '../i18n/about'
import styles from '../style/pages/AboutPage.module.css'

export default function AboutPage() {
  const { locale } = useLocale()
  const t = aboutCopy[locale]

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  return (
    <div className={styles.page}>
      <ContentHero
        title={t.title}
        subtitle={t.lead}
        imageSrc={getAboutHeroSrc()}
        badge={t.badge}
        cta={{ label: t.exploreCta, to: '/recherche' }}
        localeKey={locale}
      />

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
