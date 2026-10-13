# Flow Board Database

## Purpose

Define database and Drizzle ORM conventions.

## Location

Database configuration and database-specific code belong exclusively to:

apps/server

The frontend must never import database code.

## Drizzle

Use Drizzle ORM for:

- schema definitions
- queries
- relations
- migrations

Keep database schemas organized by domain when the project size requires it.

Example:

src/database/
├── schema/
│   ├── users.ts
│   ├── boards.ts
│   ├── columns.ts
│   └── cards.ts
├── migrations/
└── index.ts

## Rules

1. Do not duplicate database models in the frontend.
2. Do not expose Drizzle types directly as an API contract unless intentionally designed that way.
3. API response types should represent the API contract, not the database implementation.
4. Keep migrations reproducible.
5. Never modify an existing migration to change an already-applied schema.
6. Create a new migration for schema changes.
7. Never execute destructive database operations without explicit confirmation.

## Queries

Prefer:

service -> repository -> Drizzle

rather than:

controller -> Drizzle

Keep complex queries encapsulated in repositories.
