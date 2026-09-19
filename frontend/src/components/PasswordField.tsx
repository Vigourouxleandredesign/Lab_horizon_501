import { useId, useState } from 'react'
import styles from '../style/pages/AuthPage.module.css'

type PasswordFieldProps = {
  name: string
  autoComplete?: string
  required?: boolean
  minLength?: number
  /** Libellé accessible du bouton (afficher). */
  showLabel: string
  /** Libellé accessible du bouton (masquer). */
  hideLabel: string
}

/**
 * Champ mot de passe avec bascule œil (type password ↔ text).
 * Bouton `type="button"` pour ne pas soumettre le formulaire.
 */
export default function PasswordField({
  name,
  autoComplete = 'current-password',
  required,
  minLength,
  showLabel,
  hideLabel,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const inputId = useId()

  return (
    <div className={styles.passwordField}>
      <input
        id={inputId}
        type={visible ? 'text' : 'password'}
        name={name}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
      />
      <button
        type="button"
        className={styles.passwordToggle}
        aria-label={visible ? hideLabel : showLabel}
        aria-pressed={visible}
        aria-controls={inputId}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  )
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.6 10.7a3 3 0 0 0 4.2 4.2M7.1 7.3C5 8.7 3.4 10.7 2.5 12c0 0 3.5 6.5 9.5 6.5 1.6 0 3-.4 4.2-1M16.9 15.7C19 14.3 20.6 12.3 21.5 12c0 0-3.5-6.5-9.5-6.5-1.1 0-2.1.2-3 .5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
