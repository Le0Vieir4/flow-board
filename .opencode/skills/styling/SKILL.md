---
name: styling
description: Tailwind CSS and styling conventions for Flow Board web.
---

# Styling

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

## Tailwind CSS Utility Conventions

Core rule

Prefer standard Tailwind CSS utility classes over arbitrary values. Follow the existing design system, spacing scale, sizing scale, and component conventions already established in the repository.

Requirements

Use standard spacing utilities first.

Prefer w-12 over w-[48px].

Prefer h-10 over h-[40px].

Prefer p-4, mt-4, gap-4, and similar scale-based utilities.

Prefer max-w-7xl, w-full, min-h-screen, and other standard sizing utilities when appropriate.

Avoid arbitrary values by default.

Do not introduce w-[...], h-[...], p-[...], gap-[...], text-[...], top-[...], or similar utilities when an existing Tailwind utility or project token provides a suitable value.

Do not use arbitrary values simply because they match a reference screenshot more precisely by a few pixels.

Respect the existing design system.

Inspect existing components, Tailwind configuration, theme tokens, and CSS variables before introducing new styling values.

Reuse existing semantic tokens for colors, typography, borders, radii, spacing, and other design properties.

Follow the project's established component variants instead of overriding their styles with arbitrary values.

Use arbitrary values only when justified.

Allow them when a genuine design requirement cannot be expressed adequately with standard utilities or existing project tokens.

Examples include complex grid templates, precise aspect ratios, CSS calculations, and unique positioning requirements.

Prefer CSS variables or semantic design tokens when a custom value needs to be reused.

Keep exceptions minimal and explain the reason when the value is not self-evident.

Preserve responsive conventions.

Prefer standard responsive utilities such as w-full, max-w-lg, md:w-1/2, and lg:grid-cols-3.

Do not introduce arbitrary breakpoint values when the project's existing breakpoints satisfy the requirement.

Review before finishing.

Inspect all newly added or modified class names.

Replace unnecessary arbitrary values with standard utilities or existing project tokens.

Ensure the result remains responsive and visually correct.

Decision process

Before using an arbitrary value:

Check whether a standard Tailwind utility represents the desired value.

Check whether the project already defines a suitable design token.

Check whether an existing component or variant solves the problem.

Only use an arbitrary value if the previous options are insufficient.

Priority: Existing project conventions → semantic design tokens → standard Tailwind utilities → justified arbitrary values.