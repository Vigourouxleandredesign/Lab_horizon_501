import { Link } from 'react-router-dom'
import type { PublicationSummary } from '../api/types'
import styles from '../style/components/PublicationCard.module.css'

type Props = {
  publication: PublicationSummary
}

/**
 * Carte publication — composant unique pour tous les listings
 * (recherche, page domaine, publications liées, fiche chercheur).
 */
export default function PublicationCard({ publication }: Props) {
  return (
    <Link to={`/publications/${publication.id}`} className={styles.card}>
      <h3 className={styles.title}>{publication.title}</h3>
      <p className={styles.author}>{publication.authorName}</p>
      <div className={styles.meta}>
        {publication.category && <span className={styles.badge}>{publication.category}</span>}
        {publication.dateLabel && <span>{publication.dateLabel}</span>}
        {publication.institution && (
          <span className={styles.institution}>{publication.institution}</span>
        )}
        {publication.source === 'hal' && <span className={styles.sourceTag}>HAL</span>}
      </div>
    </Link>
  )
}
