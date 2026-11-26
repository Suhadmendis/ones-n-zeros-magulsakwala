import { useId, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Seo from '../components/Seo'
import './SignUp.css'
import './ForgotPassword.css'

function ForgotPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const uid = useId()
  const fid = (name) => `${uid}-${name}`

  return (
    <>
      <Seo path="/forgot-password" title="Reset Password" noindex />
      <section className="signup-section">
        <div className="signup-intro">
          <h1>{token ? 'Set a new password' : 'Reset your password'}</h1>
          <p>{token ? 'Enter a new password for your account.' : 'Enter your email address and we\'ll send you reset instructions.'}</p>
        </div>

        <Card className="signup-card">
          {token ? (
            <ResetForm token={token} fid={fid} />
          ) : (
            <RequestForm fid={fid} />
          )}

          <p className="auth-switch">
            <Link to="/sign-in">Back to Sign In</Link>
          </p>
        </Card>
      </section>
    </>
  )
}

function RequestForm({ fid }) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch('/api/password-reset.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
    } catch {
      // intentionally swallowed — always show success to avoid email enumeration
    } finally {
      setSubmitting(false)
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <p className="auth-success">
        If that email is registered, you'll receive reset instructions shortly.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label className="field" htmlFor={fid('email')}>
        <span>Email address</span>
        <input
          id={fid('email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={254}
          required
        />
      </label>

      <Button type="submit" disabled={submitting || !email.trim()}>
        {submitting ? 'Sending…' : 'Send reset instructions'}
      </Button>
    </form>
  )
}

function ResetForm({ token, fid }) {
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null) // 'success' | 'error' | null

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setStatus('mismatch')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/password-reset.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: form.password }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'success') {
    return (
      <div>
        <p className="auth-success">
          Password reset! Sign in with your new password.
        </p>
        <p style={{ marginTop: 16, textAlign: 'center', fontSize: 14 }}>
          <Link to="/sign-in">Go to Sign In</Link>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {status === 'error' && (
        <p className="fp-error">This reset link is invalid or has expired.</p>
      )}
      {status === 'mismatch' && (
        <p className="fp-error">Passwords do not match.</p>
      )}

      <label className="field" htmlFor={fid('password')}>
        <span>New password</span>
        <input
          id={fid('password')}
          type="password"
          value={form.password}
          onChange={handleChange('password')}
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
        />
      </label>

      <label className="field" htmlFor={fid('confirm')}>
        <span>Confirm new password</span>
        <input
          id={fid('confirm')}
          type="password"
          value={form.confirm}
          onChange={handleChange('confirm')}
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
        />
      </label>

      <Button type="submit" disabled={submitting || !form.password || !form.confirm}>
        {submitting ? 'Resetting…' : 'Reset password'}
      </Button>
    </form>
  )
}

export default ForgotPassword
