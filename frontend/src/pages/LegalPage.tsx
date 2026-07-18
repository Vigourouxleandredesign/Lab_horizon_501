import { Link } from 'react-router-dom'
import styles from '../style/pages/SimplePage.module.css'

const legalCopy = {
  'mentions-legales': {
    title: 'Mentions légales',
    body: 'Éditeur : Lab Horizon. Hébergement et coordonnées à compléter pour la mise en production.',
  },
  confidentialite: {
    title: 'Politique de confidentialité',
    body: 'Description du traitement des données personnelles (finalités, durées de conservation, droits des personnes).',
  },
  cookies: {
    title: 'Politique cookies',
    body: 'Information sur les cookies techniques et analytiques utilisés sur la plateforme.',
  },
} as const

export type LegalKind = keyof typeof legalCopy

type LegalPageProps = {
  kind: LegalKind
}

export default function LegalPage({ kind }: LegalPageProps) {
  const content = legalCopy[kind]

  return (
    <main className={styles.page}>
      <h1>{content.title}</h1>
      <p className={styles.lead}>{content.body}</p>

      <Link to="/" className={styles.backLink}>
        Retour à l&apos;accueil
      </Link>
    </main>
  )
}
