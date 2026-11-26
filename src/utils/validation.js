export const NAME_MAX = 80
export const EMAIL_MAX = 254
export const PHONE_MAX = 20
export const PHONE_MIN = 7
export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 128
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024
export const PHOTO_MIME = ['image/png', 'image/jpeg']
export const MIN_AGE = 18
export const MAX_AGE = 100

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^\+?[0-9][0-9\s\-()]{5,19}$/
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const ISO_TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

function validateName(form, errors) {
  const name = (form.name || '').trim()
  if (!name) errors.name = 'name_required'
  else if (name.length < 2) errors.name = 'name_too_short'
  else if (name.length > NAME_MAX) errors.name = 'name_too_long'
}

function validateEmail(form, errors, { required = true } = {}) {
  const email = (form.email || '').trim()
  if (!email) {
    if (required) errors.email = 'email_required'
    return
  }
  if (email.length > EMAIL_MAX) errors.email = 'email_too_long'
  else if (!EMAIL_RE.test(email)) errors.email = 'email_invalid'
}

function validatePhone(form, errors) {
  const phone = (form.phone || '').trim()
  if (!phone) {
    errors.phone = 'phone_required'
    return
  }
  if (phone.length > PHONE_MAX) {
    errors.phone = 'phone_too_long'
    return
  }
  const digits = phone.replace(/\D/g, '')
  if (digits.length < PHONE_MIN || !PHONE_RE.test(phone)) {
    errors.phone = 'phone_invalid'
  }
}

function validatePassword(form, errors, { requireStrong = false } = {}) {
  const pw = form.password || ''
  if (!pw) {
    errors.password = 'password_required'
    return
  }
  if (pw.length < PASSWORD_MIN) {
    errors.password = 'password_min_length'
    return
  }
  if (pw.length > PASSWORD_MAX) {
    errors.password = 'password_too_long'
    return
  }
  if (requireStrong) {
    const hasLetter = /[A-Za-z]/.test(pw)
    const hasDigit = /\d/.test(pw)
    if (!hasLetter || !hasDigit) errors.password = 'password_weak'
  }
}

function ageInYears(isoDate, now = new Date()) {
  const [y, m, d] = isoDate.split('-').map(Number)
  let age = now.getFullYear() - y
  const beforeBirthday =
    now.getMonth() + 1 < m ||
    (now.getMonth() + 1 === m && now.getDate() < d)
  if (beforeBirthday) age -= 1
  return age
}

function isRealDate(y, m, d) {
  if (!y || !m || !d) return false
  const dt = new Date(y, m - 1, d)
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
}

function validateDob(form, errors) {
  const dob = form.dob || ''
  if (!dob) {
    errors.dob = 'dob_required'
    return
  }
  if (!ISO_DATE_RE.test(dob)) {
    errors.dob = 'dob_invalid'
    return
  }
  const [y, m, d] = dob.split('-').map(Number)
  if (!isRealDate(y, m, d)) {
    errors.dob = 'dob_invalid'
    return
  }
  const now = new Date()
  const picked = new Date(y, m - 1, d)
  if (picked > now) {
    errors.dob = 'dob_future'
    return
  }
  const age = ageInYears(dob, now)
  if (age < MIN_AGE) errors.dob = 'dob_min_age'
  else if (age > MAX_AGE) errors.dob = 'dob_invalid'
}

function validateGender(form, errors) {
  if (!form.gender) errors.gender = 'gender_required'
  else if (!['female', 'male'].includes(form.gender)) errors.gender = 'gender_invalid'
}

function validateDistrict(form, errors, allowed) {
  if (!form.district) {
    errors.district = 'district_required'
    return
  }
  if (allowed && allowed.length && !allowed.includes(form.district)) {
    errors.district = 'district_invalid'
  }
}

function validateBirthTime(form, errors) {
  const t = form.birthTime || ''
  if (!t) {
    errors.birthTime = 'birth_time_required'
    return
  }
  if (!ISO_TIME_RE.test(t)) errors.birthTime = 'birth_time_invalid'
}

function validatePhoto(form, errors) {
  const photo = form.photo
  if (!photo) {
    errors.photo = 'photo_required'
    return
  }
  if (!(photo instanceof File)) {
    errors.photo = 'photo_invalid'
    return
  }
  if (!PHOTO_MIME.includes(photo.type)) {
    errors.photo = 'photo_type'
    return
  }
  if (photo.size > PHOTO_MAX_BYTES) {
    errors.photo = 'photo_too_large'
    return
  }
  if (photo.size === 0) errors.photo = 'photo_empty'
}

export function validateRegistration(form, { districts } = {}) {
  const errors = {}
  validateName(form, errors)
  validateEmail(form, errors, { required: false })
  validatePhone(form, errors)
  validateGender(form, errors)
  validateDob(form, errors)
  validateDistrict(form, errors, districts)
  validateBirthTime(form, errors)
  validatePhoto(form, errors)
  return errors
}

export function validateSignup(form) {
  const errors = {}
  validateName(form, errors)
  validateEmail(form, errors)
  validatePassword(form, errors, { requireStrong: true })
  return errors
}

export function validateSignin(form) {
  const errors = {}
  validateEmail(form, errors)
  if (!form.password) errors.password = 'password_required'
  return errors
}
