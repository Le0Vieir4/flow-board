---
name: data-fetching
description: API integration and remote-data conventions for Flow Board.
---

# Data Fetching

## Source of truth
The backend API is the source of truth for server data.

Do not duplicate business rules in the frontend merely for convenience.

## API layer
Prefer a small, typed API layer over raw fetch calls spread throughout components.

The API layer should centralize:
- base URL handling
- request configuration
- authentication behavior
- response parsing
- common error handling

## Types
Use shared types/schemas from the monorepo when they genuinely represent the API contract.

Do not copy backend DTOs manually into the frontend when a shared contract already exists.

## Loading
Every remote interaction should define an appropriate loading state.

Avoid blank screens while data is loading.

## Errors
Handle:
- network failures
- authentication failures
- authorization failures
- validation errors
- unexpected server errors

Do not expose raw backend errors directly to users.

## Caching
Follow the data-fetching mechanism already established by the application.
Do not introduce React Query, SWR, or another cache layer unless the project actually needs it.

## Mutations
After mutations, explicitly decide whether affected data should:
- be revalidated
- be refetched
- be optimistically updated
- remain unchanged

Do not blindly refetch everything.

## Authentication
Never store sensitive authentication material in insecure browser storage merely for convenience.
Follow the project's established cookie/session architecture.
