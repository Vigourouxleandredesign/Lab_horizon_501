import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '../hooks/useLocale'
import { notFoundCopy } from '../i18n/notFound'
import styles from '../style/pages/SimplePage.module.css'

export default function NotFoundPage() {
  const { locale } = useLocale()
  const t = notFoundCopy[locale]

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  return (
    <main className={styles.page}>
      <h1>{t.title}</h1>
      <p className={styles.lead}>{t.lead}</p>
      <Link to="/" className={styles.backLink}>
        {t.backHome}
      </Link>
    </main>
  )
}
