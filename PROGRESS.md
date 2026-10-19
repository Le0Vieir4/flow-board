# FlowBoard — Project Progress

## Completed Phases

### Phase 1: REST→tRPC migration, list/calendar views, public read-only boards
**Commit:** `3d060ea`
- NestJS + tRPC over Express (`/api/trpc`), Drizzle ORM + Postgres
- Full database schema: users, boards, board_members, board_columns, tasks, task_assignees, comments, refresh_tokens, board_shares, notifications
- Auth: register/login/refresh/logout/me via JWT access+refresh httpOnly cookies, bcrypt hashing
- Google/GitHub OAuth callbacks (passport)
- tRPC routers: boards, columns, tasks, auth, shares, notifications
- Boards service: CRUD, duplicate, favorite, archive/status, columns, tasks CRUD+move, assignees
- Web: Next.js 16 App Router, dashboard, board view, list view, calendar view, notifications, my-tasks, auth, public `/s/[token]` share page
- tRPC client + React Query, kanban drag-and-drop with optimistic updates, task modal
- UI package (`@flow/ui`): primitives, layout, feedback, icons, kanban, hooks
- Shared (`@flow/shared`): zod schemas for auth, boards, users, realtime messages
- Tests: vitest for auth service, middleware, utils, users service (44 tests)
- Infra: docker-compose, Dockerfile.dev, turbo, pnpm workspace

### Phase 2: WebSocket real-time collaboration + smart notifications
**Commit:** `89e8218`
- Server: `RealtimeService` (WS on `/ws`), cookie auth, presence tracking, `task.moved` broadcast, heartbeat
- `NotificationsService` (create/findAll/unreadCount/markRead/markAllRead), kinds: moved/created/assigned/comment/mention
- Notifications tRPC router
- Web: `useRealtime` hook (WS client, reconnect, subscribe/unsubscribe, presence, task.moved optimistic + toast), `useRealtimeStatus`, notifications page, unread bell in sidebar

### Phase 3: Comments & Separate Checklist Table
**Status:** Complete
- New `task_checklists` table (migration `0003_task_checklists.sql`): id, task_id FK, done, total, updated_at
- Dropped `checklist_done`/`checklist_total` columns from `tasks`
- Shared `Task` type: replaced inline `checklist: {done,total}` with `checklistId: string | null`
- New shared `Checklist` type: `{ id, taskId, done, total, updatedAt }` + `SetChecklist` input schema
- Server: `ChecklistsService` (get/set with board-membership guard), `CommentsService` (create/findAll with board-membership guard)
- tRPC routers: `comments` (create, getAll), `checklists` (set, get)
- `boards.service.ts`: `loadBoardDetail`/`mapTask` now load comments + checklistId per task
- `realtime.service.ts`: `comment.created` WebSocket broadcast + notification to assignees (except author)
- Shared realtime messages: added `comment.created` to `ClientMessage` and `ServerMessage`
- Client: `useComments`, `useAddComment`, `useChecklist`, `useSetChecklist` hooks (React Query)
- `task-modal.tsx`: replaced local mock comment/checklist logic with server mutations; renders real comments from server
- `useRealtime.ts`: handles `comment.created` inbound (invalidates comments cache + toast)
- Typecheck: passes (server, shared, web)
- Lint: passes (0 errors)
- Tests: 44 existing tests pass

## In Progress

### Phase 4: Board Membership & Real User Profiles
**Status:** Complete
- Board members tRPC router + service (list/add/remove, owner-guarded)
- `users.getById` endpoint for resolving real user profiles
- Fully replaced `mock-data.ts` with server-fetched data across boards-store, boards-home, my-tasks, sidebar, app-shell, task-modal, board-view, task-card
- Wired "Invite" chip → real add-member flow (input + `members.add` mutation)
- Deleted `mock-data.ts`
- Added `useUsers` hook for batch user resolution
- Typecheck: passes (server, shared, web)
- Lint: passes (0 errors)
- Tests: 44 existing tests pass

## Remaining Phases

### Phase 5: Password Reset, Email Verification & SMTP (Resend)
**Status:** In Progress
- Add `resend` dependency, env vars: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `verification_tokens` table + `email_verified` column on `users`
- `EmailService` using Resend (console.log fallback if API key missing)
- Auth flows: forgot-password, reset-password, verify-email, resend-verification, change-password
- tRPC routers for email auth flows
- UI pages: `/forgot-password`, `/reset-password/[token]`, `/verify-email`, `/settings/password`
- "Verify your email" banner for unverified users (unverified users can still log in)

### Phase 6: Real-time Comments + Full Test Coverage
- WebSocket comment broadcast already implemented in Phase 3
- Vitest coverage for boards/columns/tasks/members/notifications/realtime services and tRPC routers
- Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`

## Production Readiness Checklist
- [ ] Database migrations applied (`0000` through `0003`)
- [ ] `RESEND_API_KEY` set in production environment
- [ ] `JWT_SECRET` set to strong random value in production
- [ ] `pnpm build` passes for all packages
- [ ] `pnpm typecheck` passes for all packages
- [ ] `pnpm lint` passes with 0 errors
- [ ] `pnpm test` passes
- [ ] Auth e2e: register → verify email → login → password reset
- [ ] WebSocket presence + comments working in multi-client scenario

## Key Files Modified (Phase 3)
- `apps/server/src/db/migrations/0003_task_checklists.sql` (new)
- `apps/server/src/db/schema.ts` (task_checklists table, dropped checklist columns)
- `apps/server/src/checklists/{module,service}.ts` (new)
- `apps/server/src/comments/{module,service}.ts` (new)
- `apps/server/src/trpc/routers/{comments,checklists}.ts` (new)
- `apps/server/src/trpc/router.ts` (registered new routers)
- `apps/server/src/app.module.ts` (imported new modules)
- `apps/server/src/boards/boards.service.ts` (load comments + checklistId)
- `apps/server/src/realtime/realtime.service.ts` (comment.created broadcast)
- `packages/shared/src/schemas/boards/task.ts` (checklistId, removed inline checklist)
- `packages/shared/src/schemas/boards/checklist.ts` (new)
- `packages/shared/src/schemas/index.ts` (export checklist)
- `packages/shared/src/schemas/realtime/messages.ts` (comment.created)
- `apps/web/src/hooks/queries/boards.ts` (comments/checklists hooks)
- `apps/web/src/components/dashboard/task-modal.tsx` (server mutations, real comments)
- `apps/web/src/hooks/useRealtime.ts` (comment.created handling)
- `apps/web/tsconfig.json` (path mapping for `@flow/server/trpc`)
