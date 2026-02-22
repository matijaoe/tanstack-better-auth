import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { authClient } from '#/lib/auth-client'

export type Passkey = {
  id: string
  name?: string | null
  createdAt: Date
}

export function usePasskeys() {
  const queryClient = useQueryClient()

  const passkeysQuery = useQuery({
    queryKey: ['passkeys'],
    queryFn: async () => {
      const result = await authClient.passkey.listUserPasskeys()
      return (result.data ?? []) as Passkey[]
    },
  })

  const invalidatePasskeys = () =>
    queryClient.invalidateQueries({ queryKey: ['passkeys'] })

  const addMutation = useMutation({
    mutationFn: () => authClient.passkey.addPasskey({ name: 'New passkey' }),
    onSuccess: invalidatePasskeys,
  })

  const renameMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => {
      if (!name.trim()) return Promise.resolve()
      return authClient.passkey.updatePasskey({ id, name: name.trim() })
    },
    onSuccess: invalidatePasskeys,
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => authClient.passkey.deletePasskey({ id }),
    onSuccess: invalidatePasskeys,
  })

  const error =
    renameMutation.error?.message ??
    removeMutation.error?.message ??
    (passkeysQuery.error ? 'Failed to load passkeys.' : null)

  return {
    passkeys: passkeysQuery.data ?? [],
    isLoading: passkeysQuery.isLoading,
    isAdding: addMutation.isPending,
    error,
    add: () => addMutation.mutate(),
    rename: (id: string, name: string) => renameMutation.mutate({ id, name }),
    remove: (id: string) => removeMutation.mutate(id),
  }
}
