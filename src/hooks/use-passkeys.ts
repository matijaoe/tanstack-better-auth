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
    try {
      await authClient.passkey.addPasskey({ name: 'New passkey' })
      await refetch()
    } catch {
      // user cancelled or error
    } finally {
      setIsAdding(false)
    }
  }, [refetch])

  const rename = useCallback(
    async (id: string, name: string) => {
      if (!name.trim()) return
      try {
        await authClient.passkey.updatePasskey({ id, name: name.trim() })
        await refetch()
      } catch {
        // ignore
      }
    },
    [refetch],
  )

  const remove = useCallback(
    async (id: string) => {
      try {
        await authClient.passkey.deletePasskey({ id })
        await refetch()
      } catch {
        // ignore
      }
    },
    [refetch],
  )

  return { passkeys, isLoading, isAdding, add, rename, remove } as const
}
