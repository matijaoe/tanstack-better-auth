# Refactor hooks to TanStack Query

## Context

All hooks use manual `useState`/`useEffect`/`useCallback` for async operations, despite TanStack Query v5 being installed. This violates the project convention of using the data-fetching library's built-in state instead of manual boolean flags. The `@convex-dev/react-query` integration does NOT block regular TanStack Query usage — both `queryFn()` and `hashFn()` fall through gracefully for non-Convex query keys when an explicit `queryFn` is provided per-query.

## Changes

### 1. New file: `src/hooks/use-debounced-value.ts`
Generic `useDebouncedValue<T>(value, delay)` hook. Replaces the inline `setTimeout`/`clearTimeout` pattern in `usePasskeyRegister`.

### 2. Refactor `src/hooks/use-logout.ts`
- Replace `useCallback` with `useMutation`
- `mutationFn`: `authClient.signOut()`
- `onSuccess`: `router.invalidate()` then `navigate({ to: '/login' })`
- Return `() => mutate()` (same shape as current)

### 3. Refactor `src/hooks/use-passkey-login.ts`
- Replace `useState` + `useCallback` with `useMutation`
- `mutationFn`: `authClient.signIn.passkey()`, throws on error result or WebAuthn cancel
- `onSuccess`: navigate to `/profile`
- Return `{ login, isPending, error }` (same shape)

### 4. Refactor `src/hooks/use-passkeys.ts`
- `useQuery` for `authClient.passkey.listUserPasskeys()` with key `['passkeys']`
- `useMutation` x3 for add/rename/remove, each calling `invalidateQueries` on success
- Add mutation swallows errors silently (WebAuthn cancel)
- Derive single `error` string from whichever mutation/query failed
- Return `{ passkeys, isLoading, isAdding, error, add, rename, remove }` (same shape)

### 5. Refactor `src/hooks/use-passkey-register.ts`
- `useState` for `username` (form input, stays local)
- `useDebouncedValue(username, 300)` replaces manual timeout
- `useQuery` with `enabled: debouncedUsername.length >= 3` for availability check
- Derive `usernameStatus` from query state + debounce lag (`username !== debouncedUsername` → `'checking'`)
- `useMutation` for the multi-step register flow (signUp + addPasskey)
- Return `{ username, setUsername, usernameStatus, isPending, error, canSubmit, register }` (same shape)

## No changes needed
- `src/router.tsx` — Convex defaults fall through for explicit `queryFn`
- `src/components/passkey-manager.tsx` — hook return shape unchanged
- `src/routes/login.tsx` — hook return shape unchanged
- `src/routes/register.tsx` — hook return shape unchanged
- `src/components/navbar.tsx` — hook return shape unchanged

## Verification
1. `pnpm build` — type-check passes
2. Manual test: login, register, add/rename/delete passkey, logout
