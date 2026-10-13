---
name: styling
description: Tailwind CSS and styling conventions for Flow Board web.
---

# Styling

## Tailwind
Use the project's existing Tailwind configuration and conventions.

Prefer utility classes for local styling.
Do not introduce a second styling methodology without a concrete architectural reason.

## Class organization
Keep class lists readable.
When a component has substantial conditional styling, use the project's existing class-variance or utility pattern instead of deeply nested string concatenation.

## Tokens
Prefer design tokens over hard-coded colors and spacing values when the project defines them.

Do not invent near-duplicate colors such as:
- slightly different grays
- arbitrary border colors
- arbitrary spacing values

Use the design system.

## Responsive
Prefer responsive utilities over JavaScript viewport detection for visual layout.

Do not use `window.innerWidth` to solve problems CSS can solve.

## Dark mode
Respect the project's existing dark-mode implementation.
Do not introduce independent theme state.

## Animations
- Keep motion purposeful.
- Respect reduced-motion preferences.
- Avoid animations that block interaction.
- Do not animate layout unnecessarily.

## CSS
Do not use global CSS for component-specific behavior unless the behavior genuinely needs global scope.
Avoid `!important` unless required to override an external system.
