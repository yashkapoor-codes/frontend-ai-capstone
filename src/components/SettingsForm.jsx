import { useState } from 'react'
import './SettingsForm.css'

const INITIAL_VALUES = {
  displayName: '',
  email: '',
  username: '',
  bio: '',
  notifications: true,
}

const VALIDATORS = {
  displayName: (value) => {
    const trimmed = value.trim()
    if (!trimmed) return 'Display name is required'
    if (trimmed.length < 2) return 'Display name must be at least 2 characters'
    if (trimmed.length > 50) return 'Display name must be 50 characters or fewer'
    return ''
  },
  email: (value) => {
    const trimmed = value.trim()
    if (!trimmed) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Enter a valid email address'
    return ''
  },
  username: (value) => {
    const trimmed = value.trim()
    if (!trimmed) return 'Username is required'
    if (trimmed.length < 3) return 'Username must be at least 3 characters'
    if (trimmed.length > 20) return 'Username must be 20 characters or fewer'
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      return 'Username can only contain letters, numbers, and underscores'
    }
    return ''
  },
  bio: (value) => {
    if (value.length > 200) return 'Bio must be 200 characters or fewer'
    return ''
  },
}

function validateForm(values) {
  return Object.keys(VALIDATORS).reduce((errors, field) => {
    const message = VALIDATORS[field](values[field])
    if (message) errors[field] = message
    return errors
  }, {})
}

function SettingsForm() {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [savedSettings, setSavedSettings] = useState(null)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : value

    setValues((current) => ({ ...current, [name]: nextValue }))

    if (touched[name]) {
      const message = VALIDATORS[name]?.(nextValue) ?? ''
      setErrors((current) => ({ ...current, [name]: message }))
    }
  }

  const handleBlur = (event) => {
    const { name, value, type, checked } = event.target
    const fieldValue = type === 'checkbox' ? checked : value

    setTouched((current) => ({ ...current, [name]: true }))
    const message = VALIDATORS[name]?.(fieldValue) ?? ''
    setErrors((current) => ({ ...current, [name]: message }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)

    const nextErrors = validateForm(values)
    setErrors(nextErrors)
    setTouched({
      displayName: true,
      email: true,
      username: true,
      bio: true,
    })

    if (Object.keys(nextErrors).length > 0) return

    setSavedSettings({
      ...values,
      displayName: values.displayName.trim(),
      email: values.email.trim(),
      username: values.username.trim(),
    })
  }

  const handleReset = () => {
    setValues(INITIAL_VALUES)
    setErrors({})
    setTouched({})
    setSubmitted(false)
    setSavedSettings(null)
  }

  const showError = (field) => (touched[field] || submitted) && errors[field]

  return (
    <section id="settings" className="settings">
      <div className="settings-header">
        <h2>Settings</h2>
        <p>Update your profile and notification preferences.</p>
      </div>

      <form className="settings-form" onSubmit={handleSubmit} noValidate>
        <div className={`field ${showError('displayName') ? 'field-error' : ''}`}>
          <label htmlFor="displayName">Display name</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            value={values.displayName}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(showError('displayName'))}
            aria-describedby={showError('displayName') ? 'displayName-error' : undefined}
            autoComplete="name"
            placeholder="Jane Doe"
          />
          {showError('displayName') && (
            <span id="displayName-error" className="error-message" role="alert">
              {errors.displayName}
            </span>
          )}
        </div>

        <div className={`field ${showError('email') ? 'field-error' : ''}`}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(showError('email'))}
            aria-describedby={showError('email') ? 'email-error' : undefined}
            autoComplete="email"
            placeholder="jane@example.com"
          />
          {showError('email') && (
            <span id="email-error" className="error-message" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className={`field ${showError('username') ? 'field-error' : ''}`}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(showError('username'))}
            aria-describedby={showError('username') ? 'username-error' : undefined}
            autoComplete="username"
            placeholder="jane_doe"
          />
          {showError('username') && (
            <span id="username-error" className="error-message" role="alert">
              {errors.username}
            </span>
          )}
        </div>

        <div className={`field ${showError('bio') ? 'field-error' : ''}`}>
          <label htmlFor="bio">
            Bio <span className="optional">(optional)</span>
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={values.bio}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(showError('bio'))}
            aria-describedby={showError('bio') ? 'bio-error' : 'bio-hint'}
            placeholder="Tell us a little about yourself"
          />
          <span id="bio-hint" className="field-hint">
            {values.bio.length}/200 characters
          </span>
          {showError('bio') && (
            <span id="bio-error" className="error-message" role="alert">
              {errors.bio}
            </span>
          )}
        </div>

        <div className="field field-checkbox">
          <label htmlFor="notifications" className="checkbox-label">
            <input
              id="notifications"
              name="notifications"
              type="checkbox"
              checked={values.notifications}
              onChange={handleChange}
            />
            Email me weekly product updates
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save settings
          </button>
          <button type="button" className="btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>

        {savedSettings && (
          <output className="success-message" aria-live="polite">
            Settings saved for <strong>{savedSettings.displayName}</strong> (
            {savedSettings.email})
          </output>
        )}
      </form>
    </section>
  )
}

export default SettingsForm
