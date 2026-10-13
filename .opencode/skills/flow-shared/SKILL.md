# Flow Board Shared Package

## Purpose

Define what belongs in `packages/shared`.

The shared package must remain framework-agnostic.

## Good candidates

- TypeScript types
- interfaces
- enums
- Zod schemas
- API contracts
- shared constants
- serialization-safe domain types

## Bad candidates

Do not place:

- NestJS modules
- NestJS decorators
- controllers
- services
- repositories
- Drizzle code
- Next.js components
- React hooks
- browser-specific APIs
- Node-specific APIs

## Rule

Before adding something to `packages/shared`, ask:

"Can this code execute without NestJS, Next.js, React, Node-specific APIs, or database infrastructure?"

If not, it probably does not belong in shared.
