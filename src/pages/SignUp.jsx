import { useId, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import Button from '../components/Button'
import Card from '../components/Card'
import Seo from '../components/Seo'
import { validateSignup } from '../utils/validation'
import { useContent } from '../hooks/useContent.js'
import { useAuth } from '../hooks/useAuth.js'
import './SignUp.css'

const initialForm = { name: '', email: '', password: '' }

function SignUp() {
  const navigate = useNavigate()
  const { t, locale } = useContent()
  const { signUp, signInWithGoogle } = useAuth()
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
    const normalized = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
    }
    const nextErrors = validateSignup(normalized)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    const { ok, errors: apiErrors } = await signUp(normalized)
    setSubmitting(false)

    if (!ok) {
      setErrors(apiErrors || { form: 'err_generic' })
      return
    }

    navigate('/sign-in', { state: { justSignedUp: true } })
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
        path="/sign-up"
        title="Sign Up"
        description="Create your Magul Sakwala account to submit and manage marriage proposals privately."
        noindex
      />
      <section className="signup-section">
      <div className="signup-intro">
        <h1>{t('auth', 'signup', 'heading')}</h1>
        <p>{t('auth', 'signup', 'subtext')}</p>
      </div>

      <Card className="signup-card">
        <form onSubmit={handleSubmit} noValidate>
          <label className="field" htmlFor={fid('name')}>
            <span>{t('auth', 'signup', 'label_name')}</span>
            <input
              id={fid('name')}
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              autoComplete="name"
              maxLength={80}
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? fid('name-err') : undefined}
            />
            {errors.name && <span id={fid('name-err')} className="field-error">{errorText(errors.name)}</span>}
          </label>

          <label className="field" htmlFor={fid('email')}>
            <span>{t('auth', 'signup', 'label_email')}</span>
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
            <span>{t('auth', 'signup', 'label_password')}</span>
            <input
              id={fid('password')}
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              aria-invalid={!!errors.password}
              aria-describedby={`${fid('password-hint')}${errors.password ? ` ${fid('password-err')}` : ''}`}
            />
            <span id={fid('password-hint')} className="field-hint">
              {t('auth', 'signup', 'password_hint') || 'At least 8 characters, mix letters and numbers.'}
            </span>
            {form.password.length > 0 && (() => {
              const len = form.password.length
              const hasLetter = /[a-zA-Z]/.test(form.password)
              const hasDigit = /[0-9]/.test(form.password)
              const level = len < 8 ? 'weak' : (!hasDigit || !hasLetter) ? 'medium' : 'strong'
              return (
                <div className="pw-strength" data-level={level}>
                  <div className="pw-strength-bar" />
                </div>
              )
            })()}
            {errors.password && <span id={fid('password-err')} className="field-error">{errorText(errors.password)}</span>}
          </label>

          {errors.form && <p className="field-error">{errorText(errors.form)}</p>}

          <Button type="submit" disabled={submitting}>
            {submitting ? (t('auth', 'signup', 'btn_submitting') || 'Submitting…') : (t('auth', 'signup', 'btn_submit') || 'Submit')}
          </Button>
        </form>

        <div className="auth-divider">
          <span>{t('auth', 'signup', 'divider_text')}</span>
        </div>

        <div className="google-button-wrap">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setErrors({ form: 'google_verify_failed' })}
            theme="outline"
            shape="pill"
            size="large"
            text="signup_with"
            logo_alignment="left"
            locale={locale}
          />
        </div>

        <p className="auth-switch">
          {t('auth', 'signup', 'switch_prompt')} <Link to="/sign-in">{t('auth', 'signup', 'switch_link')}</Link>
        </p>
      </Card>
    </section>
    </>
  )
}

export default SignUp
