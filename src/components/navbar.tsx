import { Link, useRouteContext } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { useLogout } from '#/hooks/use-logout'
import { authClient } from '#/lib/auth-client'

export function Navbar() {
  const { isAuthenticated } = useRouteContext({ from: '__root__' })
  const { data: session } = authClient.useSession()
  const logout = useLogout()

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
                {(session.user as { username?: string }).username ?? session.user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
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
