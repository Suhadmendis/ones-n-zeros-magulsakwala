import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import Button from '../components/Button'
import Card from '../components/Card'
import { validateSignin } from '../utils/validation'
import { useContent } from '../hooks/useContent.js'
import { useAuth } from '../hooks/useAuth.js'
import './SignUp.css'

const initialForm = { email: '', password: '' }

function SignIn() {
  const navigate = useNavigate()
  const { t } = useContent()
  const { signIn, signInWithGoogle } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const errorText = (key) => (key ? t('auth', 'form_errors', key) : null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validateSignin(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    const { ok, errors: apiErrors } = await signIn(form)
    setSubmitting(false)

    if (!ok) {
      setErrors(apiErrors || { form: 'err_generic' })
      return
    }

    navigate('/')
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    const { ok, errors: apiErrors } = await signInWithGoogle(credentialResponse.credential)
    if (!ok) {
      setErrors(apiErrors || { form: 'err_generic' })
      return
    }
    navigate('/')
  }

  return (
    <section className="signup-section">
      <div className="signup-intro">
        <h1>{t('auth', 'signin', 'heading')}</h1>
        <p>{t('auth', 'signin', 'subtext')}</p>
      </div>

      <Card className="signup-card">
        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>{t('auth', 'signin', 'label_email')}</span>
            <input type="email" value={form.email} onChange={handleChange('email')} />
            {errors.email && <span className="field-error">{errorText(errors.email)}</span>}
          </label>

          <label className="field">
            <span>{t('auth', 'signin', 'label_password')}</span>
            <input type="password" value={form.password} onChange={handleChange('password')} />
            {errors.password && <span className="field-error">{errorText(errors.password)}</span>}
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
          />
        </div>

        <p className="auth-switch">
          {t('auth', 'signin', 'switch_prompt')} <Link to="/sign-up">{t('auth', 'signin', 'switch_link')}</Link>
        </p>
      </Card>
    </section>
  )
}

export default SignIn
