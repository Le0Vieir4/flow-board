---
name: forms
description: Form implementation, validation, and UX rules for Flow Board.
---

# Forms

## Validation
Use the project's established schema validation library and shared API schemas where available.

Validation should exist at the appropriate boundaries:
- client-side validation for immediate UX
- server-side validation as the authoritative boundary

Never trust client-side validation for security.

## React Hook Form
If React Hook Form is already used:
- Prefer `useForm`.
- Use controlled components only where necessary.
- Connect validation schemas through the established resolver pattern.
- Avoid manually duplicating form state.

## UX
Forms should provide:
- clear labels
- useful validation messages
- disabled/submitting state
- success feedback where appropriate
- error feedback
- keyboard-friendly navigation

Do not use placeholders as the only labels.

## Errors
Map API validation errors to the appropriate fields when possible.
Keep unexpected server errors separate from field-level validation errors.

## Submission
Prevent duplicate submissions.
Show progress while an async submission is active.

## Accessibility
- Associate labels with controls.
- Use `aria-invalid` when appropriate.
- Associate validation messages with the relevant input.
- Use semantic fieldsets for related controls.
