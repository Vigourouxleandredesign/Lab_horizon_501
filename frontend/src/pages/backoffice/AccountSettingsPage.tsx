import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  deleteAccount,
  updateAccountEmail,
  updateAccountIdentity,
  updateAccountOrcid,
  updateAccountPassword,
} from '../../api/accountRgpd'
import { useAuth } from '../../auth/AuthContext'
import { useLocale } from '../../hooks/useLocale'
import { accountSettingsPageCopy } from '../../i18n/backoffice'
import type { Locale } from '../../i18n/home'
import { isDemoAuth } from '../../lib/config'
import styles from '../../style/backoffice/AccountSettingsPage.module.css'

/** Union des deux locales (fr/en) — évite de figer les littéraux d'une seule langue. */
type AccountCopy = (typeof accountSettingsPageCopy)[Locale]

const ORCID_PATTERN = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/

/**
 * Découpe naïve d'un nom complet — le back n'expose qu'un champ `name`
 * unique (pas de `first_name`/`last_name`). Sert uniquement à préremplir les
 * deux champs d'édition ci-dessous ; les valeurs restent éditables.
 */
function splitDisplayName(name: string | undefined): { firstName: string; lastName: string } {
  const trimmed = (name ?? '').trim()
  if (!trimmed) return { firstName: '', lastName: '' }
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts.slice(0, -1).join(' '), lastName: parts[parts.length - 1] }
}

/**
 * Bandeau affiché après une tentative de sauvegarde RGPD réussie côté
 * validation client, mais non branchée côté serveur (`ACCOUNT_API_READY`
 * = false, cf. `api/account.ts`). Honnête sur l'état réel de la fonctionnalité.
 */
function NotReadyBanner({ message }: { message: string }) {
  return (
    <p className={styles.notReadyBanner} role="status">
      {message}
    </p>
  )
}

function IdentityCard({ t, displayName }: { t: AccountCopy; displayName?: string }) {
  const initial = splitDisplayName(displayName)
  const [firstName, setFirstName] = useState(initial.firstName)
  const [lastName, setLastName] = useState(initial.lastName)
  const [banner, setBanner] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    const result = await updateAccountIdentity({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    })
    setSubmitting(false)
    setBanner(!result.ok)
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>{t.identitySection.title}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.formLabel}>
          <span>{t.identitySection.firstNameLabel}</span>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={styles.formInput}
          />
        </label>
        <label className={styles.formLabel}>
          <span>{t.identitySection.lastNameLabel}</span>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={styles.formInput}
          />
        </label>
        {banner && <NotReadyBanner message={t.notReadyBanner} />}
        <button type="submit" className={styles.formSubmit} disabled={submitting}>
          {t.identitySection.submit}
        </button>
      </form>
    </section>
  )
}

function EmailCard({ t, currentEmail }: { t: AccountCopy; currentEmail?: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [banner, setBanner] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setBanner(false)

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t.emailSection.errorInvalidEmail)
      return
    }
    if (!password) {
      setError(t.emailSection.errorMissingPassword)
      return
    }
    setError(null)

    setSubmitting(true)
    const result = await updateAccountEmail({ email: email.trim(), currentPassword: password })
    setSubmitting(false)
    setBanner(!result.ok)
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>{t.emailSection.title}</h2>
      <p className={styles.currentValue}>
        {t.emailSection.currentLabel} : <strong>{currentEmail}</strong>
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.formLabel}>
          <span>{t.emailSection.newLabel}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.formInput}
          />
        </label>
        <label className={styles.formLabel}>
          <span>{t.emailSection.passwordLabel}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.formInput}
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className={styles.formError} role="alert">
            {error}
          </p>
        )}
        {banner && <NotReadyBanner message={t.notReadyBanner} />}
        <button type="submit" className={styles.formSubmit} disabled={submitting}>
          {t.emailSection.submit}
        </button>
      </form>
    </section>
  )
}

function PasswordCard({ t }: { t: AccountCopy }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [banner, setBanner] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setBanner(false)

    if (!current) {
      setError(t.passwordSection.errorMissingCurrent)
      return
    }
    if (next.length < 8) {
      setError(t.passwordSection.errorTooShort)
      return
    }
    if (next !== confirm) {
      setError(t.passwordSection.errorMismatch)
      return
    }
    setError(null)

    setSubmitting(true)
    const result = await updateAccountPassword({ currentPassword: current, newPassword: next })
    setSubmitting(false)
    setBanner(!result.ok)
    if (result.ok) {
      setCurrent('')
      setNext('')
      setConfirm('')
    }
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>{t.passwordSection.title}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.formLabel}>
          <span>{t.passwordSection.currentLabel}</span>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className={styles.formInput}
            autoComplete="current-password"
          />
        </label>
        <label className={styles.formLabel}>
          <span>{t.passwordSection.newLabel}</span>
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className={styles.formInput}
            autoComplete="new-password"
          />
        </label>
        <label className={styles.formLabel}>
          <span>{t.passwordSection.confirmLabel}</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={styles.formInput}
            autoComplete="new-password"
          />
        </label>
        {error && (
          <p className={styles.formError} role="alert">
            {error}
          </p>
        )}
        {banner && <NotReadyBanner message={t.notReadyBanner} />}
        <button type="submit" className={styles.formSubmit} disabled={submitting}>
          {t.passwordSection.submit}
        </button>
      </form>
    </section>
  )
}

function OrcidCard({ t, initialOrcid }: { t: AccountCopy; initialOrcid?: string | null }) {
  const [orcid, setOrcid] = useState(initialOrcid ?? '')
  const [error, setError] = useState<string | null>(null)
  const [banner, setBanner] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setBanner(false)

    const trimmed = orcid.trim()
    if (trimmed && !ORCID_PATTERN.test(trimmed)) {
      setError(t.orcidSection.errorFormat)
      return
    }
    setError(null)

    setSubmitting(true)
    const result = await updateAccountOrcid({ orcid: trimmed })
    setSubmitting(false)
    setBanner(!result.ok)
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>{t.orcidSection.title}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.formLabel}>
          <span>{t.orcidSection.label}</span>
          <input
            type="text"
            value={orcid}
            onChange={(e) => setOrcid(e.target.value)}
            placeholder={t.orcidSection.placeholder}
            className={styles.formInput}
          />
        </label>
        <p className={styles.fieldNote}>{t.orcidSection.note}</p>
        {error && (
          <p className={styles.formError} role="alert">
            {error}
          </p>
        )}
        {banner && <NotReadyBanner message={t.notReadyBanner} />}
        <button type="submit" className={styles.formSubmit} disabled={submitting}>
          {t.orcidSection.submit}
        </button>
      </form>
    </section>
  )
}

function PseudonymCard({ t }: { t: AccountCopy }) {
  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>{t.pseudonymSection.title}</h2>
      <label className={styles.formLabel}>
        <span>{t.pseudonymSection.label}</span>
        <input
          type="text"
          value=""
          disabled
          placeholder={t.pseudonymSection.placeholder}
          className={styles.formInput}
        />
      </label>
      <p className={styles.fieldNote}>{t.pseudonymSection.note}</p>
    </section>
  )
}

function DangerZoneCard({ t }: { t: AccountCopy }) {
  const [confirmed, setConfirmed] = useState(false)
  const [banner, setBanner] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleDelete = async () => {
    if (!confirmed) return
    if (!window.confirm(t.dangerSection.confirmPrompt)) return

    setSubmitting(true)
    const result = await deleteAccount()
    setSubmitting(false)
    setBanner(!result.ok)
  }

  return (
    <section className={styles.dangerCard}>
      <h2 className={styles.cardTitle}>{t.dangerSection.title}</h2>
      <p className={styles.dangerBody}>{t.dangerSection.body}</p>
      <label className={styles.dangerCheckboxLabel}>
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />
        <span>{t.dangerSection.confirmLabel}</span>
      </label>
      {banner && <NotReadyBanner message={t.notReadyBanner} />}
      <button
        type="button"
        className={styles.dangerSubmit}
        disabled={!confirmed || submitting}
        onClick={handleDelete}
      >
        {t.dangerSection.submit}
      </button>
    </section>
  )
}

/**
 * Votre compte (`/compte/profil`) — identité, email, mot de passe, ORCID,
 * pseudonyme (lecture seule) et suppression RGPD. Validation client complète ;
 * chaque sauvegarde est gated par `ACCOUNT_API_READY = false` (cf.
 * `api/account.ts`) tant que le back n'expose pas les routes dédiées.
 */
export default function AccountSettingsPage() {
  const { locale, setLocale } = useLocale()
  const t = accountSettingsPageCopy[locale]
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = t.metaTitle
  }, [t.metaTitle])

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>{t.title}</h1>
      </header>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>{t.identity}</h2>
        <p className={styles.identityName}>{user?.displayName}</p>
        <p className={styles.identityEmail}>{user?.email}</p>
        {isDemoAuth && (
          <p className={styles.demoNote} role="note">
            {t.demoNote}
          </p>
        )}
      </section>

      <IdentityCard t={t} displayName={user?.displayName} />
      <EmailCard t={t} currentEmail={user?.email} />
      <PasswordCard t={t} />
      <OrcidCard t={t} initialOrcid={user?.orcid} />
      <PseudonymCard t={t} />

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>{t.language}</h2>
        <div className={styles.languageToggle} role="group" aria-label={t.language}>
          <button
            type="button"
            className={locale === 'fr' ? styles.languageOptionActive : styles.languageOption}
            onClick={() => setLocale('fr')}
            aria-pressed={locale === 'fr'}
          >
            FR
          </button>
          <button
            type="button"
            className={locale === 'en' ? styles.languageOptionActive : styles.languageOption}
            onClick={() => setLocale('en')}
            aria-pressed={locale === 'en'}
          >
            EN
          </button>
        </div>
      </section>

      <DangerZoneCard t={t} />

      <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
        {t.logout}
      </button>
    </main>
  )
}
