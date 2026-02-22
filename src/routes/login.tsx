import { createFileRoute, redirect, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: '/profile' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePasskeySignIn = async () => {
    setError(null)
    setIsLoading(true)
    try {
      const result = await authClient.signIn.passkey()
      if (result?.error) {
        setError(result.error.message ?? 'Passkey authentication failed.')
      } else {
        navigate({ to: '/profile' })
      }
    } catch {
      setError('Passkey authentication was cancelled or failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in with your passkey to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="border-destructive/50 bg-destructive/10 text-destructive-foreground rounded-lg border p-3 text-sm">
              {error}
            </div>
          )}
          <Button onClick={handlePasskeySignIn} disabled={isLoading} className="w-full" size="lg">
            {isLoading ? 'Authenticating...' : 'Sign in with Passkey'}
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-muted-foreground text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary underline-offset-4 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
