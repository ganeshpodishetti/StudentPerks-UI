import { useAuth } from '@/features/auth/contexts/AuthContext'
import { authService } from '@/features/auth/services/authService'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React, { useState } from 'react'
import { AuthProvider } from '../AuthContext'

jest.mock('@/features/auth/services/authService', () => ({
  authService: {
    getUserProfile: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  },
}))

const mockedAuthService = authService as jest.Mocked<typeof authService>

const Probe = () => {
  const { isAuthenticated, login } = useAuth()
  const [error, setError] = useState('')

  return (
    <div>
      <span data-testid="auth-state">{isAuthenticated ? 'authenticated' : 'anonymous'}</span>
      <button
        onClick={async () => {
          try {
            await login('student@example.com', 'Password123')
            setError('')
          } catch (err: unknown) {
            setError((err as Error)?.message ?? 'unknown')
          }
        }}
      >
        login
      </button>
      <span data-testid="error-state">{error}</span>
    </div>
  )
}

describe('AuthContext login flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('marks user authenticated after login when profile resolves', async () => {
    mockedAuthService.getUserProfile
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        username: 'student',
        email: 'student@example.com',
        emailConfirmed: true,
        roles: ['User'],
      })
    mockedAuthService.login.mockResolvedValue({ message: 'ok' })

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('anonymous')
    })

    fireEvent.click(screen.getByRole('button', { name: 'login' }))

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('authenticated')
    })
    expect(screen.getByTestId('error-state')).toHaveTextContent('')
  })

  it('rejects login when profile is still null after successful login call', async () => {
    mockedAuthService.getUserProfile.mockResolvedValue(null)
    mockedAuthService.login.mockResolvedValue({ message: 'ok' })

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('anonymous')
    })

    fireEvent.click(screen.getByRole('button', { name: 'login' }))

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toHaveTextContent(
        'Unable to establish an authenticated session. Please try again.',
      )
    })
    expect(screen.getByTestId('auth-state')).toHaveTextContent('anonymous')
  })
})


