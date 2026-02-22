import { Link, useRouteContext } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { useLogout } from '#/hooks/use-logout'
import { authClient } from '#/lib/auth-client'

function FingerprintLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M 10 20 Q 10 13 14 13 Q 18 13 18 20"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 7 21 Q 7 10 14 10 Q 21 10 21 21"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 4 22 Q 4 7 14 7 Q 24 7 24 22"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 2 24 Q 1.5 4 14 4 Q 26.5 4 26 24"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        strokeDasharray="3 2" />
      <circle cx="14" cy="20" r="1.5" fill="currentColor" />
    </svg>
  )
}

export function Navbar() {
  const { isAuthenticated } = useRouteContext({ from: '__root__' })
  const { data: session } = authClient.useSession()
  const logout = useLogout()

  return (
    <header className="border-border bg-card border-b">
      <div className="flex h-14 w-full items-center justify-between px-8">
        <Link to="/" className="flex items-center gap-2.5 text-foreground">
          <span className="text-primary"><FingerprintLogo /></span>
          <span className="font-mono text-sm font-semibold tracking-widest uppercase">Passkey</span>
        </Link>
        <nav className="flex items-center gap-3">
          {isAuthenticated && session?.user ? (
            <>
              <span className="text-muted-foreground font-mono text-xs">
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
