# TanStack + Better Auth — Passkey Demo

A demo app showcasing passwordless authentication with passkeys, built on a modern full-stack TypeScript setup.

<img width="3010" height="1754" src="https://github.com/user-attachments/assets/ba0b0308-5ad5-422c-be90-2ae8a30103da" />

## Stack

- **[TanStack Start](https://tanstack.com/start)** — full-stack React framework with SSR and file-based routing
- **[Convex](https://convex.dev)** — reactive backend with real-time database and serverless functions
- **[Better Auth](https://better-auth.com)** — TypeScript auth library with passkey support via WebAuthn
- **[Tailwind CSS v4](https://tailwindcss.com)** — utility-first styling
- **[shadcn/ui](https://ui.shadcn.com)** — accessible component primitives built on Radix UI

## Features

- Register and sign in with a passkey (WebAuthn / FIDO2) — no password required
- Email + password auth as a fallback
- Session management via Better Auth running on Convex HTTP actions
- Fully type-safe from database to UI

## Getting started

See [SETUP.md](./SETUP.md) for local development and production deployment instructions.

```bash
pnpm install
npx convex dev   # start Convex dev server
pnpm dev         # start the app on http://localhost:3000
```
