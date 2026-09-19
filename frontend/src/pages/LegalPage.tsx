import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '../hooks/useLocale'
import { legalContent, type LegalKind } from '../i18n/legal'
import { commonCopy } from '../i18n/common'
import styles from '../style/pages/SimplePage.module.css'

export type { LegalKind } from '../i18n/legal'

type LegalPageProps = {
  kind: LegalKind
}

export default function LegalPage({ kind }: LegalPageProps) {
  const { locale } = useLocale()
  const content = legalContent(kind, locale)
  const common = commonCopy[locale]

  useEffect(() => {
    document.title = `${content.title}, Lab Horizon`
  }, [content.title])

  return (
    <main className={styles.page}>
      <h1>{content.title}</h1>
      <p className={styles.lead}>{content.intro}</p>

      {content.sections.map((section) => (
        <section key={section.heading} className={styles.legalSection}>
          <h2 className={styles.legalSectionHeading}>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles.legalParagraph}>
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <Link to="/" className={styles.backLink}>
        {common.backHome}
      </Link>
    </main>
  )
}
