# Flow Board Web — Frontend Instructions

## 1. Frontend Stack

The frontend uses:

- Next.js
- React
- TypeScript
- Tailwind CSS v4

Before implementing a feature, inspect the installed versions, package scripts, existing application structure, and project configuration.

Do not assume APIs, configuration formats, or conventions from older versions of these technologies.

Follow the existing App Router or Pages Router architecture. Do not introduce a different routing architecture without an explicit requirement.

## 2. Mandatory Workflow

Before writing code:

1. Understand the requested behavior and affected user flow.
2. Inspect the existing route, page, layout, component, and related data flow.
3. Identify reusable components and existing UI package exports.
4. Read the relevant design tokens, global styles, and Tailwind configuration.
5. Consult applicable skills for the task.
6. Determine whether the task requires functional changes, visual design, accessibility improvements, or a combination.

During implementation:

- Make focused changes.
- Reuse existing components and established patterns.
- Keep business logic separate from presentation where appropriate.
- Preserve existing behavior unless the task requires changing it.

After implementation:

- Inspect the diff.
- Run the applicable lint, typecheck, tests, and build scripts.
- Report any checks that could not be completed.

## 3. Next.js Architecture

- Follow the existing Next.js routing architecture and folder structure.
- Prefer Server Components when client-side interactivity is not required.
- Add `"use client"` only when browser APIs, client hooks, event handlers, or client-side state require it.
- Keep client component boundaries as small as reasonably practical.
- Avoid turning entire pages or layouts into Client Components unnecessarily.
- Use Server Components, Server Actions, route handlers, and API calls according to the existing architecture and security requirements.
- Do not expose server-only modules, secrets, database access, or private environment variables to client bundles.
- Validate and authorize sensitive operations on the server.
- Treat redirects and middleware as navigation controls, not substitutes for backend authorization.
- Preserve loading, error, empty, and success states for asynchronous user flows.
- Follow the existing conventions for metadata, navigation, layouts, and route-level error handling.
- Avoid unnecessary client-side fetching when the existing architecture supports a suitable server-side solution.
- Do not introduce caching or revalidation behavior without understanding the data freshness and authorization implications.

## 4. React and TypeScript

- Use functional components and the existing React patterns.
- Define explicit prop types for reusable components.
- Derive types from existing schemas or shared definitions when appropriate.
- Avoid `any`, unnecessary type assertions, and suppression comments.
- Do not duplicate API response types if a canonical shared type already exists.
- Follow the Rules of Hooks.
- Keep effects focused on synchronizing with external systems; do not use them for derived state unnecessarily.
- Avoid redundant state and duplicated sources of truth.
- Use stable keys when rendering lists.
- Handle nullable values and asynchronous states explicitly.
- Keep components reasonably focused without splitting every small expression into a separate component.
- Use `useMemo` and `useCallback` when there is a concrete reason, not as automatic decoration.
- Clean up subscriptions, event listeners, and other external resources when required.
- Avoid unnecessary rerenders and expensive computations when they measurably affect the user experience.

## 5. Tailwind CSS v4 — Strict Styling Conventions

### 5.1 Prefer Standard Utilities

Use standard Tailwind utilities whenever they accurately represent the intended design.

Prefer:

- `w-12` over `w-[48px]` when both represent the intended size.
- `gap-4` over `gap-[16px]`.
- `rounded-lg` over an arbitrary radius when the existing design system uses that radius.
- `text-sm` or `text-base` over arbitrary font sizes when appropriate.
- Existing spacing, sizing, typography, color, and layout tokens over one-off values.

These are examples, not fixed substitutions. Confirm the intended visual value and the installed Tailwind version before changing classes.

### 5.2 Arbitrary Values Are an Exception

Do not invent arbitrary values such as:

- `w-[47px]`
- `mt-[13px]`
- `gap-[19px]`
- `text-[15px]`
- `rounded-[11px]`

when an appropriate standard utility, project token, or existing CSS variable can express the same design.

Arbitrary values are permitted when:

- A genuine design requirement cannot be represented adequately by available utilities.
- A value comes from dynamic data and must be applied through an appropriate, safe styling mechanism.
- A specific intrinsic size or external integration requires a nonstandard value.
- A carefully justified one-off visual adjustment is necessary.

Before using an arbitrary value:

1. Check whether an existing utility expresses the same value.
2. Check whether a project design token or CSS variable should be used.
3. Check whether the value indicates an inconsistency in the design system.
4. Prefer a reusable token when the value is part of a recurring design decision.

Do not replace meaningful, intentional arbitrary values with standard utilities that produce a different result merely to satisfy a rule.

### 5.3 Follow Tailwind CSS v4

- Follow Tailwind CSS v4 conventions and the installed version's documentation.
- Respect the existing CSS-first configuration and `@theme` definitions.
- Inspect the global stylesheet and existing design tokens before introducing new styling conventions.
- Use existing theme variables and utilities whenever appropriate.
- Do not introduce legacy configuration patterns from Tailwind v3 without a specific compatibility reason.
- Do not add duplicate CSS variables or redundant utility definitions.
- Avoid unnecessary custom CSS when existing utilities are sufficient.
- Use custom CSS for genuinely complex styling, reusable primitives, unsupported effects, or cases where it improves clarity.
- Do not construct dynamic class names in ways Tailwind cannot detect at build time. Use complete class names or the project's established variant-mapping pattern.
- Preserve responsive behavior and dark-mode conventions already used in the application.

### 5.4 Consistent Layouts

- Reuse established spacing, container widths, breakpoints, and layout patterns.
- Prefer Flexbox and Grid utilities over unnecessary absolute positioning.
- Avoid using arbitrary pixel offsets to compensate for a flawed layout.
- Use responsive utilities intentionally rather than adding breakpoints without understanding the layout.
- Prevent horizontal overflow and unintended content clipping.
- Avoid fixed heights for content that must expand with text or validation messages.

## 6. Design System and Shared UI

Before building a component, inspect the existing UI package and its public exports.

- Reuse existing buttons, inputs, dialogs, dropdowns, cards, tooltips, icons, and other shared primitives.
- Extend existing variants when that is consistent with the component's purpose.
- Do not create a duplicate component just because a slightly different visual treatment is needed.
- Preserve the established API and variant conventions.
- Use the existing icon abstraction instead of importing icons inconsistently across the application.
- Use existing brand icons or the approved custom SVG implementation when Lucide does not provide the required brand icon.
- Follow the existing patterns for form validation, labels, error messages, and disabled states.
- Avoid deeply nested cards, redundant borders, excessive rounded containers, and decorative elements that do not improve the interface.
- Keep the interface visually consistent across routes.

## 7. Impeccable Design Workflow

Use Impeccable when it is installed and available for tasks involving:

- New page or feature design.
- Significant UI redesign.
- Visual critique and design-system refinement.
- Visual polish and interaction refinement.
- Auditing an existing interface for design problems.

For meaningful design work:

1. Understand the existing interface and the user's intended workflow.
2. Read `PRODUCT.md` and `DESIGN.md` when present.
3. Inspect existing components, tokens, typography, colors, and responsive behavior.
4. Use the appropriate Impeccable workflow or command.
5. Implement the design using the existing Next.js, React, TypeScript, and Tailwind CSS v4 architecture.
6. Review the result against the requested design, accessibility requirements, and existing conventions.

Important rules:

- Preserve established product identity unless a redesign is requested.
- Do not introduce generic SaaS styling by default.
- Avoid arbitrary gradients, excessive shadows, unnecessary animation, and decorative icon tiles without a design reason.
- Do not replace the existing design system simply because a new direction is easier to implement.
- Prefer coherent, reusable design decisions over isolated visual fixes.
- Do not claim visual verification without actually inspecting the rendered result.
- Do not invoke Impeccable for unrelated backend-only tasks.
- Do not invent Impeccable commands; check the installed skill's instructions.

## 8. Accessibility

Use the accessibility skill for relevant work, especially forms, dialogs, navigation, keyboard interactions, and custom controls.

- Prefer semantic HTML elements.
- Use native buttons for actions and links for navigation.
- Ensure all interactive controls are keyboard accessible.
- Provide visible and logical focus indicators.
- Associate form labels with their inputs.
- Give controls accessible names and meaningful descriptions where necessary.
- Use ARIA only when native HTML semantics are insufficient.
- Do not add ARIA attributes that contradict native element semantics.
- Do not use color as the only indicator of an error, state, or action.
- Respect reduced-motion preferences.
- Maintain appropriate text contrast and visible focus.
- Use correct heading hierarchy and landmarks.
- Manage focus correctly for dialogs, menus, and other overlays.
- Announce important asynchronous feedback when appropriate.
- Include meaningful alternative text for informative images and empty alternative text for decorative images.

## 9. Forms and User Feedback

- Reuse existing form libraries, validation schemas, and input components.
- Validate data using the established validation approach.
- Display understandable field-level errors and relevant server errors.
- Preserve user input when appropriate after recoverable errors.
- Prevent duplicate submissions when necessary.
- Expose pending, success, and failure states clearly.
- Use appropriate input types and autocomplete attributes.
- Do not rely exclusively on client-side validation for security.
- Avoid uncontrolled inconsistencies between client validation and server validation.

## 10. State and Data Fetching

- Follow the existing state-management and data-fetching architecture.
- Prefer the simplest suitable state mechanism.
- Avoid introducing a new state-management dependency without a concrete need.
- Keep server state and local UI state conceptually separate.
- Handle loading, empty, error, and stale-data conditions intentionally.
- Avoid duplicate requests and unnecessary client-side waterfalls.
- Follow the existing authentication and authorization flow.
- Do not store sensitive tokens or secrets in browser storage unless the established security design explicitly requires it.

## 11. Responsive Design and Performance

- Build for the application's existing supported breakpoints.
- Check narrow mobile widths, intermediate widths, and desktop layouts.
- Prevent overflow in forms, tables, dialogs, navigation, and long text.
- Use the existing Next.js image and font strategies where appropriate.
- Avoid unnecessary client-side JavaScript and large dependencies.
- Use lazy loading when it improves performance without harming usability.
- Avoid layout shifts caused by images, fonts, or dynamically inserted content.
- Keep animations purposeful and respect reduced-motion preferences.

## 12. Testing and Verification

Use the scripts actually defined by the frontend package.

When relevant:

- Run linting.
- Run TypeScript typechecking.
- Run focused component or integration tests.
- Run the production build when appropriate.
- Verify routing, authentication states, forms, and error handling.
- Inspect browser console and network errors when investigating runtime problems.
- Verify keyboard interactions and accessibility behavior.
- Review responsive behavior and rendered UI for visual changes.

Do not invent package scripts or claim that visual, browser, or accessibility tests were performed when they were not.

## 13. Final Response

After completing frontend work, report:

- What changed.
- Which important files were modified.
- Any significant architectural or design decisions.
- Which checks passed, failed, or were not run.
- Any remaining issues or justified follow-up work.

Keep the report concise, specific, and verifiable.