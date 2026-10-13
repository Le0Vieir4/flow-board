# Flow Board Backend

## Purpose

Define backend development conventions for `apps/server`.

## Stack

- NestJS
- TypeScript
- Drizzle ORM
- Node.js
- pnpm

## Architecture

Organize backend code by domain/feature.

Prefer:

src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── boards/
│   ├── columns/
│   └── cards/
├── database/
├── common/
└── main.ts

Avoid organizing the entire application exclusively by technical type:

controllers/
services/
repositories/

unless the existing codebase already follows that structure.

## Module rules

Each domain module should contain only code related to that domain.

Example:

modules/boards/
├── boards.module.ts
├── boards.controller.ts
├── boards.service.ts
├── boards.repository.ts
└── dto/

Controllers should:

- receive HTTP requests
- validate input
- call application services
- return responses

Controllers must not contain business logic.

Services should:

- contain business rules
- orchestrate operations
- coordinate repositories and other services

Repositories should:

- handle persistence concerns
- encapsulate database queries

Never place raw database queries inside controllers.

## TypeScript

Use strict typing.

Avoid:

- `any`
- unnecessary type assertions
- duplicated interfaces
- implicit `any`

Prefer explicit domain types when they improve readability.
