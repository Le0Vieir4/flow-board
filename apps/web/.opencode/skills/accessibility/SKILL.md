---
name: accessibility
description: Accessibility requirements for Flow Board interfaces.
---

# Accessibility

Accessibility is part of implementation, not a final polish step.

## Semantic HTML
Prefer:
- `button` for actions
- `a`/`Link` for navigation
- `input`, `select`, `textarea` for form controls
- headings for document structure
- lists for lists

Do not use clickable `div` elements when a native element is appropriate.

## Keyboard
Every interactive feature must be usable with keyboard navigation.

Check:
- visible focus
- logical tab order
- Escape behavior for dialogs/popovers
- Enter/Space behavior for controls

## Labels
Every form control needs an accessible name.

Do not rely on placeholder text as the only label.

## Dialogs
Dialogs should:
- have an accessible name
- trap focus when appropriate
- return focus appropriately
- close through expected keyboard interaction

Prefer the established dialog component.

## Color
Do not rely on color alone to communicate status.

Ensure sufficient contrast according to the project's accessibility target.

## Motion
Respect `prefers-reduced-motion`.

Avoid essential information being communicated only through animation.

## Screen readers
Use ARIA only when semantic HTML is insufficient.
Incorrect ARIA is worse than appropriate native HTML.

## Testing
When implementing important interactive flows, test keyboard behavior and accessible names in addition to visual appearance.
