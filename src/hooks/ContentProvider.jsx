import { useEffect, useMemo, useState } from 'react'
import { ContentContext } from './ContentContext.js'

const LOCALE_KEY = 'ms_locale'

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null)
  const [locale, setLocale] = useState(() => localStorage.getItem(LOCALE_KEY) || 'en')

  useEffect(() => {
    fetch('/api/content.php')
      .then((res) => res.json())
      .then(setContent)
      .catch((err) => console.error('failed to load content', err))
  }, [])

  const toggleLocale = () => {
    setLocale((prev) => {
      const next = prev === 'en' ? 'si' : 'en'
      localStorage.setItem(LOCALE_KEY, next)
      return next
    })
  }

  const t = useMemo(() => {
    return (page, section, key) => {
      const entry = content?.[page]?.[section]?.[key]
      if (!entry) return ''
      return (locale === 'si' && entry.si) ? entry.si : entry.en
    }
  }, [content, locale])

  const value = { content, locale, toggleLocale, t, ready: content !== null }

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
