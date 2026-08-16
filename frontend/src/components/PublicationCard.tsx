import { Link } from 'react-router-dom'
import type { PublicationSummary } from '../api/types'
import styles from '../style/components/PublicationCard.module.css'

type Props = {
  publication: PublicationSummary
}

/**
 * Carte publication — listings (recherche, domaine, liés, fiche chercheur).
 * Affiche titre + accroche + 1 image ; le clic ouvre le PDF / source
 * (sinon repli vers la fiche détail).
 */
export default function PublicationCard({ publication }: Props) {
  const openExternal = Boolean(publication.sourceUrl)
  const className = [
    styles.card,
    publication.coverUrl ? styles.cardWithCover : styles.cardTextOnly,
  ].join(' ')

  const content = (
    <>
      {publication.coverUrl && (
        <div className={styles.media}>
          <img
            src={publication.coverUrl}
            alt=""
            className={styles.cover}
            loading="lazy"
          />
        </div>
      )}
      <div className={styles.body}>
        <h3 className={styles.title}>{publication.title}</h3>
        {publication.lead && <p className={styles.lead}>{publication.lead}</p>}
        <div className={styles.meta}>
          {publication.category && <span className={styles.badge}>{publication.category}</span>}
          {publication.dateLabel && <span>{publication.dateLabel}</span>}
          {publication.authorName && (
            <span className={styles.author}>{publication.authorName}</span>
          )}
          {publication.source === 'hal' && <span className={styles.sourceTag}>HAL</span>}
        </div>
        <span className={styles.cta}>
          {openExternal ? 'Ouvrir le document ↗' : 'Voir la fiche →'}
        </span>
      </div>
    </>
  )

  if (openExternal) {
    return (
      <a
        href={publication.sourceUrl!}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    )
  }

  return (
    <Link to={`/publications/${publication.id}`} className={className}>
      {content}
    </Link>
  )
}
