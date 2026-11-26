export const SITE_URL = 'https://magulsakwala.lk'
export const SITE_NAME = 'Magul Sakwala'
export const DEFAULT_TITLE = 'Magul Sakwala — Sri Lankan Marriage Proposals'
export const DEFAULT_DESCRIPTION =
  'Trusted Sri Lankan matchmaking service connecting families for marriage proposals in Sinhala, Tamil and English.'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`
export const DEFAULT_LOCALE = 'en_US'
export const ALTERNATE_LOCALES = ['si_LK', 'ta_LK']
export const CONTACT_PHONE = '+94-11-1234567'
export const CONTACT_EMAIL = 'hello@magulsakwala.lk'
export const SOCIAL_URLS = [
  'https://facebook.com/magulsakwala',
  'https://instagram.com/magulsakwala',
]

export function absoluteUrl(path = '/') {
  if (!path.startsWith('/')) path = `/${path}`
  return `${SITE_URL}${path === '/' ? '' : path}`
}
