import { createFileRoute } from '@tanstack/react-router'

import { PasskeyManager } from '#/components/passkey-manager'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { Skeleton } from '#/components/ui/skeleton'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/_authed/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-40" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const user = session?.user

  return (
    <div className="space-y-6">
      <div className="border-border border-b pb-4">
        <h1 className="font-mono text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Profile
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Username</span>
            <span className="font-medium">
              {(user as { username?: string })?.username ?? user?.name ?? 'Unknown'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account created</span>
            <span className="font-medium">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
            </span>
          </div>
        </CardContent>
      </Card>

      <PasskeyManager />
    </div>
  )
}
