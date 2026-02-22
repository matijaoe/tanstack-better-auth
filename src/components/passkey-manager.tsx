import { useState } from 'react'

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
import { usePasskeys, type Passkey } from '#/hooks/use-passkeys'

export function PasskeyManager() {
  const { passkeys, isLoading, isAdding, error, add, rename, remove } = usePasskeys()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const startEditing = (passkey: Passkey) => {
    setEditingId(passkey.id)
    setEditName(passkey.name ?? '')
  }

  const commitRename = async (id: string) => {
    await rename(id, editName)
    setEditingId(null)
    setEditName('')
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
        <Button onClick={add} disabled={isAdding} size="sm">
          {isAdding ? 'Adding...' : 'Add passkey'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <div className="border-destructive/50 bg-destructive/10 text-destructive-foreground rounded-lg border p-3 text-sm">
            {error}
          </div>
        )}
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
                  onBlur={() => commitRename(passkey.id)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') commitRename(passkey.id)
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-destructive-foreground">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {isLastPasskey ? 'Delete last passkey?' : 'Delete passkey?'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {isLastPasskey
                        ? "This is your only passkey. Deleting it will make your account inaccessible. You won't be able to sign in again."
                        : `Are you sure you want to delete "${passkey.name ?? 'Unnamed passkey'}"? This action cannot be undone.`}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => remove(passkey.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isLastPasskey ? 'Delete anyway' : 'Delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
