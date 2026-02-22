import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { authClient } from '#/lib/auth-client'

export function usePasskeyLogin() {
  const navigate = useNavigate()

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      const result = await authClient.signIn.passkey()
      if (result?.error) {
        throw new Error(result.error.message ?? 'Passkey authentication failed.')
      }
    },
    onSuccess: () => navigate({ to: '/profile' }),
  })

  return {
    login: () => mutate(),
    isPending,
    error: error?.message ?? null,
  } as const
}
