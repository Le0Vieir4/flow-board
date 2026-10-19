# Flow Board — Project Instructions

## 1. Project Principles

- Treat this repository as a monorepo. Understand the existing workspace structure before making changes.
- Inspect the relevant source files, package manifests, configuration, and existing implementations before editing.
- Prefer small, focused, maintainable changes over unnecessary rewrites.
- Preserve existing architecture and conventions unless a change is explicitly requested or a concrete problem justifies changing them.
- Do not invent project structure, dependencies, scripts, environment variables, APIs, or configuration.
- Do not assume a library's API without checking the installed version and existing usage.
- Never claim a command, test, build, or implementation succeeded unless you have verified the result.

## 2. Repository Discovery

Before implementing a task:

1. Identify the affected application or package.
2. Read its `package.json` and relevant workspace configuration.
3. Inspect related source files and existing implementations.
4. Check for local `AGENTS.md` files and applicable skills.
5. Identify existing shared components, utilities, types, schemas, and design tokens.
6. Determine the smallest appropriate implementation and its verification steps.

Use the repository's actual directory names. Do not assume that an application is located at a particular path without checking.

## 3. Monorepo Conventions

- Keep application-specific functionality in the appropriate application.
- Put shared functionality in an existing shared package when it genuinely needs to be reused.
- Follow the existing workspace package manager and task runner.
- Use workspace package names and public exports for shared dependencies.
- Avoid importing internal files from another package when a public export already exists.
- Avoid duplicating shared functionality across applications.
- Do not move files, rename packages, or restructure directories without a clear need.
- Do not introduce circular dependencies between packages.
- Keep dependency versions consistent with the repository's existing conventions.

## 4. Code Quality

- Follow the language and framework conventions already used by the affected package.
- Prefer explicit, meaningful names and clear control flow.
- Avoid unnecessary abstractions, speculative generalization, and premature optimization.
- Reuse existing utilities instead of creating duplicate implementations.
- Handle errors intentionally; do not silently swallow exceptions.
- Validate untrusted input at appropriate boundaries.
- Avoid `any`, unsafe type assertions, and suppression comments unless justified.
- Remove unused imports, dead code, and temporary debugging statements introduced by your changes.
- Do not add dependencies for functionality that existing dependencies already provide.

## 5. Frontend

For frontend tasks, follow `apps/web/AGENTS.md` or the applicable frontend-specific instruction file.

- Use the existing React, Next.js, TypeScript, and Tailwind CSS conventions.
- Reuse the shared UI package where appropriate.
- Follow the established design system and accessibility requirements.
- Do not create a separate design system or introduce arbitrary visual conventions without justification.
- Use the relevant frontend, accessibility, framework, styling, and design skills when needed.
- Use Impeccable for meaningful UI design, redesign, critique, and visual refinement tasks when it is installed and available.
- Do not invoke visual design workflows for unrelated backend-only work.

## 6. Backend

For backend tasks, inspect the relevant application's instructions before editing.

- Follow the backend framework, module boundaries, and existing service patterns.
- Keep controllers, services, persistence, validation, and transport concerns separated according to the existing architecture.
- Validate incoming data at API boundaries.
- Enforce authorization and authentication on the server; frontend route guards alone are not security controls.
- Never trust client-provided ownership, identity, roles, or permissions without server-side verification.
- Keep secrets in environment variables or the existing secrets-management mechanism.
- Never expose passwords, access tokens, refresh tokens, private keys, or sensitive environment values in logs or responses.
- Follow existing database schemas, migrations, transactions, and repository conventions.
- Do not modify database schemas without considering the migration and deployment implications.

## 7. Shared UI and Design System

When modifying shared UI packages:

- Inspect existing exports, component variants, props, icons, and styling patterns first.
- Preserve existing public APIs unless a change is required.
- Prefer extending established variants over creating one-off components.
- Keep components reusable without introducing unnecessary complexity.
- Use consistent icon abstractions and existing icon conventions.
- Do not hardcode application-specific behavior into generic shared components unless the package's purpose requires it.

## 8. Skills and Design Workflows

- Discover and use relevant installed skills instead of reproducing their instructions manually.
- Load only the skills relevant to the task.
- For frontend implementation, consult the frontend skill.
- For accessibility-sensitive work, consult the accessibility skill.
- For Next.js-specific behavior, consult the Next.js skill.
- For React and TypeScript implementation, consult the React/TypeScript skill.
- For styling, consult the Tailwind CSS v4 skill.
- For shared components, consult the UI components skill.
- For significant visual design work, use the installed Impeccable workflow where appropriate.
- Follow existing `PRODUCT.md` and `DESIGN.md` when present.
- Do not assume a skill is installed just because it is mentioned here. Check availability before invoking it.
- When skill instructions conflict with the actual code

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
