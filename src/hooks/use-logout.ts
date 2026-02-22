import { useNavigate, useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'

import { authClient } from '#/lib/auth-client'

export function useLogout() {
  const router = useRouter()
  const navigate = useNavigate()

  return useCallback(async () => {
    await authClient.signOut()
    await router.invalidate()
    navigate({ to: '/login' })
  }, [router, navigate])
}
