---
version: 1
slug: "src-app-dashboard-layout-tsx"
primary_target: "src/app/(dashboard)/layout.tsx"
related_targets: ["src/app/(dashboard)/boards/page.tsx","src/app/(dashboard)/boards/[boardId]/page.tsx","src/app/(dashboard)/tasks/page.tsx","src/app/(dashboard)/notifications/page.tsx"]
---

---
version: 2
slug: "src-app-dashboard-layout-tsx"
primary_target: "src/app/(dashboard)/layout.tsx"
related_targets: ["src/app/(dashboard)/boards/page.tsx","src/app/(dashboard)/boards/[boardId]/page.tsx","src/app/(dashboard)/tasks/page.tsx","src/app/(dashboard)/notifications/page.tsx"]
---

# Surface Brief: The Instrument Room (post-login dashboard)

## Scope and visitor mode
Boards home + board view, logged-in, Operate mode. The user's own workspace — a night-shift command deck, not a marketing page. Realtime activity is ambient; presence and movement are the atmosphere.

## Audience, job, action
Audience: the operator returning to their boards. Job: see what's alive, find the board they came for, and get into flow. Action: open a board from the status wall, read its state at a glance, move cards without losing the session's realtime thread.

## Proof / content
Real boards with real-feeling data (Product Launch v2 fully populated), 5-person team, live presence dots, inbound moves from collaborators appearing with actor-colored toasts. The proof is activity: the dashboard should feel occupied even at rest.

## Direction and memorable moment
**The Observatory applied to the app.** One gradient light source per viewport; flat tonal surfaces stacked on void; tags as the metadata system. Memorable moment: cards sliding between columns while a toast announces who moved what — the deck feels crewed. Live chip = heartbeat; presence stack = who's on deck.

## Chosen decisions (from build)
- Boards grouped by status (Active / On hold / Archived); sections carry counts.
- One gradient CTA per viewport (New Board; modal CTA when open); Live chip and view chips stay flat.
- Board view: 272px columns, composer per column, add-column dashed tile, menu per column, editable title row.
- Realtime: WebSocket relay (server :3001), inbound moves + presence flips + toasts; Live / Offline demo chip with retry state.
- Motion authored once: toast-in + count-bump, respects prefers-reduced-motion.
- Avatars are gradient initials with presence dots, never photos.
- Mobile: sidebar becomes 264px drawer below 900px.
- My Tasks: due-date Triage Wall (Overdue / Today / Upcoming / No due date), flat segmented My-tasks/All-tasks switch, warning-tinted overdue pills, rows deep-link to boards, 860px max measure.
- Notifications: live inbox fed by inbound relay moves; unread electric dot + tinted row; groups Today / Yesterday / Earlier; flat Mark-all-read chip; in-memory store with demo seed.
- Sidebar bell carries a Micro flat electric unread pill (tag system signal, not a second gradient).
- Task modal: Assign chip opens a fixed-anchored member picker above the footer (modal clips overflow); flat primary check circles.

## Unresolved
- List / Calendar views are chips only; no routes.
- Real auth, DB, tRPC — deferred; WS relay speaks the shared api.ts contract.
- View chips' active state: currently decorative Board tab; fine as ship.
- Notification semantics beyond moves (comment/mention/assign events) are seeded, not yet wireable to inbound relay messages.
