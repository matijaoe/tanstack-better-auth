# Redesign: brutalist dark aesthetic

## Context

The current UI is generic ShadCN defaults — grey-ish dark background, rounded corners, blue primary accent, system sans-serif font, no visual character. The goal is a complete visual overhaul inspired by better-auth.com: near-black background with a dot-grid, amber/orange primary palette, zero-radius brutalist shapes, monospace typography, a fingerprint SVG logo (fitting for passkey auth), crosshair corner markers on the content area, and terminal-chrome (traffic-light dots) above auth cards. Dark mode only — light mode removed entirely.

**Key technical rule:** Changes live in `styles.css` (CSS variables) and layout/page components (structural decoration). ShadCN UI files are not touched — everything cascades from tokens.

---

## Critical files

- `src/styles.css` — all design tokens, plus new utility classes
- `src/routes/__root.tsx` — dot grid class, crosshair container wrapping `<Outlet />`
- `src/components/navbar.tsx` — fingerprint SVG logo, full-width layout
- `src/routes/login.tsx` — terminal chrome wrapper above card
- `src/routes/register.tsx` — terminal chrome wrapper above card
- `src/routes/_authed/profile.tsx` — section heading, remove Separator

---

## Step 1 — `src/styles.css`

### 1a. Body — monospace font

```css
body {
  @apply m-0;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 1b. Design tokens — delete `.dark {}`, collapse everything into `:root`

Remove the entire `.dark {}` block. The app always has `<html className="dark">` — a single `:root` block is sufficient since there's no light mode.

New `:root` values (near-black warm background, amber/orange primary, 0px radius):

```css
:root {
  --background:             oklch(0.08 0.005 60);
  --foreground:             oklch(0.93 0.005 60);
  --card:                   oklch(0.11 0.006 60);
  --card-foreground:        oklch(0.93 0.005 60);
  --popover:                oklch(0.11 0.006 60);
  --popover-foreground:     oklch(0.93 0.005 60);
  --primary:                oklch(0.72 0.18 62);
  --primary-foreground:     oklch(0.08 0.005 60);
  --secondary:              oklch(0.16 0.008 60);
  --secondary-foreground:   oklch(0.93 0.005 60);
  --muted:                  oklch(0.13 0.006 60);
  --muted-foreground:       oklch(0.52 0.012 60);
  --accent:                 oklch(0.16 0.008 60);
  --accent-foreground:      oklch(0.93 0.005 60);
  --destructive:            oklch(0.45 0.18 25);
  --destructive-foreground: oklch(0.85 0.08 25);
  --border:                 oklch(0.22 0.008 60);
  --input:                  oklch(0.14 0.006 60);
  --ring:                   oklch(0.72 0.18 62);
  --radius:                 0px;
  --sidebar:                oklch(0.11 0.006 60);
  --sidebar-foreground:     oklch(0.93 0.005 60);
  --sidebar-primary:        oklch(0.72 0.18 62);
  --sidebar-primary-foreground: oklch(0.08 0.005 60);
  --sidebar-accent:         oklch(0.16 0.008 60);
  --sidebar-accent-foreground: oklch(0.93 0.005 60);
  --sidebar-border:         oklch(0.22 0.008 60);
  --sidebar-ring:           oklch(0.72 0.18 62);
}
```

### 1c. Fix radius in `@theme inline`

Replace the four existing radius lines:

```css
  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
  --radius-xl: 0px;
```

### 1d. Dot grid background utility

Add after `@layer base {}`:

```css
.page-grid-bg {
  background-color: var(--background);
  background-image: radial-gradient(
    circle,
    oklch(0.28 0.008 60 / 0.55) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
}
```

### 1e. Crosshair corner marker classes

```css
.crosshair-container {
  position: relative;
}

.corner-marker {
  position: absolute;
  width: 16px;
  height: 16px;
  pointer-events: none;
}

.corner-marker::before,
.corner-marker::after {
  content: '';
  position: absolute;
  background-color: var(--border);
}

.corner-marker::before {
  width: 1px;
  height: 100%;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}

.corner-marker::after {
  height: 1px;
  width: 100%;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

.corner-marker--tl { top: -8px;    left: -8px;  }
.corner-marker--tr { top: -8px;    right: -8px; }
.corner-marker--bl { bottom: -8px; left: -8px;  }
.corner-marker--br { bottom: -8px; right: -8px; }
```

### 1f. Terminal chrome classes

```css
.card-chrome {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-bottom: none;
}

.card-chrome__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.card-chrome__dot--red    { background-color: oklch(0.55 0.20 25); }
.card-chrome__dot--yellow { background-color: oklch(0.72 0.18 62); }
.card-chrome__dot--green  { background-color: oklch(0.65 0.16 145); }
```

---

## Step 2 — `src/routes/__root.tsx`

1. Change page title to `'Passkey'`
2. Replace `bg-background text-foreground min-h-screen` with `page-grid-bg text-foreground min-h-screen`
3. Wrap `<Outlet />` in crosshair container:

```tsx
<main className="container mx-auto max-w-2xl px-4 py-12">
  <div className="crosshair-container">
    <span className="corner-marker corner-marker--tl" aria-hidden="true" />
    <span className="corner-marker corner-marker--tr" aria-hidden="true" />
    <span className="corner-marker corner-marker--bl" aria-hidden="true" />
    <span className="corner-marker corner-marker--br" aria-hidden="true" />
    <Outlet />
  </div>
</main>
```

---

## Step 3 — `src/components/navbar.tsx`

Add a `FingerprintLogo` component above `Navbar`:

```tsx
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
```

Update `Navbar`:
- Remove `container mx-auto max-w-2xl` from inner div → use `w-full px-8`
- Replace brand `<Link>` content with logo + styled text
- Add `font-mono text-xs` to username span

```tsx
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
          <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
        </>
      ) : (
        <>
          <Button variant="ghost" size="sm" asChild><Link to="/login">Sign in</Link></Button>
          <Button size="sm" asChild><Link to="/register">Register</Link></Button>
        </>
      )}
    </nav>
  </div>
</header>
```

---

## Step 4 — `src/routes/login.tsx`

Remove `flex min-h-[60vh] items-center justify-center` centering div. Add terminal chrome:

```tsx
<div className="flex justify-center py-8">
  <div className="w-full max-w-md">
    <div className="card-chrome">
      <span className="card-chrome__dot card-chrome__dot--red" aria-hidden="true" />
      <span className="card-chrome__dot card-chrome__dot--yellow" aria-hidden="true" />
      <span className="card-chrome__dot card-chrome__dot--green" aria-hidden="true" />
    </div>
    <Card className="w-full border-t-0">
      {/* existing card content */}
    </Card>
  </div>
</div>
```

Copy: `'Sign in with Passkey'` → `'Sign in with passkey'`
Remove `rounded-lg` from error div (already 0px via token, but clean up the class).

---

## Step 5 — `src/routes/register.tsx`

Identical terminal chrome pattern as login.
Copy: `'Register with Passkey'` → `'Register with passkey'`, CardDescription → `'Choose a username and register your passkey'`
Remove `rounded-lg` from error div.

---

## Step 6 — `src/routes/_authed/profile.tsx`

Remove `<Separator />` import and usage.
Add section label above the cards and update copy:

```tsx
<div className="space-y-6">
  <div className="border-border border-b pb-4">
    <h1 className="font-mono text-xs font-semibold tracking-widest uppercase text-muted-foreground">
      Profile
    </h1>
  </div>
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Account</CardTitle>
      <CardDescription>Your account information</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      {/* existing rows */}
    </CardContent>
  </Card>
  <PasskeyManager />
</div>
```

---

## Implementation order

1. `styles.css` — tokens first; app looks broken briefly
2. `__root.tsx` — restores layout with grid + crosshairs
3. `navbar.tsx` — logo and layout
4. `login.tsx` + `register.tsx` — chrome wrappers (parallel)
5. `profile.tsx` — lowest risk, last

---

## Verification

After all changes:
- `pnpm dev` — app loads, dark brutalist palette visible
- Navigate to `/login` — terminal chrome dots above card, amber "Sign in with passkey" button, square corners, dot grid visible in background, crosshair `+` markers at content corners
- Navigate to `/register` — same chrome pattern, username validation text visible
- Log in → `/profile` — monospace section label, stacked cards, no separator, amber "Add passkey" button
- Navbar — fingerprint SVG logo in amber, uppercase "PASSKEY" brand, full-width
- No light mode flicker at any point (single `:root` block, always dark)
