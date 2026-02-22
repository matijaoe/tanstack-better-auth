import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { type FormEvent, useState } from 'react'

import { authClient } from '#/lib/auth-client'

import { useDebouncedValue } from './use-debounced-value'

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'error'

export function usePasskeyRegister() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const debouncedUsername = useDebouncedValue(username, 300)

  const availabilityQuery = useQuery({
    queryKey: ['username-availability', debouncedUsername],
    queryFn: async () => {
      const result = await authClient.isUsernameAvailable({
        username: debouncedUsername,
      })
      return result.data?.available ?? false
    },
    enabled: debouncedUsername.length >= 3,
  })

  function getUsernameStatus(): UsernameStatus {
    if (username.length < 3) {
      return 'idle'
    }
    if (username !== debouncedUsername || availabilityQuery.isFetching) {
      return 'checking'
    }
    if (availabilityQuery.isError) {
      return 'error'
    }
    return availabilityQuery.data ? 'available' : 'taken'
  }

  const usernameStatus = getUsernameStatus()

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      // TODO: not great. use actual email + password in the future, or wait for passkey supported not requiring these fields
      const email = `${username}@passkey.internal`
      const password = crypto.randomUUID()

      const signUpResult = await authClient.signUp.email({
        email,
        password,
        name: username,
        username,
      })

      if (signUpResult.error) {
        throw new Error(signUpResult.error.message ?? 'Registration failed.')
      }

      try {
        await authClient.passkey.addPasskey({ name: 'My first passkey' })
      } catch {
        navigate({ to: '/profile' })
        throw new Error(
          'Account created but passkey setup failed. Try adding a passkey from your profile.',
        )
      }
    },
    onSuccess: () => navigate({ to: '/profile' }),
  })

  const canSubmit = usernameStatus === 'available' && !isPending

  return {
    username,
    setUsername,
    usernameStatus,
    isPending,
    error: error?.message ?? null,
    canSubmit,
    register: (e: FormEvent) => {
      e.preventDefault()
      if (!canSubmit) return
      mutate()
    },
  }
}
