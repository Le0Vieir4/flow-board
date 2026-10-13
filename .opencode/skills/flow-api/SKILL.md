# Flow Board API

## Purpose

Define HTTP API conventions.

## Backend

API implementation lives in:

apps/server

## Frontend

API consumption lives in:

apps/web

## Rules

1. Controllers define HTTP boundaries.
2. DTOs validate incoming requests.
3. Responses should have predictable structures.
4. HTTP status codes must represent the operation correctly.
5. Never expose internal errors directly to clients.
6. Never expose database implementation details.
7. Authentication and authorization must be enforced server-side.

## Naming

Use resource-oriented routes.

Examples:

GET    /boards
POST   /boards
GET    /boards/:id
PATCH  /boards/:id
DELETE /boards/:id

Nested resources should only be used when the relationship is meaningful.

Example:

GET /boards/:boardId/cards
