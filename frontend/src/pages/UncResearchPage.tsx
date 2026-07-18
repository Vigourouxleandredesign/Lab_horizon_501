import { directoryIntro, externalUmrs, uncTeams } from '../data/uncResearch'
import styles from '../style/pages/UncResearchPage.module.css'

export default function UncResearchPage() {
  return (
    <main className={styles.page}>
      <h1>Recherche à l&apos;UNC</h1>
      <p className={styles.intro}>
        Les équipes de recherche de l&apos;Université de Nouvelle-Calédonie et les
        annuaires des acteurs de la recherche — enseignants-chercheurs, ingénieurs et
        techniciens.
      </p>

      <section className={styles.section} aria-labelledby="teams-heading">
        <h2 id="teams-heading">Équipes de recherche UNC</h2>
        <div className={styles.teamGrid}>
          {uncTeams.map((team) => (
            <article key={team.id} className={styles.teamCard}>
              <h3>{team.name}</h3>
              <p>{team.summary}</p>
              {team.websiteUrl ? (
                <a
                  href={team.websiteUrl}
                  className={styles.teamLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {team.websiteLabel ?? 'Voir le site'}
                </a>
              ) : (
                <span className={styles.badgeSoon}>Site bientôt disponible</span>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="directory-heading">
        <div className={styles.directoryCard}>
          <h2 id="directory-heading">{directoryIntro.title}</h2>
          <p>{directoryIntro.subtitle}</p>
          <div className={styles.linkList}>
            {directoryIntro.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                className={styles.teamLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className={styles.umrBlock}>
            <h3>UMR hors UNC (informations à compléter)</h3>
            {externalUmrs.map((umr) => (
              <div key={umr.id} className={styles.umrCard}>
                <strong>{umr.name}</strong>
                <p>{umr.summary}</p>
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
  )
}
