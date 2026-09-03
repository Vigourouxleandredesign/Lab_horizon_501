import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { useLocale } from '../../hooks/useLocale'
import { accountSettingsPageCopy } from '../../i18n/backoffice'
import { isDemoAuth } from '../../lib/config'
import styles from '../../style/backoffice/AccountSettingsPage.module.css'

/**
 * Votre compte (`/compte/profil`) — profil lecture seule (pas de `PATCH
 * /api/me` côté back), sélecteur de langue, et seul emplacement du bouton
 * Déconnexion (cf. plan refonte backoffice, décision #3).
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

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>{t.orcidTitle}</h2>
        <p className={styles.orcidNote}>{t.orcidNote}</p>
      </section>

      <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
        {t.logout}
      </button>
    </main>
  )
}
