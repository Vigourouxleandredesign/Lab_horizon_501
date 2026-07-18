import { Link } from 'react-router-dom'
import { useLocale } from '../hooks/useLocale'
import { homeCopy } from '../i18n/home'
import styles from '../style/pages/SimplePage.module.css'

export default function AboutPage() {
  const { locale } = useLocale()
  const t = homeCopy[locale]

  return (
    <main className={styles.page}>
      <h1>À propos de Lab Horizon</h1>
      <p className={styles.lead}>{t.mission.body}</p>
      <p className={styles.lead}>
        <strong>{t.mission.title}</strong>
      </p>

      <div className={styles.cardLinks}>
        <Link to="/chercheurs">Recherche UNC</Link>
        <span aria-hidden>·</span>
        <Link to="/recherche">Rechercher des publications</Link>
      </div>

      <Link to="/" className={styles.backLink}>
        Retour à l&apos;accueil
      </Link>
    </main>
  )
}
