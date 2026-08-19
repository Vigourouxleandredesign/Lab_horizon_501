import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '../hooks/useLocale'
import { aboutCopy } from '../i18n/about'
import styles from '../style/pages/SimplePage.module.css'

export default function AboutPage() {
  const { locale } = useLocale()
  const t = aboutCopy[locale]

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  return (
    <main className={styles.page}>
      <h1>{t.title}</h1>
      <p className={styles.lead}>{t.lead}</p>
      <p className={styles.lead}>
        <strong>{t.missionTitle}.</strong> {t.missionBody}
      </p>

      <div className={styles.cardLinks}>
        <Link to="/chercheurs">{t.linkUncResearch}</Link>
        <span aria-hidden>·</span>
        <Link to="/recherche">{t.linkSearch}</Link>
      </div>

      <Link to="/" className={styles.backLink}>
        {t.backHome}
      </Link>
    </main>
  )
}
