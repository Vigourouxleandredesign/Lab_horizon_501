import styles from '../style/components/LabLogoBadge.module.css'

type Props = {
  /** Nom du labo/UMR — sert à générer les initiales de repli. */
  name: string
  /** Logo réel (public/logos/…) ; si absent, un monogramme est affiché. */
  logoUrl?: string
  className?: string
}

/** Initiales de repli (1 ou 2 lettres) quand aucun logo n'est fourni. */
function initialsFrom(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

/** Logos blancs / clairs qui disparaissent sur fond blanc → fond navy DA. */
function needsNavyBackdrop(logoUrl: string): boolean {
  return /logo-isea|logo-larje/i.test(logoUrl)
}

/**
 * Badge logo labo/UMR — image réelle si `logoUrl` est fourni, sinon
 * monogramme (ex. ISLE). Même dégradé navy DA pour logos blancs et initiales.
 */
export default function LabLogoBadge({ name, logoUrl, className }: Props) {
  const onNavy = !logoUrl || needsNavyBackdrop(logoUrl)
  const badgeClassName = [styles.badge, onNavy ? styles.badgeOnNavy : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={badgeClassName}>
      {logoUrl ? (
        <img src={logoUrl} alt="" className={styles.logoImg} loading="lazy" />
      ) : (
        <span className={styles.monogram} aria-hidden="true">
          {initialsFrom(name)}
        </span>
      )}
    </div>
  )
}
