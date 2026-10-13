# Flow Board Validation

## Purpose

Define validation rules across the monorepo.

## Principle

Validate data at system boundaries.

Examples:

HTTP request
    ↓
validation
    ↓
application logic

External API
    ↓
validation
    ↓
application logic

Database
    ↓
typed result
    ↓
application logic

## Shared schemas

Use `packages/shared` for schemas that genuinely need to be shared between frontend and backend.

Example:

packages/shared/
└── schemas/
    ├── auth.ts
    ├── board.ts
    └── card.ts

The frontend may use shared schemas for client-side validation.

The backend must independently validate incoming requests.

Never trust client-side validation as a security boundary.
