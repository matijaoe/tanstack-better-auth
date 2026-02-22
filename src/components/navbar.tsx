import { Link, useRouteContext } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { authClient } from '#/lib/auth-client'

export function Navbar() {
  const { isAuthenticated } = useRouteContext({ from: '__root__' })
  const { data: session } = authClient.useSession()

  const handleSignOut = async () => {
    await authClient.signOut()
    window.location.reload()
  }

  return (
    <header className="border-border bg-card border-b">
      <div className="container mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link to="/" className="text-foreground text-lg font-semibold">
          Passkey Auth
        </Link>
        <nav className="flex items-center gap-3">
          {isAuthenticated && session?.user ? (
            <>
              <span className="text-muted-foreground text-sm">
                {((session.user as Record<string, unknown>).username as string) ??
                  session.user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
