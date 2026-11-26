import { Link, Navigate, useLocation } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Seo from '../components/Seo'
import { useContent } from '../hooks/useContent.js'
import './ThankYou.css'

function ThankYou() {
  const location = useLocation()
  const submitted = Boolean(location.state?.submitted)
  const registrationId = location.state?.id ?? null
  const { t } = useContent()

  if (!submitted) {
    return <Navigate to="/register" replace />
  }

  return (
    <>
      <Seo path="/thank-you" title="Thank You" noindex />
      <section className="ty-section">
        <Card className="ty-card">
          <h1>{t('thank-you', 'main', 'heading')}</h1>
          <p>{t('thank-you', 'main', 'body_1')}</p>
          <p>{t('thank-you', 'main', 'body_2')}</p>
          <p className="ty-note">{t('thank-you', 'main', 'note')}</p>
          {registrationId && (
            <p className="ty-ref">Your reference number: <strong>#{registrationId}</strong></p>
          )}
          <div className="ty-account-cta">
            <p>Sign up to manage your profile and get matched faster.</p>
            <Button to="/sign-up">Create an account to track your proposal</Button>
          </div>
          <Button to="/" variant="outline">{t('thank-you', 'main', 'cta')}</Button>
        </Card>
      </section>
    </>
  )
}

export default ThankYou
