import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import type { ConvexQueryClient } from '@convex-dev/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { Navbar } from '#/components/navbar'
import { authClient } from '#/lib/auth-client'
import { getToken } from '#/lib/auth.server'

import appCss from '../styles.css?url'

const getAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const token = await getToken()
  return { token: token ?? null }
})

type RouterContext = {
  queryClient: QueryClient
  convexQueryClient: ConvexQueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Passkey' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  beforeLoad: async ({ context }) => {
    const { token } = await getAuth()
    if (token && context.convexQueryClient.serverHttpClient) {
      context.convexQueryClient.serverHttpClient.setAuth(token)
    }
    return { isAuthenticated: !!token, token }
  },
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  const { token, convexQueryClient } = Route.useRouteContext()
  return (
    <ConvexBetterAuthProvider
      client={convexQueryClient.convexClient}
      authClient={authClient}
      initialToken={token}
    >
      <div className="page-grid-bg text-foreground min-h-screen">
        <Navbar />
        <main className="container mx-auto max-w-2xl px-4 py-12">
          <div className="crosshair-container">
            <span className="corner-marker corner-marker--tl" aria-hidden="true" />
            <span className="corner-marker corner-marker--tr" aria-hidden="true" />
            <span className="corner-marker corner-marker--bl" aria-hidden="true" />
            <span className="corner-marker corner-marker--br" aria-hidden="true" />
            <Outlet />
          </div>
        </main>
      </div>
    </ConvexBetterAuthProvider>
  )
}
