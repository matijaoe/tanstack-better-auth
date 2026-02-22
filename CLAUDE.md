This project uses Tanstack Start, Convex, Better Auth, Shadcn UI, BaseUI and Tailwind.
`pnpm` is the package manager.

Use Context7 MCP to get the latest documentation for the libraries.

## Code structure

Separate behavior from presentation. Extract business logic, async
operations, and state management into the framework's behavior primitive
(React hooks). Components render
and call handlers — they never contain API calls, async flows, cache
invalidation, or error transformation.

One behavior unit per feature or user action (e.g., useLogin,
useRegister, usePasskeys) — not one monolithic unit per domain. Place
them in a dedicated directory (`src/hooks/`).

Expose only what the consumer needs: observable state and trigger
functions. Keep implementation details, intermediate state, and retry
logic internal.

Use the data-fetching library's built-in state (loading, error, success)
instead of manual boolean flags. Model multi-value state as a
discriminated type rather than independent booleans. Derive computable
values from existing state instead of storing them separately.

Presentation-only state (which item is being edited, dialog open/closed,
active tab) stays in the component.
