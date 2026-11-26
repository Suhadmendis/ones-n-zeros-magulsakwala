import { useEffect, useMemo, useState } from 'react'
import { ContentContext } from './ContentContext.js'

const LOCALE_KEY = 'ms_locale'
const CONTENT_KEY = 'ms_content'

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CONTENT_KEY)) } catch { return null }
  })
  const [contentError, setContentError] = useState(false)
  const [locale, setLocale] = useState(() => localStorage.getItem(LOCALE_KEY) || 'en')

  useEffect(() => {
    fetch('/api/content.php')
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem(CONTENT_KEY, JSON.stringify(data))
        setContent(data)
        setContentError(false)
      })
      .catch((err) => {
        console.error('failed to load content', err)
        if (!content) setContentError(true)
      })
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

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

  if (contentError) {
    return (
      <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 24, textAlign: 'center' }}>
        <p style={{ fontFamily: 'system-ui, sans-serif', color: '#2b1620' }}>Unable to load site content. Please check your connection and refresh.</p>
        <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', borderRadius: 8, background: '#c2185b', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'system-ui, sans-serif' }}>Retry</button>
      </div>
    )
  }

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
