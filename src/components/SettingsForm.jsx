import { useRef, useState } from 'react'
import './SettingsForm.css'

const STORAGE_KEY = 'frontend-ai-capstone-settings'

const INITIAL_FORM = {
  displayName: '',
  email: '',
  username: '',
  bio: '',
  weeklyUpdates: false,
}

const FIELD_ORDER = ['displayName', 'email', 'username', 'bio']

function validateField(name, value) {
  switch (name) {
    case 'displayName': {
      const trimmed = value.trim()
      if (!trimmed) return 'Display name is required.'
      if (trimmed.length < 2 || trimmed.length > 50) {
        return 'Display name must be 2–50 characters.'
      }
      return ''
    }
    case 'email': {
      const trimmed = value.trim()
      if (!trimmed) return 'Email is required.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return 'Enter a valid email address.'
      }
      return ''
    }
    case 'username': {
      const trimmed = value.trim()
      if (!trimmed) return 'Username is required.'
      if (trimmed.length < 3 || trimmed.length > 20) {
        return 'Username must be 3–20 characters.'
      }
      if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
        return 'Username may contain only letters, numbers, and underscores.'
      }
      return ''
    }
    case 'bio': {
      if (value.length > 200) return 'Bio must be 200 characters or fewer.'
      return ''
    }
    default:
      return ''
  }
}

function validateAll(form) {
  const errors = {}
  for (const field of FIELD_ORDER) {
    const error = validateField(field, form[field])
    if (error) errors[field] = error
  }
  return errors
}

function loadSavedSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_FORM
    const parsed = JSON.parse(raw)
    return {
      displayName: parsed.displayName ?? '',
      email: parsed.email ?? '',
      username: parsed.username ?? '',
      bio: parsed.bio ?? '',
      weeklyUpdates: Boolean(parsed.weeklyUpdates),
    }
  } catch {
    return INITIAL_FORM
  }
}

function SettingsForm() {
  const [form, setForm] = useState(() => loadSavedSettings())
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const fieldRefs = useRef({})

  const showError = (field) => Boolean(touched[field] && errors[field])

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
    }
  }

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => ({ ...prev, [field]: validateField(field, form[field]) }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validateAll(form)
    const allTouched = Object.fromEntries(FIELD_ORDER.map((f) => [f, true]))

    setTouched(allTouched)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSuccessMessage('')
      const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field])
      fieldRefs.current[firstInvalid]?.focus()
      return
    }

    const payload = {
      displayName: form.displayName.trim(),
      email: form.email.trim(),
      username: form.username.trim(),
      bio: form.bio,
      weeklyUpdates: form.weeklyUpdates,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    setSuccessMessage('Settings saved successfully.')
  }

  const handleReset = () => {
    setForm(INITIAL_FORM)
    setTouched({})
    setErrors({})
    setSuccessMessage('')
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="settings-form-wrapper">
      <h2>Settings</h2>
      <p className="settings-form-description">
        Manage your profile and notification preferences.
      </p>

      {successMessage && (
        <p className="settings-form-success" role="status">
          {successMessage}
        </p>
      )}

      <form className="settings-form" onSubmit={handleSubmit} noValidate>
        <div className="settings-form-field">
          <label htmlFor="displayName">Display name</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            value={form.displayName}
            onChange={handleChange('displayName')}
            onBlur={handleBlur('displayName')}
            ref={(el) => {
              fieldRefs.current.displayName = el
            }}
            aria-invalid={showError('displayName')}
            aria-describedby={
              showError('displayName') ? 'displayName-error' : undefined
            }
          />
          {showError('displayName') && (
            <p id="displayName-error" className="settings-form-error" role="alert">
              {errors.displayName}
            </p>
          )}
        </div>

        <div className="settings-form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            ref={(el) => {
              fieldRefs.current.email = el
            }}
            aria-invalid={showError('email')}
            aria-describedby={showError('email') ? 'email-error' : undefined}
          />
          {showError('email') && (
            <p id="email-error" className="settings-form-error" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div className="settings-form-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange('username')}
            onBlur={handleBlur('username')}
            ref={(el) => {
              fieldRefs.current.username = el
            }}
            aria-invalid={showError('username')}
            aria-describedby={
              showError('username') ? 'username-error' : undefined
            }
          />
          {showError('username') && (
            <p id="username-error" className="settings-form-error" role="alert">
              {errors.username}
            </p>
          )}
        </div>

        <div className="settings-form-field">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={form.bio}
            onChange={handleChange('bio')}
            onBlur={handleBlur('bio')}
            ref={(el) => {
              fieldRefs.current.bio = el
            }}
            aria-invalid={showError('bio')}
            aria-describedby={
              showError('bio') ? 'bio-error bio-count' : 'bio-count'
            }
          />
          <p id="bio-count" className="settings-form-count">
            {form.bio.length}/200 characters
          </p>
          {showError('bio') && (
            <p id="bio-error" className="settings-form-error" role="alert">
              {errors.bio}
            </p>
          )}
        </div>

        <div className="settings-form-field settings-form-checkbox">
          <input
            id="weeklyUpdates"
            name="weeklyUpdates"
            type="checkbox"
            checked={form.weeklyUpdates}
            onChange={handleChange('weeklyUpdates')}
          />
          <label htmlFor="weeklyUpdates">Email me weekly product updates</label>
        </div>

        <div className="settings-form-actions">
          <button type="submit" className="settings-form-button settings-form-save">
            Save
          </button>
          <button
            type="button"
            className="settings-form-button settings-form-reset"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

export default SettingsForm
