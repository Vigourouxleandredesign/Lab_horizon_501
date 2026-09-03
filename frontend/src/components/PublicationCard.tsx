import { Link, useNavigate } from 'react-router-dom'
import type { PublicationSummary } from '../api/types'
import { useLocale } from '../hooks/useLocale'
import { commonCopy } from '../i18n/common'
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
  const { locale } = useLocale()
  const navigate = useNavigate()
  const t = commonCopy[locale]
  const openExternal = Boolean(publication.sourceUrl)
  const className = [
    styles.card,
    publication.coverUrl ? styles.cardWithCover : styles.cardTextOnly,
  ].join(' ')

  const openKeywordSearch = (keyword: string) => {
    navigate(`/recherche?q=${encodeURIComponent(keyword)}`)
  }

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
        {publication.keywords.length > 0 && (
          <div className={styles.keywords}>
            {publication.keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                role="link"
                tabIndex={0}
                className={styles.keywordTag}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  openKeywordSearch(keyword)
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return
                  event.preventDefault()
                  event.stopPropagation()
                  openKeywordSearch(keyword)
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
        <span className={styles.cta}>
          {openExternal ? t.openDocument : t.viewDetail}
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
