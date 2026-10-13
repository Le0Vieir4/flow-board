---
name: frontend
description: Core frontend engineering rules for the Flow Board web application.
---

# Frontend Engineering

## Scope
These rules apply to `apps/web` in the Flow Board monorepo.

## Goals
- Build maintainable, accessible, responsive interfaces.
- Prefer simple composition over unnecessary abstractions.
- Keep UI concerns inside the web application.
- Reuse shared packages only when the dependency belongs to a genuinely shared concern.

## Architecture
- Follow the existing Next.js App Router structure.
- Keep route-specific code close to its route.
- Put reusable UI in `components/`.
- Put browser/server utilities in `lib/` or an existing equivalent.
- Do not create new top-level architectural folders without a concrete reason.
- Do not duplicate components that can reasonably be shared.

## Component boundaries
- Prefer small, composable components.
- Keep components focused on one responsibility.
- Do not turn every component into a client component.
- Add `"use client"` only when browser APIs, state, effects, event handlers, or client-only libraries require it.
- Keep data fetching and server-only logic on the server when possible.

## Implementation
- Inspect existing patterns before creating new ones.
- Reuse existing design-system components.
- Avoid introducing a new library when the existing stack can solve the problem.
- Preserve existing behavior when refactoring.
- Do not modify backend contracts from the frontend without verifying the API contract.

## UX
Every meaningful async interaction should account for:
- loading
- success
- empty state
- error state
- disabled/submitting state where applicable

## Quality
Before considering a feature complete:
1. Check TypeScript errors.
2. Check responsive behavior.
3. Check keyboard accessibility.
4. Check loading/error/empty states.
5. Verify that client/server boundaries are intentional.
