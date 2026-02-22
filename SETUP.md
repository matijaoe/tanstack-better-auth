# Setup & Deployment Guide

Environment configuration, local development setup, and production deployment for TanStack Start (Nitro) + Convex + Better Auth.

## Part 1: Initial Setup (local development)

### 1.1 Create a Convex project

```bash
npx convex dev
```

On first run, this creates a new Convex project and dev deployment. It outputs:

```
✔ Created project tanstack-better-auth
  CONVEX_DEPLOYMENT=dev:happy-otter-456
  VITE_CONVEX_URL=https://happy-otter-456.convex.cloud
```

It also writes a `.env.local` file with these values automatically.

### 1.2 Two types of environment variables

Environment variables live in two separate places and serve different purposes.

#### File-based env vars (`.env.local`)

These are read by Vite at build/dev time. They tell the **frontend** where to find Convex.

| Variable               | Example                                | Purpose                                                                                                                                                                                                  |
| ---------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CONVEX_DEPLOYMENT`    | `dev:happy-otter-456`                  | Identifies which Convex deployment to connect to. The `dev:` prefix means development.                                                                                                                   |
| `VITE_CONVEX_URL`      | `https://happy-otter-456.convex.cloud` | The Convex Cloud endpoint. The frontend sends queries, mutations, and subscriptions here. The `VITE_` prefix exposes it to client-side code.                                                             |
| `VITE_CONVEX_SITE_URL` | `https://happy-otter-456.convex.site`  | The Convex HTTP actions endpoint. Better Auth's client sends auth requests (login, register, session) to this URL. It uses a different subdomain from the cloud URL because HTTP actions run separately. |

`CONVEX_DEPLOYMENT` and `VITE_CONVEX_URL` come from the `npx convex dev` output. For `VITE_CONVEX_SITE_URL`, use the same deployment name but change `.convex.cloud` → `.convex.site`.

#### Server-side env vars (Convex CLI / dashboard)

These are **not stored in any file**. They live on Convex's servers and are available to Convex functions at runtime via `process.env`. Set them with the CLI:

```bash
npx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
npx convex env set SITE_URL "http://localhost:3000"
```

| Variable             | Example                   | Purpose                                                                                                                                                                                                                                                                                                                               |
| -------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BETTER_AUTH_SECRET` | _(random 32-byte string)_ | The secret key Better Auth uses to sign and verify session tokens. Generate with `openssl rand -base64 32`. Changing this invalidates all existing sessions.                                                                                                                                                                          |
| `SITE_URL`           | `http://localhost:3000`   | The app's URL. Better Auth uses it for CSRF protection, the `trustedOrigins` allowlist, and as the base URL for auth routes.                                                                                                                                                                                                          |
| `RP_ID`              | `localhost`               | **Relying Party ID** — a WebAuthn/passkey concept. When a user registers a passkey, the browser cryptographically locks it to this domain. During login, the browser only offers passkeys matching this domain. Defaults to `localhost` in dev (see `convex/auth.ts` fallback), so it only needs to be set explicitly for production. |

View current values anytime:

```bash
npx convex env list
```

### 1.3 Resulting `.env.local`

```bash
CONVEX_DEPLOYMENT=dev:happy-otter-456
VITE_CONVEX_URL=https://happy-otter-456.convex.cloud
VITE_CONVEX_SITE_URL=https://happy-otter-456.convex.site
```

Run `pnpm dev` and `npx convex dev` side by side, and the app works locally.

---

## Part 2: Production Deployment

### 2.1 Deploy Convex functions to production

```bash
npx convex deploy
```

This pushes functions, schema, and components to a production Convex deployment. Note the output:

```
Your prod deployment swift-falcon-789 serves traffic at:
  VITE_CONVEX_URL=https://swift-falcon-789.convex.cloud
```

Save the deployment name. The two production URLs are:

- **Cloud URL:** `https://swift-falcon-789.convex.cloud`
- **Site URL:** `https://swift-falcon-789.convex.site`

### 2.2 Link project to Vercel

```bash
vercel link --yes
```

Connects the project to Vercel and links the GitHub repo for automatic deploys on push.

### 2.3 Set Vercel environment variables

These are the production equivalents of `.env.local`. They tell the Vercel-hosted frontend how to reach the prod Convex deployment.

The value is piped via `echo`. The word `production` at the end is the Vercel environment scope — not the value.

```bash
echo "prod:swift-falcon-789" | vercel env add CONVEX_DEPLOYMENT production
echo "https://swift-falcon-789.convex.cloud" | vercel env add VITE_CONVEX_URL production
echo "https://swift-falcon-789.convex.site" | vercel env add VITE_CONVEX_SITE_URL production
```

Same variables as `.env.local`, but with `prod:` prefix on the deployment and pointing to the production URLs.

Verify:

```bash
vercel env ls production
```

### 2.4 Deploy frontend to Vercel

```bash
vercel --prod
```

Note the production URL from the output:

```
Aliased: https://your-app.vercel.app
```

### 2.5 Set Convex server-side env vars for production

With the production URL known, set the server-side vars on the prod Convex deployment. The `--prod` flag targets production instead of dev.

```bash
npx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)" --prod
npx convex env set SITE_URL "https://your-app.vercel.app" --prod
npx convex env set RP_ID "your-app.vercel.app" --prod
```

| Variable             | Local                   | Production                    | Why it differs                                   |
| -------------------- | ----------------------- | ----------------------------- | ------------------------------------------------ |
| `BETTER_AUTH_SECRET` | _(some secret)_         | _(different secret)_          | Each environment should have its own signing key |
| `SITE_URL`           | `http://localhost:3000` | `https://your-app.vercel.app` | Different domain                                 |
| `RP_ID`              | `localhost` (default)   | `your-app.vercel.app`         | Passkeys are domain-bound                        |

### 2.6 Redeploy frontend (if needed)

Only required if `VITE_` vars change after the first deploy (they are baked in at build time):

```bash
vercel --prod
```

---

## Summary

| Where                 | Variable               | Local (dev)                            | Production                              |
| --------------------- | ---------------------- | -------------------------------------- | --------------------------------------- |
| `.env.local` / Vercel | `CONVEX_DEPLOYMENT`    | `dev:happy-otter-456`                  | `prod:swift-falcon-789`                 |
| `.env.local` / Vercel | `VITE_CONVEX_URL`      | `https://happy-otter-456.convex.cloud` | `https://swift-falcon-789.convex.cloud` |
| `.env.local` / Vercel | `VITE_CONVEX_SITE_URL` | `https://happy-otter-456.convex.site`  | `https://swift-falcon-789.convex.site`  |
| Convex server         | `BETTER_AUTH_SECRET`   | _(generated)_                          | _(generated, different)_                |
| Convex server         | `SITE_URL`             | `http://localhost:3000`                | `https://your-app.vercel.app`           |
| Convex server         | `RP_ID`                | `localhost` (default)                  | `your-app.vercel.app`                   |

**File-based** vars (top 3) tell the frontend where Convex lives.
**Convex server** vars (bottom 3) tell Better Auth how to behave. They are never in any file — only on Convex's servers.

---

## Custom domain

To use a custom domain (e.g. `myapp.com`), update the Convex server vars:

```bash
npx convex env set SITE_URL "https://myapp.com" --prod
npx convex env set RP_ID "myapp.com" --prod
```

Passkeys are domain-bound — users who registered passkeys on the previous domain will need to register new ones.

## Automatic deploys

Pushes to `main` trigger production deploys on Vercel automatically (configured by `vercel link`). Convex functions must still be deployed separately with `npx convex deploy`.
