# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

General knowledge workers using Kanban for personal or team task management — project managers, team leads, engineers, designers, marketers, freelancers, and solopreneurs. The tool is designed for anyone who organizes work on boards, not exclusively software teams.

## Product Purpose

FlowBoard is a Kanban-style project management platform that combines boards, real-time collaboration, and smart notifications into a beautiful, fast experience. Its purpose is to help individuals and teams organize work and ship faster without the complexity and noise of traditional PM tools.

## Positioning

Real-time collaboration is the core differentiator. FlowBoard lets multiple people work on the same board simultaneously with instant updates — not polling, not save-and-reload. It competes with Linear, Trello, Notion, and Monday.com by making multi-player feel as fluid as single-player.

## Operating Context

- Web application accessed via browser (responsive, desktop-first)
- Users work across boards, columns, and tasks in a Kanban workflow
- Common workflow: create board → add columns → populate tasks → assign → move across statuses → comment → complete
- Collaboration happens in real-time within a board view
- Users may manage multiple boards simultaneously

## Capabilities and Constraints

Confirmed:
- Kanban board view with columns and task cards
- Real-time multi-user collaboration
- Smart notifications
- Auth via email/password, Google OAuth, GitHub OAuth
- PostgreSQL persistence via Drizzle ORM
- Dark mode as the default and only theme
- Realtime transport: WebSocket relay service in `apps/server` (port 4000); the shared `api.ts` message contract (`ClientMessage` / `ServerMessage`) is the future tRPC seam. UI-first phase uses the relay against mock data; board state is client-side in-memory until persistence lands

Undecided (open for future decisions):
- Whether list/calendar views will ship in v1
- Mobile app or responsive web only
- Public/shared board access model
- Automation and workflow rules
- API for integrations
- Self-hosted vs SaaS deployment model (codebase is structurable for either)

## Brand Commitments

- **Name:** FlowBoard
- **Theme:** Dark-mode-first; the product ships dark by default and no light mode is planned
- **Logo:** A rounded-square gradient mark (3 horizontal lines on a 140deg gradient from #6d8bff to #3549d1) with the "FlowBoard" wordmark in bold sans-serif
- **Typography:** Inter (sans-serif)
- **Design tokens:** Defined in CSS custom properties via Tailwind v4 `@theme inline` — background, panel, card, foreground, primary blues, semantic colors (success/warning), tag colors, border radii

## Evidence on Hand

- `apps/web/reference/index.html` — a designed landing page reference showing product vision, layout, feature callouts, and board UI mock
- `apps/web/src/app/globals.css` — design token definitions (dark theme, typography, radii)
- Product copy from landing page: "Organize work. Ship products faster." / "FlowBoard combines project management, real-time collaboration and smart automation into a beautiful Kanban platform for modern teams."
- Board names in reference: "Product Launch v2", "Engineering Backlog", "Marketing Campaigns", "Mobile App Redesign"
- Dashboard surfaces (built, post-login): boards home status wall + live board view at `/boards`; `apps/web/src/components/dashboard/`
- No real user data, testimonials, case studies, or production assets exist — the project is pre-alpha

## Product Principles

1. **Real-time by default.** Every shared surface reflects changes instantly. Optimistic updates and live cursors are not add-ons; they are the foundation.
2. **Beautiful is functional.** Visual craft reduces cognitive load. The dark theme, typography, spacing, and motion serve clarity, not decoration.
3. **Start fast, stay fast.** The UI loads quickly and interactions feel immediate. Performance is a feature, not a future concern.
4. **Progressive simplicity.** A new user can be productive in seconds. Advanced capabilities reveal themselves naturally as the user's needs grow.
5. **Opinionated defaults, flexible structure.** FlowBoard suggests a standard Kanban workflow but never forces it — columns, tags, and fields are customizable.

## Accessibility & Inclusion

No product-specific accessibility requirements have been established yet. Standard WCAG compliance is expected but not yet audited.
