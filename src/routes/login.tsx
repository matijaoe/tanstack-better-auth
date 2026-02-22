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
import { usePasskeyLogin } from '#/hooks/use-passkey-login'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: '/profile' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const { login, isPending, error } = usePasskeyLogin()

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-md">
        <div className="card-chrome">
          <span className="card-chrome__dot card-chrome__dot--red" aria-hidden="true" />
          <span className="card-chrome__dot card-chrome__dot--yellow" aria-hidden="true" />
          <span className="card-chrome__dot card-chrome__dot--green" aria-hidden="true" />
        </div>
        <Card className="w-full border-t-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in with your passkey to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="border-destructive/50 bg-destructive/10 text-destructive-foreground border p-3 text-sm">
                {error}
              </div>
            )}
            <Button onClick={login} disabled={isPending} className="w-full" size="lg">
              {isPending ? 'Authenticating...' : 'Sign in with passkey'}
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
    </div>
  )
}
