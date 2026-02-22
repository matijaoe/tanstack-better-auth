This project uses Tanstack Start, Convex, Better Auth, Shadcn UI, BaseUI and Tailwind.
`pnpm` is the package manager.

Use Context7 MCP to get the latest documentation for the libraries.

## Code structure

Separate behavior from UI. Extract business logic, async operations, and
state management into the framework's behavior primitive (hooks). Components should render and call handlers — not
contain API calls, async flows, cache invalidation, or error transformation.

Expose only what the component needs: observable state and trigger
functions. Keep implementation details internal.

Use the data-fetching library's built-in state (loading, error, success)
instead of manual flags. Model multi-value state as a discriminated type
rather than independent booleans. Derive values from existing state
instead of storing them separately.

UI-only state (which item is being edited, dialog open) stays in the
component.
