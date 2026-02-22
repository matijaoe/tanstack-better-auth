# TanStack + Better Auth — Passkey Demo

A demo app showcasing passwordless authentication with passkeys, built on a modern full-stack TypeScript setup.

<img width="3024" height="1768" src="https://github.com/user-attachments/assets/2cb8701d-d987-499f-8f16-427ffa46528c" />

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
