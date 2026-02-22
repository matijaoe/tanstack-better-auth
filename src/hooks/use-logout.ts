import { useMutation } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'

import { authClient } from '#/lib/auth-client'

export function useLogout() {
  const router = useRouter()
  const navigate = useNavigate()

  const { mutate } = useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: async () => {
      await router.invalidate()
      navigate({ to: '/login' })
    },
  })

  return () => mutate()
}
