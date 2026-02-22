import { useCallback, useEffect, useState } from 'react'

import { authClient } from '#/lib/auth-client'

export type Passkey = {
  id: string
  name?: string | null
  createdAt: Date
}

export function usePasskeys() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    try {
      const result = await authClient.passkey.listUserPasskeys()
      if (result.data) {
        setPasskeys(result.data)
      }
    } catch {
      // ignore fetch errors
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const add = useCallback(async () => {
    setIsAdding(true)
    setError(null)
    try {
      await authClient.passkey.addPasskey({ name: 'New passkey' })
      await refetch()
    } catch {
      // user cancelled the WebAuthn dialog — not an error worth surfacing
    } finally {
      setIsAdding(false)
    }
  }, [refetch])

  const rename = useCallback(
    async (id: string, name: string) => {
      if (!name.trim()) return
      setError(null)
      try {
        await authClient.passkey.updatePasskey({ id, name: name.trim() })
        await refetch()
      } catch {
        setError('Failed to rename passkey.')
      }
    },
    [refetch],
  )

  const remove = useCallback(
    async (id: string) => {
      setError(null)
      try {
        await authClient.passkey.deletePasskey({ id })
        await refetch()
      } catch {
        setError('Failed to delete passkey.')
      }
    },
    [refetch],
  )

  return { passkeys, isLoading, isAdding, error, add, rename, remove } as const
}
