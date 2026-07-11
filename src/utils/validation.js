export function validateRegistration(form) {
  const errors = {}

  if (!form.name.trim()) errors.name = 'name_required'

  if (!form.email.trim()) {
    errors.email = 'email_required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'email_invalid'
  }

  if (!form.gender) errors.gender = 'gender_required'

  if (!form.dob) {
    errors.dob = 'dob_required'
  } else {
    const age = (Date.now() - new Date(form.dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    if (age < 18) errors.dob = 'dob_min_age'
    if (age > 100) errors.dob = 'dob_invalid'
  }

  if (!form.district) errors.district = 'district_required'

  return errors
}

function validateEmail(form, errors) {
  if (!form.email.trim()) {
    errors.email = 'email_required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'email_invalid'
  }
}

export function validateSignup(form) {
  const errors = {}

  if (!form.name.trim()) errors.name = 'name_required'
  validateEmail(form, errors)

  if (!form.password) {
    errors.password = 'password_required'
  } else if (form.password.length < 8) {
    errors.password = 'password_min_length'
  }

  return errors
}

export function validateSignin(form) {
  const errors = {}

  validateEmail(form, errors)
  if (!form.password) errors.password = 'password_required'

  return errors
}
