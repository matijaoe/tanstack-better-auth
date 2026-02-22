import { createFileRoute, redirect, Link } from '@tanstack/react-router'

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
import { usePasskeyRegister } from '#/hooks/use-passkey-register'

export const Route = createFileRoute('/register')({
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: '/profile' })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const { username, setUsername, usernameStatus, isPending, error, canSubmit, register } =
    usePasskeyRegister()

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Choose a username and set up your passkey</CardDescription>
        </CardHeader>
        <form onSubmit={register}>
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
                disabled={isPending}
                autoComplete="username"
              />
              {username.length > 0 && username.length < 3 && (
                <p className="text-muted-foreground text-xs">
                  Username must be at least 3 characters
                </p>
              )}
              {usernameStatus === 'checking' && (
                <p className="text-muted-foreground text-xs">Checking availability...</p>
              )}
              {usernameStatus === 'available' && (
                <p className="text-xs text-green-500">Username is available</p>
              )}
              {usernameStatus === 'taken' && (
                <p className="text-destructive-foreground text-xs">Username is taken</p>
              )}
            </div>
            <Button type="submit" disabled={!canSubmit} className="w-full" size="lg">
              {isPending ? 'Setting up...' : 'Register with Passkey'}
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
