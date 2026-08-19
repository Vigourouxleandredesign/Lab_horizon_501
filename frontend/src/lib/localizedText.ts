import type { Locale } from '../i18n/home'

export type LocalizedString = { fr: string; en: string }

export function localizedText(text: LocalizedString, locale: Locale): string {
  return text[locale]
}
