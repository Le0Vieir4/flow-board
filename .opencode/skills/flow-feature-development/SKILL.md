# Flow Board Feature Development

When implementing a new feature:

## Step 1 — Understand

Inspect:

- existing modules
- existing database schema
- existing API conventions
- shared types
- frontend consumers

Do not start coding immediately.

## Step 2 — Design

Identify:

- domain
- entities
- database changes
- API endpoints
- validation schemas
- shared contracts
- frontend integration

## Step 3 — Backend

Implement:

database
→ repository
→ service
→ controller

## Step 4 — Shared

If a type or schema is genuinely shared:

Add it to:

packages/shared

Do not move backend-specific implementation there.

## Step 5 — Frontend

Implement the consumer in:

apps/web

Reuse shared contracts when appropriate.

## Step 6 — Verify

Run:

pnpm lint
pnpm typecheck
pnpm test

and relevant application tests.

## Important

Before creating new abstractions, inspect the existing codebase.

Prefer consistency with existing patterns over introducing a new architectural pattern.
