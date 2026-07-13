import { i18n } from '@lingui/core'
import { detect, fromUrl, fromStorage, fromNavigator } from '@lingui/detect-locale'

const LOCALES = ['en', 'es', 'fr', 'de', 'ja']
const DEFAULT_LOCALE = 'en'
const RTL_LOCALES = new Set(['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'yi'])

function getDirection(locale) {
  return RTL_LOCALES.has(locale.split('-')[0]) ? 'rtl' : 'ltr'
}

export function detectLocale() {
  const detected = detect(fromUrl('lang'), fromStorage('lang'), fromNavigator())
  if (detected) {
    if (LOCALES.includes(detected)) return detected
    const base = detected.split('-')[0]
    if (LOCALES.includes(base)) return base
  }
  return DEFAULT_LOCALE
}

export async function loadCatalog(locale) {
  try {
    const { messages } = await import(`./locales/${locale}/messages.po`)
    i18n.loadAndActivate({ locale, messages })
  } catch (e) {
    console.error(`Failed to load "${locale}" catalog, falling back to "${DEFAULT_LOCALE}"`, e)
    const { messages } = await import(`./locales/${DEFAULT_LOCALE}/messages.po`)
    i18n.loadAndActivate({ locale: DEFAULT_LOCALE, messages })
  }
  document.documentElement.lang = i18n.locale
  document.documentElement.dir = getDirection(i18n.locale)
}

export function saveLocale(locale) {
  localStorage.setItem('lang', locale)
}

loadCatalog(detectLocale())

export { i18n, LOCALES, DEFAULT_LOCALE }
