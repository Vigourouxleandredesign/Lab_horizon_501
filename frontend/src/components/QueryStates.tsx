import styles from '../style/components/QueryStates.module.css'

/**
 * États de requête partagés — rendu homogène du chargement, des erreurs
 * et du vide sur toutes les pages branchées à la couche API.
 */

export function LoadingState({ label }: { label: string }) {
  return (
    <p className={styles.loading} role="status">
      {label}
    </p>
  )
}

export function ErrorState({ label }: { label: string }) {
  return (
    <p className={styles.error} role="alert">
      {label}
    </p>
  )
}

export function EmptyState({ label }: { label: string }) {
  return <p className={styles.empty}>{label}</p>
}
