import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  CONTACT_PHONE,
  SOCIAL_URLS,
  absoluteUrl,
} from './config.js'

export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    sameAs: SOCIAL_URLS,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT_PHONE,
      contactType: 'customer service',
      areaServed: 'LK',
      availableLanguage: ['si', 'ta', 'en'],
    },
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: ['en', 'si', 'ta'],
    publisher: { '@id': ORG_ID },
  }
}

export function webPageSchema({ path, title, description, lang = 'en' }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: lang,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
  }
}

export function breadcrumbSchema(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  }
}

export function serviceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Matchmaking',
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Sri Lanka' },
    audience: { '@type': 'PeopleAudience', suggestedMinAge: 18 },
    availableLanguage: ['si', 'ta', 'en'],
  }
}
