import { useNavigate } from '@tanstack/react-router'
import { useCallback, useState } from 'react'

import { authClient } from '#/lib/auth-client'

export function usePasskeyLogin() {
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async () => {
    setError(null)
    setIsPending(true)
    try {
      const result = await authClient.signIn.passkey()
      if (result?.error) {
        setError(result.error.message ?? 'Passkey authentication failed.')
        setIsPending(false)
      } else {
        navigate({ to: '/profile' })
      }
    } catch {
      setError('Passkey authentication was cancelled or failed.')
      setIsPending(false)
    }
  }, [navigate])

  return { login, isPending, error } as const
}
