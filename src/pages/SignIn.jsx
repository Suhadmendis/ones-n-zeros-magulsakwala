import { useId, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import Button from '../components/Button'
import Card from '../components/Card'
import Seo from '../components/Seo'
import { validateSignin } from '../utils/validation'
import { useContent } from '../hooks/useContent.js'
import { useAuth } from '../hooks/useAuth.js'
import './SignUp.css'

const initialForm = { email: '', password: '' }

function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const justSignedUp = Boolean(location.state?.justSignedUp)
  const { t, locale } = useContent()
  const { signIn, signInWithGoogle } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const uid = useId()
  const fid = (name) => `${uid}-${name}`

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const errorText = (key) => (key ? t('auth', 'form_errors', key) || key : null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const normalized = { ...form, email: form.email.trim() }
    const nextErrors = validateSignin(normalized)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    const { ok, errors: apiErrors } = await signIn(normalized)
    setSubmitting(false)

    if (!ok) {
      setErrors(apiErrors || { form: 'err_generic' })
      return
    }

    navigate('/')
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setSubmitting(true)
    const { ok, errors: apiErrors } = await signInWithGoogle(credentialResponse.credential)
    setSubmitting(false)
    if (!ok) {
      setErrors(apiErrors || { form: 'err_generic' })
      return
    }
    navigate('/')
  }

  return (
    <>
      <Seo
        path="/sign-in"
        title="Sign In"
        description="Sign in to your Magul Sakwala account to manage your marriage proposal."
        noindex
      />
      <section className="signup-section">
      <div className="signup-intro">
        <h1>{t('auth', 'signin', 'heading')}</h1>
        <p>{t('auth', 'signin', 'subtext')}</p>
      </div>

      <Card className="signup-card">
        {justSignedUp && (
          <p className="auth-success">Account created! Sign in to continue.</p>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <label className="field" htmlFor={fid('email')}>
            <span>{t('auth', 'signin', 'label_email')}</span>
            <input
              id={fid('email')}
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={254}
              required
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? fid('email-err') : undefined}
            />
            {errors.email && <span id={fid('email-err')} className="field-error">{errorText(errors.email)}</span>}
          </label>

          <label className="field" htmlFor={fid('password')}>
            <span>{t('auth', 'signin', 'label_password')}</span>
            <input
              id={fid('password')}
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              autoComplete="current-password"
              maxLength={128}
              required
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? fid('password-err') : undefined}
            />
            {errors.password && <span id={fid('password-err')} className="field-error">{errorText(errors.password)}</span>}
          </label>

          {errors.form && <p className="field-error">{errorText(errors.form)}</p>}

          <Button type="submit" disabled={submitting}>
            {submitting ? t('auth', 'signin', 'btn_submitting') : t('auth', 'signin', 'btn_submit')}
          </Button>
        </form>

        <div className="auth-divider">
          <span>{t('auth', 'signin', 'divider_text')}</span>
        </div>

        <div className="google-button-wrap">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setErrors({ form: 'google_verify_failed' })}
            theme="outline"
            shape="pill"
            size="large"
            text="signin_with"
            locale={locale}
            logo_alignment="left"
          />
        </div>

        <p className="auth-switch">
          {t('auth', 'signin', 'switch_prompt')} <Link to="/sign-up">{t('auth', 'signin', 'switch_link')}</Link>
        </p>
      </Card>
    </section>
    </>
  )
}

export default SignIn
