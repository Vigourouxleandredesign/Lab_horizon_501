import { Link } from 'react-router-dom'
import styles from '../style/pages/SimplePage.module.css'

export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <h1>Page introuvable</h1>
      <p className={styles.lead}>
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link to="/" className={styles.backLink}>
        Retour à l&apos;accueil
      </Link>
    </main>
  )
}
