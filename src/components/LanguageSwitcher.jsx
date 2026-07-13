import { useLingui } from '@lingui/react'
import { LOCALES, DEFAULT_LOCALE, loadCatalog, saveLocale } from '../i18n'

export function LanguageSwitcher() {
  const { i18n } = useLingui()
  const displayNames = new Intl.DisplayNames([i18n.locale], { type: 'language' })

  async function switchLocale(newLocale) {
    await loadCatalog(newLocale)
    saveLocale(newLocale)
  }

  return (
    <select
      value={i18n.locale}
      onChange={(e) => switchLocale(e.target.value)}
      className="border border-stone-300 rounded-lg px-2 py-1.5 text-sm text-stone-600 bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      {LOCALES.map((loc) => (
        <option key={loc} value={loc}>
          {displayNames.of(loc) ?? loc}
        </option>
      ))}
    </select>
  )
}
