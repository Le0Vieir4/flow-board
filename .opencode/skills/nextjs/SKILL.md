---
name: nextjs
description: Next.js App Router conventions for the Flow Board web application.
---

# Next.js

## Version
The project uses the current Next.js version defined by `apps/web/package.json`. At the time this skill was created, the project is using Next.js 16.

Always inspect the installed version before relying on version-specific behavior.

## App Router
- Use the App Router conventions already present in the project.
- Prefer Server Components by default.
- Use Client Components only where necessary.
- Keep route-specific loading, error, and not-found behavior close to the route.

## Server vs Client
Use a Server Component for:
- server-side data fetching
- static rendering
- access to server-only modules
- composition that does not require browser interactivity

Use a Client Component for:
- `useState`, `useEffect`, and other client hooks
- event handlers
- browser APIs
- interactive UI
- client-only libraries

Do not add `"use client"` to parent components merely because a child is interactive. Push the client boundary down when practical.

## Routing
- Use Next.js routing APIs rather than manually manipulating URLs.
- Use `Link` for navigation.
- Use `redirect`/`notFound` from the appropriate Next.js server APIs when applicable.
- Preserve route semantics and deep-linking.

## Data
- Prefer server-side fetching when it reduces unnecessary client JavaScript.
- Keep API calls behind a small number of well-defined utilities instead of scattering raw fetch calls across components.
- Handle authentication consistently with the project's established mechanism.

## Rendering
- Use `loading.tsx` for route-level loading UI when appropriate.
- Use `error.tsx` for route-level error boundaries when appropriate.
- Use `not-found.tsx` when a resource genuinely does not exist.
- Avoid client-side fetching solely to reproduce data that could be rendered on the server.

## Metadata
Use Next.js metadata APIs rather than manually inserting document metadata.

## Images
Prefer `next/image` for application images unless there is a concrete reason not to.

## Environment
- Never expose server-only environment variables to client code.
- Only variables intentionally prefixed for public exposure should reach browser code.

## Performance
- Avoid unnecessary client bundles.
- Avoid importing large libraries into shared client components without justification.
- Use dynamic imports for genuinely expensive client-only features when appropriate.
