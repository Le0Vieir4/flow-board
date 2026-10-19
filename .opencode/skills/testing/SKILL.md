---
name: testing
description: Frontend testing strategy for Flow Board.
---

# Frontend Testing

## General
Tests should protect behavior rather than implementation details.

Prefer testing what a user can observe.

## Unit tests
Use unit tests for:
- pure utilities
- validation logic
- data transformation
- isolated business rules

## Component tests
Use React Testing Library when available.

Prefer queries by:
- role
- label
- text
- accessible name

Avoid selecting implementation-specific class names unless the class itself is the behavior under test.

## Integration tests
Use integration tests for flows involving:
- forms
- API boundaries
- authentication states
- multiple components working together

## End-to-end
Use the project's established E2E framework for critical user journeys such as:
- authentication
- creating/editing important resources
- payment-sensitive flows if applicable
- major navigation paths

## Async behavior
Test:
- loading
- success
- empty
- error
- retry/recovery where applicable

## Mocking
Mock external boundaries, not internal implementation details unnecessarily.

Do not create mocks that diverge from the actual API contract.

## Regression
When fixing a bug, add a regression test when practical.

## Avoid
Do not write tests that merely verify:
- a component rendered
- a CSS class exists
- an internal state variable has a specific value

unless those details are genuinely the contract.
