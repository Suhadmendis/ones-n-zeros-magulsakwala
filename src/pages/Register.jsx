import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Seo from '../components/Seo'
import { breadcrumbSchema } from '../seo/schema.js'
import DatePicker from '../components/DatePicker'
import TimePicker from '../components/TimePicker'
import FileInput from '../components/FileInput'
import Select from '../components/Select'
import { validateRegistration } from '../utils/validation'
import { useContent } from '../hooks/useContent.js'
import './Register.css'

const initialForm = {
  name: '',
  email: '',
  phone: '',
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
  const uid = useId()
  const fid = (name) => `${uid}-${name}`

  const districtEntries = Object.entries(content?.global?.districts || {})
  const districtValues = districtEntries.map(([, entry]) => entry.en)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const setField = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const pad2 = (n) => String(n).padStart(2, '0')
  const now = new Date()
  const todayISO = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`

  const handleSubmit = async (e) => {
    e.preventDefault()
    const normalized = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    }
    const nextErrors = validateRegistration(normalized, { districts: districtValues })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const body = new FormData()
      Object.entries(normalized).forEach(([key, value]) => {
        if (value !== null && value !== '') body.append(key, value)
      })

      const res = await fetch('/api/register.php', { method: 'POST', body })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setErrors(data.errors || { form: 'err_generic' })
        setSubmitting(false)
        return
      }

      setSubmitting(false)
      navigate('/thank-you', { state: { submitted: true } })
    } catch {
      setErrors({ form: 'err_network' })
      setSubmitting(false)
    }
  }

  const errorText = (key) => (key ? t('register', 'form_errors', key) || t('register', 'form', key) : null)

  return (
    <>
      <Seo
        path="/register"
        title="Register Your Marriage Proposal"
        description="Register your marriage proposal privately with Magul Sakwala. Trusted Sri Lankan matchmaking — Sinhala, Tamil, English speakers welcome."
        jsonLd={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Register', path: '/register' },
          ]),
        ]}
      />
      <section className="register-section">
      <div className="register-intro">
        <h1>{t('register', 'intro', 'heading')}</h1>
        <p>{t('register', 'intro', 'subtext')}</p>
      </div>

      <div className="register-layout">
        <Card className="register-card">
          <form onSubmit={handleSubmit} noValidate>
            <label className="field" htmlFor={fid('name')}>
              <span>{t('register', 'form', 'label_name')}</span>
              <input
                id={fid('name')}
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                autoComplete="name"
                maxLength={80}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? fid('name-err') : undefined}
              />
              {errors.name && <span id={fid('name-err')} className="field-error">{errorText(errors.name)}</span>}
            </label>

            <label className="field" htmlFor={fid('email')}>
              <span>{t('register', 'form', 'label_email')}</span>
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
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? fid('email-err') : undefined}
              />
              {errors.email && <span id={fid('email-err')} className="field-error">{errorText(errors.email)}</span>}
            </label>

            <label className="field" htmlFor={fid('phone')}>
              <span>{t('register', 'form', 'label_phone')}</span>
              <input
                id={fid('phone')}
                type="tel"
                value={form.phone}
                onChange={handleChange('phone')}
                autoComplete="tel"
                inputMode="tel"
                maxLength={20}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? fid('phone-err') : undefined}
              />
              {errors.phone && <span id={fid('phone-err')} className="field-error">{errorText(errors.phone)}</span>}
            </label>

            <div className="field-row">
              <label className="field" htmlFor={fid('gender')}>
                <span>{t('register', 'form', 'label_gender')}</span>
                <Select
                  id={fid('gender')}
                  value={form.gender}
                  onChange={setField('gender')}
                  placeholder={t('register', 'form', 'option_select')}
                  invalid={!!errors.gender}
                  options={[
                    { value: 'female', label: t('register', 'form', 'option_female') },
                    { value: 'male', label: t('register', 'form', 'option_male') },
                  ]}
                />
                {errors.gender && <span className="field-error">{errorText(errors.gender)}</span>}
              </label>

              <label className="field" htmlFor={fid('dob')}>
                <span>{t('register', 'form', 'label_dob')}</span>
                <DatePicker
                  id={fid('dob')}
                  value={form.dob}
                  onChange={setField('dob')}
                  invalid={!!errors.dob}
                  max={todayISO}
                />
                {errors.dob && <span className="field-error">{errorText(errors.dob)}</span>}
              </label>
            </div>

            <label className="field" htmlFor={fid('district')}>
              <span>{t('register', 'form', 'label_district')}</span>
              <Select
                id={fid('district')}
                value={form.district}
                onChange={setField('district')}
                placeholder={t('register', 'form', 'option_select')}
                invalid={!!errors.district}
                options={districtEntries.map(([key, entry]) => ({
                  value: entry.en,
                  label: t('global', 'districts', key),
                }))}
              />
              {errors.district && <span className="field-error">{errorText(errors.district)}</span>}
            </label>

            <label className="field" htmlFor={fid('birthTime')}>
              <span>{t('register', 'form', 'label_birth_time')}</span>
              <TimePicker
                id={fid('birthTime')}
                value={form.birthTime}
                onChange={setField('birthTime')}
                invalid={!!errors.birthTime}
              />
              {errors.birthTime && <span className="field-error">{errorText(errors.birthTime)}</span>}
            </label>

            <div className="field" role="group" aria-labelledby={fid('photo-lbl')}>
              <span id={fid('photo-lbl')}>{t('register', 'form', 'label_photo')}</span>
              <FileInput
                id={fid('photo')}
                value={form.photo}
                onChange={setField('photo')}
                accept="image/png,image/jpeg"
                invalid={!!errors.photo}
                emptyLabel={t('register', 'form', 'photo_upload_label') || 'Upload photo'}
                hint={t('register', 'form', 'photo_upload_hint') || 'PNG or JPG, up to 5 MB'}
              />
              {errors.photo && <span className="field-error">{errorText(errors.photo)}</span>}
            </div>

            {errors.form && <p className="field-error">{errorText(errors.form)}</p>}

            <Button type="submit" disabled={submitting}>
              {submitting ? t('register', 'form', 'btn_submitting') : t('register', 'form', 'btn_submit')}
            </Button>
          </form>
        </Card>
      </div>
    </section>
    </>
  )
}

export default Register
