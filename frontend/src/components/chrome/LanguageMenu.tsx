import { useEffect, useId, useRef, useState } from 'react'
import { figmaHomeAssets as A } from '../../assets/figmaHomeAssets'
import { useLocale } from '../../hooks/useLocale'
import type { Locale } from '../../i18n/home'
import { commonCopy } from '../../i18n/common'
import chrome from '../../style/chrome/siteChrome.module.css'

const LOCALE_OPTIONS: { value: Locale; labelKey: 'langFr' | 'langEn' }[] = [
  { value: 'fr', labelKey: 'langFr' },
  { value: 'en', labelKey: 'langEn' },
]

export default function LanguageMenu() {
  const { locale, setLocale } = useLocale()
  const t = commonCopy[locale]
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const selectLocale = (next: Locale) => {
    setLocale(next)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={chrome.langMenu}>
      <button
        type="button"
        className={chrome.langBtn}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <img src={A.langGlobe} alt="" width={14} height={14} />
        <span>{locale.toUpperCase()}</span>
        <span className={chrome.langMenuChevron} aria-hidden>
          {open ? '▴' : '▾'}
        </span>
      </button>

      {open ? (
        <ul id={menuId} className={chrome.langMenuList} role="listbox" aria-label={t.langMenuLabel}>
          {LOCALE_OPTIONS.map((option) => {
            const selected = locale === option.value
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={selected ? chrome.langMenuOptionActive : chrome.langMenuOption}
                  onClick={() => selectLocale(option.value)}
                >
                  {t[option.labelKey]}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
