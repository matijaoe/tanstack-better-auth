import { useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'

import { authClient } from '#/lib/auth-client'

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken'

export function usePasskeyRegister() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle')
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (username.length < 3) {
      setUsernameStatus('idle')
      return
    }

    setUsernameStatus('checking')
    const timeout = setTimeout(async () => {
      try {
        const result = await authClient.isUsernameAvailable({ username })
        setUsernameStatus(result.data?.available ? 'available' : 'taken')
      } catch {
        setUsernameStatus('idle')
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [username])

  const canSubmit = usernameStatus === 'available' && !isPending

  const register = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!canSubmit) return

      setError(null)
      setIsPending(true)

      try {
        const email = `${username}@passkey.internal`
        const password = crypto.randomUUID()

        const signUpResult = await authClient.signUp.email({
          email,
          password,
          name: username,
          username,
        })

        if (signUpResult.error) {
          setError(signUpResult.error.message ?? 'Registration failed.')
          return
        }

        await authClient.passkey.addPasskey({ name: 'My first passkey' })
        navigate({ to: '/profile' })
      } catch {
        setError('Registration failed. Please try again.')
      } finally {
        setIsPending(false)
      }
    },
    [canSubmit, username, navigate],
  )

  return { username, setUsername, usernameStatus, isPending, error, canSubmit, register } as const
}
