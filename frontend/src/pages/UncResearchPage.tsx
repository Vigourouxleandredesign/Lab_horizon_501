import { useEffect } from 'react'
import ContentHero from '../components/chrome/ContentHero'
import { getUncResearchHeroSrc } from '../assets/figmaHomeAssets'
import LabLogoBadge from '../components/LabLogoBadge'
import { directoryIntro, externalUmrs, uncTeams } from '../data/uncResearch'
import { useLocale } from '../hooks/useLocale'
import { localizedText } from '../lib/localizedText'
import { uncResearchPageCopy } from '../i18n/uncResearchPage'
import styles from '../style/pages/UncResearchPage.module.css'

export default function UncResearchPage() {
  const { locale } = useLocale()
  const t = uncResearchPageCopy[locale]

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  return (
    <>
      <ContentHero
        title={t.title}
        subtitle={t.intro}
        imageSrc={getUncResearchHeroSrc()}
        localeKey={locale}
      />
      <main className={styles.page}>
      <section className={styles.section} aria-labelledby="teams-heading">
        <h2 id="teams-heading">{t.teamsHeading}</h2>
        <div className={styles.teamGrid}>
          {uncTeams.map((team) => (
            <article key={team.id} className={styles.teamCard}>
              <div className={styles.teamCardHeader}>
                <LabLogoBadge name={team.name} logoUrl={team.logoUrl} />
                <h3>{team.name}</h3>
              </div>
              <p>{localizedText(team.summary, locale)}</p>
              {team.teamUrl ? (
                <a
                  href={team.teamUrl}
                  className={styles.teamLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {team.teamUrlLabel
                    ? localizedText(team.teamUrlLabel, locale)
                    : t.visitSite}
                </a>
              ) : (
                <span className={styles.badgeSoon}>{t.comingSoon}</span>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="directory-heading">
        <div className={styles.directoryCard}>
          <h2 id="directory-heading">{t.directoryTitle}</h2>
          <p>{t.directorySubtitle}</p>
          <div className={styles.linkList}>
            {directoryIntro.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                className={styles.teamLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {localizedText(link.label, locale)}
              </a>
            ))}
          </div>

          <div className={styles.umrBlock}>
            <h3>{t.externalLabsHeading}</h3>
            {externalUmrs.map((umr) => (
              <div key={umr.id} className={styles.umrCard}>
                <div className={styles.umrCardHeader}>
                  <LabLogoBadge name={umr.name} logoUrl={umr.logoUrl} />
                  <strong>{umr.name}</strong>
                </div>
                <p>{localizedText(umr.summary, locale)}</p>
                <a
                  href={umr.websiteUrl}
                  className={styles.teamLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {umr.websiteUrl.replace(/^https?:\/\//, '')}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      </main>
    </>
  )
}
