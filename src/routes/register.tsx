import { createFileRoute, redirect, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/register')({
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: '/profile' })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (username.length < 3) {
      setIsAvailable(null)
      return
    }

    const timeout = setTimeout(async () => {
      setIsCheckingAvailability(true)
      try {
        const result = await authClient.isUsernameAvailable({ username })
        setIsAvailable(result.data?.available ?? false)
      } catch {
        setIsAvailable(null)
      } finally {
        setIsCheckingAvailability(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [username])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAvailable || username.length < 3) return

    setError(null)
    setIsLoading(true)

    try {
      const email = `${username}@passkey.internal`
      const password = crypto.randomUUID()

      const signUpResult = await authClient.signUp.email({
        email,
        password,
        name: username,
        username,
      })

      if (signUpResult.error) {
        setError(signUpResult.error.message ?? 'Registration failed.')
        setIsLoading(false)
        return
      }

      await authClient.passkey.addPasskey({ name: 'My first passkey' })

      navigate({ to: '/profile' })
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Choose a username and set up your passkey</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && (
              <div className="border-destructive/50 bg-destructive/10 text-destructive-foreground rounded-lg border p-3 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Choose a username"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                disabled={isLoading}
                autoComplete="username"
              />
              {username.length > 0 && username.length < 3 && (
                <p className="text-muted-foreground text-xs">
                  Username must be at least 3 characters
                </p>
              )}
              {isCheckingAvailability && (
                <p className="text-muted-foreground text-xs">Checking availability...</p>
              )}
              {!isCheckingAvailability && isAvailable === true && (
                <p className="text-xs text-green-500">Username is available</p>
              )}
              {!isCheckingAvailability && isAvailable === false && (
                <p className="text-destructive-foreground text-xs">Username is taken</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading || !isAvailable || username.length < 3}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Setting up...' : 'Register with Passkey'}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="justify-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
