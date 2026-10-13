# Flow Board Testing

## Purpose

Define testing strategy for the monorepo.

## Priorities

Backend tests should cover:

1. Business rules
2. Services
3. API behavior
4. Validation
5. Database interactions where appropriate

## Rules

Do not write tests that merely reproduce implementation details.

Prefer behavior-based tests.

Example:

Bad:

expect(service.internalMethod).toHaveBeenCalled()

Better:

expect(createdBoard.id).toBeDefined()

## Test isolation

Tests must not depend on:

- developer machine state
- production database
- external services
- manually created data

Use mocks, test databases, or controlled fixtures where appropriate.
