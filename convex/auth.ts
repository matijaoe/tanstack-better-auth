import { passkey } from '@better-auth/passkey'
import { createClient, convexAdapter } from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { betterAuth } from 'better-auth/minimal'
import { username } from 'better-auth/plugins/username'

import { components } from './_generated/api'
import type { DataModel } from './_generated/dataModel'
import authConfig from './auth.config'

export const authComponent = createClient<DataModel>(components.betterAuth)

export const { getAuthUser } = authComponent.clientApi()

export const createAuth = (ctx: Parameters<typeof convexAdapter>[0]) => {
  return betterAuth({
    database: convexAdapter(ctx, components.betterAuth),
    baseURL: process.env.SITE_URL ?? 'http://localhost:3000',
    trustedOrigins: [process.env.SITE_URL ?? 'http://localhost:3000'],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      convex({ authConfig }),
      passkey({
        rpID: process.env.RP_ID ?? 'localhost',
        rpName: 'Passkey Auth App',
        origin: process.env.SITE_URL ?? 'http://localhost:3000',
      }),
      username({
        minUsernameLength: 2,
        maxUsernameLength: 30,
      }),
    ],
  })
}
