# Flow Board Architecture

## Purpose

You are working inside the Flow Board monorepo.

The repository uses:

- pnpm
- Turborepo
- TypeScript
- NestJS for the backend
- Next.js for the frontend
- Drizzle ORM for database access

## Repository structure

- `apps/server` contains backend application logic.
- `apps/web` contains the Next.js frontend.
- `packages/shared` contains framework-agnostic shared types and schemas.
- `packages/ui` contains reusable UI components.
- `tooling/eslint` contains shared linting configuration.

## Rules

1. Never create backend logic inside `apps/web`.
2. Never access the database directly from `apps/web`.
3. Database access must remain inside `apps/server`.
4. Shared types and validation schemas that are genuinely framework-agnostic belong in `packages/shared`.
5. Do not move backend-specific logic into `packages/shared`.
6. Do not duplicate shared types between frontend and backend.
7. Before creating a new package, check whether an existing package already provides the required functionality.
8. Follow the existing project structure before introducing a new architectural pattern.
9. Prefer small, cohesive modules over large files.
10. Do not introduce dependencies without checking whether an existing dependency already solves the problem.

## Dependency direction

Allowed:

apps/web -> packages/shared
apps/web -> packages/ui
apps/server -> packages/shared

Avoid:

apps/web -> apps/server
packages/shared -> apps/server
packages/ui -> apps/server
packages/shared -> packages/ui

The shared package must remain framework-agnostic.
