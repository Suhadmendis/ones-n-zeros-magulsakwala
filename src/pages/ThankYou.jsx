import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import { useContent } from '../hooks/useContent.js'
import './ThankYou.css'

function ThankYou() {
  const location = useLocation()
  const submitted = Boolean(location.state?.submitted)
  const { t } = useContent()

  useEffect(() => {
    if (!submitted) return
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => document.head.removeChild(meta)
  }, [submitted])

  if (!submitted) {
    return <Navigate to="/register" replace />
  }

  return (
    <section className="ty-section">
      <Card className="ty-card">
        <h1>{t('thank-you', 'main', 'heading')}</h1>
        <p>{t('thank-you', 'main', 'body_1')}</p>
        <p>{t('thank-you', 'main', 'body_2')}</p>
        <p className="ty-note">{t('thank-you', 'main', 'note')}</p>
        <Button to="/">{t('thank-you', 'main', 'cta')}</Button>
      </Card>
    </section>
  )
}

export default ThankYou
