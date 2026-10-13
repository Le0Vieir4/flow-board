---
name: react
description: React component and state-management conventions for Flow Board.
---

# React

## Components
- Prefer function components.
- Keep components small and composable.
- Favor composition over deeply configurable "god components".
- Keep business logic out of purely presentational components when possible.

## Props
- Use explicit TypeScript prop types.
- Avoid `any`.
- Do not pass large objects when a component only needs a few fields.
- Avoid excessive boolean props that create many visual modes; prefer clear variants or composition.

## State
Choose the smallest appropriate state scope:
1. local component state
2. shared client state only when multiple distant components need it
3. URL state for shareable/filterable navigation state
4. server state for remote data

Do not put server data into global client state without a concrete reason.

## Effects
- Do not use `useEffect` to derive values that can be calculated during render.
- Do not use effects to synchronize state that can be represented by props or derived data.
- Keep effects focused on actual external side effects.
- Clean up subscriptions, timers, and event listeners.

## Memoization
Do not add `useMemo`, `useCallback`, or `memo` by default.
Use them when profiling or a clear referential-stability requirement justifies them.

## Lists
- Use stable keys from the data.
- Never use array indexes as keys when item identity can change.

## Forms
Prefer the project's established form stack and validation strategy.
Do not duplicate validation rules between components if a shared schema can represent the contract.

## Error handling
Interactive components should make failures visible and recoverable where possible.

## Accessibility
Use semantic HTML first.
Do not replace native controls with custom elements without a concrete reason.
