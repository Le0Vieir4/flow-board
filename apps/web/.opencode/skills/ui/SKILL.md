---
name: ui
description: UI architecture and design-system rules for Flow Board.
---

# UI and Design System

## General rule
Before creating a component, inspect existing components and patterns.

Reuse existing:
- buttons
- inputs
- dialogs
- cards
- dropdowns
- tables
- badges
- typography
- layout primitives

Do not create a duplicate component with a slightly different name.

## shadcn/ui
When shadcn/ui is part of the existing project:
- Prefer existing shadcn components.
- Extend them through variants/composition rather than copying their implementation unnecessarily.
- Keep customization consistent with the project's design tokens.
- Do not blindly regenerate components if the project already has customized versions.

## Component API
Component APIs should be:
- predictable
- typed
- composable
- small enough to understand

Prefer variants over arbitrary styling props.

## Visual hierarchy
Every page should have a clear:
- primary action
- content hierarchy
- navigation context
- feedback state

Do not add visual effects merely because they are possible.

## Responsive design
Design mobile-first unless the existing project explicitly follows another strategy.
Check:
- small mobile
- tablet
- desktop
- wide desktop

Avoid fixed widths that cause horizontal scrolling.

## Design consistency
Reuse the project's:
- spacing scale
- typography
- border radius
- colors
- shadows
- interaction patterns

Do not introduce isolated visual systems.

## Empty states
Empty states should explain:
1. what is empty
2. why it may be empty when useful
3. what the user can do next, when applicable
