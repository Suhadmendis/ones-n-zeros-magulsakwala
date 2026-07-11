import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import ImagePlaceholder from '../components/ImagePlaceholder'
import { validateRegistration } from '../utils/validation'
import { useContent } from '../hooks/useContent.js'
import './Register.css'

const initialForm = {
  name: '',
  email: '',
  gender: '',
  dob: '',
  district: '',
  birthTime: '',
  photo: null,
}

function Register() {
  const navigate = useNavigate()
  const { t, content } = useContent()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const districtEntries = Object.entries(content?.global?.districts || {})

  const handleChange = (field) => (e) => {
    const value = field === 'photo' ? e.target.files[0] ?? null : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validateRegistration(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const body = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== '') body.append(key, value)
      })

      const res = await fetch('/api/register.php', { method: 'POST', body })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setErrors(data.errors || { form: 'err_generic' })
        setSubmitting(false)
        return
      }

      navigate('/thank-you', { state: { submitted: true } })
    } catch {
      setErrors({ form: 'err_network' })
      setSubmitting(false)
    }
  }

  const errorText = (key) => (key ? t('register', 'form_errors', key) || t('register', 'form', key) : null)

  return (
    <section className="register-section">
      <div className="register-intro">
        <h1>{t('register', 'intro', 'heading')}</h1>
        <p>{t('register', 'intro', 'subtext')}</p>
      </div>

      <div className="register-layout">
        <Card className="register-card">
          <form onSubmit={handleSubmit} noValidate>
            <label className="field">
              <span>{t('register', 'form', 'label_name')}</span>
              <input type="text" value={form.name} onChange={handleChange('name')} />
              {errors.name && <span className="field-error">{errorText(errors.name)}</span>}
            </label>

            <label className="field">
              <span>{t('register', 'form', 'label_email')}</span>
              <input type="email" value={form.email} onChange={handleChange('email')} />
              {errors.email && <span className="field-error">{errorText(errors.email)}</span>}
            </label>

            <div className="field-row">
              <label className="field">
                <span>{t('register', 'form', 'label_gender')}</span>
                <select value={form.gender} onChange={handleChange('gender')}>
                  <option value="">{t('register', 'form', 'option_select')}</option>
                  <option value="female">{t('register', 'form', 'option_female')}</option>
                  <option value="male">{t('register', 'form', 'option_male')}</option>
                </select>
                {errors.gender && <span className="field-error">{errorText(errors.gender)}</span>}
              </label>

              <label className="field">
                <span>{t('register', 'form', 'label_dob')}</span>
                <input type="date" value={form.dob} onChange={handleChange('dob')} />
                {errors.dob && <span className="field-error">{errorText(errors.dob)}</span>}
              </label>
            </div>

            <label className="field">
              <span>{t('register', 'form', 'label_district')}</span>
              <select value={form.district} onChange={handleChange('district')}>
                <option value="">{t('register', 'form', 'option_select')}</option>
                {districtEntries.map(([key, entry]) => (
                  <option key={key} value={entry.en}>
                    {t('global', 'districts', key)}
                  </option>
                ))}
              </select>
              {errors.district && <span className="field-error">{errorText(errors.district)}</span>}
            </label>

            <label className="field">
              <span>{t('register', 'form', 'label_birth_time')}</span>
              <input type="time" value={form.birthTime} onChange={handleChange('birthTime')} />
            </label>

            <label className="field">
              <span>{t('register', 'form', 'label_photo')}</span>
              <input type="file" accept="image/*" onChange={handleChange('photo')} />
            </label>

            {errors.form && <p className="field-error">{errorText(errors.form)}</p>}

            <Button type="submit" disabled={submitting}>
              {submitting ? t('register', 'form', 'btn_submitting') : t('register', 'form', 'btn_submit')}
            </Button>
          </form>
        </Card>

        <div className="register-side">
          <ImagePlaceholder
            width={800}
            height={800}
            alt="registration/trust section image — client to provide"
          />
        </div>
      </div>
    </section>
  )
}

export default Register
