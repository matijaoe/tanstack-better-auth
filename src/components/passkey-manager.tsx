import { useState, useEffect, useCallback } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '#/components/ui/alert-dialog'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Skeleton } from '#/components/ui/skeleton'
import { authClient } from '#/lib/auth-client'

type Passkey = {
  id: string
  name?: string | null
  createdAt: Date
}

export function PasskeyManager() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const fetchPasskeys = useCallback(async () => {
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
    fetchPasskeys()
  }, [fetchPasskeys])

  const handleAdd = async () => {
    setIsAdding(true)
    try {
      await authClient.passkey.addPasskey({ name: 'New passkey' })
      await fetchPasskeys()
    } catch {
      // user cancelled or error
    } finally {
      setIsAdding(false)
    }
  }

  const handleRename = async (id: string) => {
    if (!editName.trim()) return
    try {
      await authClient.passkey.updatePasskey({ id, name: editName.trim() })
      await fetchPasskeys()
    } catch {
      // ignore
    } finally {
      setEditingId(null)
      setEditName('')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await authClient.passkey.deletePasskey({ id })
      await fetchPasskeys()
    } catch {
      // ignore
    }
  }

  const startEditing = (passkey: Passkey) => {
    setEditingId(passkey.id)
    setEditName(passkey.name ?? '')
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  const isLastPasskey = passkeys.length === 1

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Passkeys</CardTitle>
          <CardDescription>Manage your passkeys for authentication</CardDescription>
        </div>
        <Button onClick={handleAdd} disabled={isAdding} size="sm">
          {isAdding ? 'Adding...' : 'Add passkey'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {passkeys.length === 0 && (
          <p className="text-muted-foreground py-4 text-center text-sm">
            No passkeys registered. Add one to secure your account.
          </p>
        )}
        {passkeys.map((passkey) => (
          <div
            key={passkey.id}
            className="border-border flex items-center justify-between rounded-lg border p-4"
          >
            <div className="min-w-0 flex-1">
              {editingId === passkey.id ? (
                <Input
                  value={editName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
                  onBlur={() => handleRename(passkey.id)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') handleRename(passkey.id)
                    if (e.key === 'Escape') {
                      setEditingId(null)
                      setEditName('')
                    }
                  }}
                  className="h-8"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => startEditing(passkey)}
                  className="text-left text-sm font-medium underline-offset-4 hover:underline"
                >
                  {passkey.name ?? 'Unnamed passkey'}
                </button>
              )}
              <p className="text-muted-foreground mt-1 text-xs">
                Added {new Date(passkey.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="ml-4">
              {isLastPasskey ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive-foreground">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete last passkey?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This is your only passkey. Deleting it will make your account inaccessible.
                        You won&apos;t be able to sign in again.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(passkey.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete anyway
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive-foreground">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete passkey?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{passkey.name ?? 'Unnamed passkey'}
                        &quot;? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(passkey.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
