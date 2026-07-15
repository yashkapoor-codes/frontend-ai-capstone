import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import SettingsForm from './SettingsForm'

const STORAGE_KEY = 'frontend-ai-capstone-settings'

function fillValidForm(user) {
  return user.type(screen.getByLabelText(/display name/i), 'Jane Doe')
    .then(() => user.type(screen.getByLabelText(/^email$/i), 'jane@example.com'))
    .then(() => user.type(screen.getByLabelText(/^username$/i), 'jane_doe'))
}

beforeEach(() => {
  localStorage.clear()
})

describe('SettingsForm', () => {
  it('shows an error for an invalid email and no success message', async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await fillValidForm(user)
    await user.clear(screen.getByLabelText(/^email$/i))
    await user.type(screen.getByLabelText(/^email$/i), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      /valid email address/i,
    )
    expect(screen.queryByText(/settings saved successfully/i)).not.toBeInTheDocument()
  })

  it('shows an error for an invalid username', async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await user.type(screen.getByLabelText(/display name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/^email$/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/^username$/i), 'bad-user')
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/letters, numbers, and underscores/i)
    expect(screen.queryByText(/settings saved successfully/i)).not.toBeInTheDocument()
  })

  it('saves valid settings to localStorage and shows a success message', async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await fillValidForm(user)
    await user.click(screen.getByLabelText(/email me weekly product updates/i))
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    expect(screen.getByText(/settings saved successfully/i)).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual({
      displayName: 'Jane Doe',
      email: 'jane@example.com',
      username: 'jane_doe',
      bio: '',
      weeklyUpdates: true,
    })
  })

  it('reloads saved settings from localStorage', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        displayName: 'Alex Kim',
        email: 'alex@example.com',
        username: 'alex_k',
        bio: 'Builder',
        weeklyUpdates: false,
      }),
    )

    render(<SettingsForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/display name/i)).toHaveValue('Alex Kim')
    })
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('alex@example.com')
    expect(screen.getByLabelText(/^username$/i)).toHaveValue('alex_k')
    expect(screen.getByLabelText(/^bio$/i)).toHaveValue('Builder')
    expect(screen.getByLabelText(/email me weekly product updates/i)).not.toBeChecked()
  })

  it('reset clears the form, success message, and saved localStorage data', async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await fillValidForm(user)
    await user.type(screen.getByLabelText(/^bio$/i), 'Hello world')
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    expect(screen.getByText(/settings saved successfully/i)).toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()

    await user.click(screen.getByRole('button', { name: /^reset$/i }))

    expect(screen.getByLabelText(/display name/i)).toHaveValue('')
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('')
    expect(screen.getByLabelText(/^username$/i)).toHaveValue('')
    expect(screen.getByLabelText(/^bio$/i)).toHaveValue('')
    expect(screen.getByLabelText(/email me weekly product updates/i)).not.toBeChecked()
    expect(screen.queryByText(/settings saved successfully/i)).not.toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
