import type { Board, Task, User } from "@flow/shared";

const now = Date.now();
const min = 60_000;

function t(minsAgo: number) {
  return new Date(now - minsAgo * min).toISOString();
}

export const TEAM: User[] = [
  { id: "u-you", name: "Alex Rivera", email: "alex@flowboard.app", color: "#4f6bff", username: "alexr", avatar: null, role: "USER", isActive: true, createdAt: t(90 * 24 * 60), updatedAt: t(90 * 24 * 60) },
  { id: "u-maria", name: "Maria Chen", email: "maria@flowboard.app", color: "#8b6cf5", username: "mariac", avatar: null, role: "USER", isActive: true, createdAt: t(90 * 24 * 60), updatedAt: t(90 * 24 * 60) },
  { id: "u-david", name: "David Kim", email: "david@flowboard.app", color: "#34c77b", username: "davidk", avatar: null, role: "USER", isActive: true, createdAt: t(90 * 24 * 60), updatedAt: t(90 * 24 * 60) },
  { id: "u-anika", name: "Anika Patel", email: "anika@flowboard.app", color: "#e2924a", username: "anikap", avatar: null, role: "USER", isActive: true, createdAt: t(90 * 24 * 60), updatedAt: t(90 * 24 * 60) },
  { id: "u-tom", name: "Tom Weber", email: "tom@flowboard.app", color: "#6d8bff", username: "tomw", avatar: null, role: "USER", isActive: true, createdAt: t(90 * 24 * 60), updatedAt: t(90 * 24 * 60) },
];

export const devUser = TEAM[0];

export const MOCK_BOARDS: Board[] = [
  {
    id: "b-launch",
    name: "Product Launch v2",
    idPrefix: "FB",
    favorite: true,
    status: "active",
    members: ["u-you", "u-maria", "u-david", "u-anika"],
    updatedAt: t(2),
    columns: [
      {
        id: "c-backlog",
        name: "Backlog",
        tasks: [
          {
            id: 129,
            label: "FB-129",
            title: "Refactor Auth Flow",
            description:
              "Move the login/register forms onto the new token refresh strategy. The current flow drops sessions after an hour of idle.",
            tag: "electric",
            assignees: ["u-david"],
            createdAt: t(6 * 24 * 60),
          },
          {
            id: 130,
            label: "FB-130",
            title: "Finalize UI Kit for Settings",
            description:
              "Settings surfaces still mix field styles. Lock the input, select and toggle variants from the design system before the marketing site ships.",
            tag: "medium",
            assignees: ["u-anika"],
            createdAt: t(5 * 24 * 60),
          },
          {
            id: 131,
            label: "FB-131",
            title: "Improve Onboarding Experience",
            description:
              "First-run feels empty. Add a guided board template picker and a one-time tour of columns, tags and invites.",
            tag: "low",
            assignees: [],
            createdAt: t(4 * 24 * 60),
          },
        ],
      },
      {
        id: "c-todo",
        name: "Todo",
        tasks: [
          {
            id: 132,
            label: "FB-132",
            title: "Dashboard Redesign",
            description:
              "The boards home needs live previews so teams can see movement at a glance. Wall-style sections grouped by project state.",
            tag: "design",
            assignees: ["u-maria", "u-tom"],
            createdAt: t(3 * 24 * 60),
          },
          {
            id: 133,
            label: "FB-133",
            title: "Implement Notifications",
            description:
              "In-app notifications for mentions, task moves and comments. Real-time push is the differentiator — no polling.",
            tag: undefined,
            assignees: ["u-tom"],
            checklist: { done: 2, total: 5 },
            createdAt: t(3 * 24 * 60),
          },
        ],
      },
      {
        id: "c-progress",
        name: "In Progress",
        tasks: [
          {
            id: 134,
            label: "FB-134",
            title: "API Rate Limiting",
            description:
              "Protect the public endpoints with token-bucket limits per user. Burst allowances for websocket-backed boards.",
            tag: "high",
            assignees: ["u-david"],
            checklist: { done: 2, total: 3 },
            dueDate: "2026-08-07",
            createdAt: t(2 * 24 * 60),
            comments: [
              {
                id: "c1",
                userId: "u-maria",
                body: "Can we ship the burst window at 60/s for now? The realtime tests only need that much.",
                at: t(3 * 60),
              },
              {
                id: "c2",
                userId: "u-david",
                body: "Done — bucket at 60/s, burst 90. Rolling out to staging tomorrow.",
                at: t(1 * 60),
              },
            ],
          },
          {
            id: 135,
            label: "FB-135",
            title: "Add Activity Timeline",
            description:
              "A per-board timeline of moves, creations and comments. Feeds the toast stream and the notifications surface later.",
            tag: "medium",
            assignees: ["u-maria"],
            checklist: { done: 1, total: 4 },
            createdAt: t(2 * 24 * 60),
          },
          {
            id: 136,
            label: "FB-136",
            title: "File Attachments",
            description:
              "Drag a file onto a task to attach it. Preview images inline; everything else opens in a new tab.",
            tag: "low",
            assignees: ["u-you"],
            checklist: { done: 0, total: 3 },
            createdAt: t(1 * 24 * 60),
          },
        ],
      },
      {
        id: "c-review",
        name: "Review",
        tasks: [
          {
            id: 137,
            label: "FB-137",
            title: "Mobile Responsiveness",
            description:
              "Boards must stay usable at 360px. Sidebar becomes a drawer, columns scroll horizontally.",
            tag: "design",
            assignees: ["u-maria", "u-you"],
            checklist: { done: 2, total: 2 },
            dueDate: "2026-08-05",
            createdAt: t(20 * 60),
            comments: [
              {
                id: "c3",
                userId: "u-you",
                body: "Drawer animation feels good on iOS. One nit: the drag handle should stay within the safe area.",
                at: t(45),
              },
            ],
          },
          {
            id: 138,
            label: "FB-138",
            title: "Performance Optimization",
            description:
              "Reduce re-render churn on task cards during live updates. Memoize card content; keep columns virtualized beyond 40 cards.",
            tag: "high",
            assignees: ["u-david"],
            checklist: { done: 1, total: 3 },
            createdAt: t(18 * 60),
          },
        ],
      },
      {
        id: "c-done",
        name: "Done",
        tasks: [
          {
            id: 139,
            label: "FB-139",
            title: "Seed Data",
            description: "Demo workspace data for the first-run experience.",
            tag: "low",
            assignees: ["u-tom"],
            createdAt: t(5 * 24 * 60),
          },
          {
            id: 140,
            label: "FB-140",
            title: "Fix Board Actions",
            description:
              "Column menu actions were unreachable from the keyboard. Reworked as a plain menu with full arrow-key support.",
            tag: "low",
            assignees: ["u-anika"],
            checklist: { done: 2, total: 2 },
            createdAt: t(4 * 24 * 60),
          },
        ],
      },
    ],
  },
  {
    id: "b-eng",
    name: "Engineering Backlog",
    idPrefix: "EB",
    favorite: false,
    status: "active",
    members: ["u-you", "u-david", "u-tom"],
    updatedAt: t(26),
    columns: [
      {
        id: "c-e-backlog",
        name: "Backlog",
        tasks: [
          {
            id: 1,
            label: "EB-1",
            title: "Upgrade Drizzle to 0.38",
            description: "Picks up the new generated columns API and faster migrations.",
            tag: "medium",
            assignees: ["u-david"],
            createdAt: t(9 * 24 * 60),
          },
          {
            id: 2,
            label: "EB-2",
            title: "CI cache for pnpm store",
            description: "Turbo cache hits went from 40% to 90% locally; replicate in CI.",
            tag: "low",
            assignees: [],
            createdAt: t(8 * 24 * 60),
          },
          {
            id: 3,
            label: "EB-3",
            title: "WebSocket reconnect backoff",
            description: "Exponential backoff with jitter on the realtime channel.",
            tag: "high",
            assignees: ["u-tom"],
            createdAt: t(7 * 24 * 60),
          },
        ],
      },
      {
        id: "c-e-todo",
        name: "Todo",
        tasks: [
          {
            id: 4,
            label: "EB-4",
            title: "Type-check shared package in CI",
            tag: "low",
            assignees: [],
            createdAt: t(6 * 24 * 60),
          },
        ],
      },
      {
        id: "c-e-progress",
        name: "In Progress",
        tasks: [
          {
            id: 5,
            label: "EB-5",
            title: "Rate limiting middleware",
            tag: "high",
            assignees: ["u-david"],
            checklist: { done: 2, total: 4 },
            createdAt: t(30 * 60),
          },
          {
            id: 6,
            label: "EB-6",
            title: "Session cookie hardening",
            tag: "medium",
            assignees: ["u-you"],
            checklist: { done: 1, total: 2 },
            createdAt: t(28 * 60),
          },
        ],
      },
    ],
  },
  {
    id: "b-marketing",
    name: "Marketing Campaigns",
    idPrefix: "MC",
    favorite: false,
    status: "active",
    members: ["u-maria", "u-anika"],
    updatedAt: t(3 * 60 * 24),
    columns: [
      {
        id: "c-m-planning",
        name: "Planning",
        tasks: [
          {
            id: 1,
            label: "MC-1",
            title: "Q3 launch announcement",
            description: "Coordinated release note + social burst for the realtime push.",
            tag: "electric",
            assignees: ["u-maria"],
            createdAt: t(12 * 24 * 60),
          },
          {
            id: 2,
            label: "MC-2",
            title: "Case study: launch week",
            tag: "design",
            assignees: ["u-anika"],
            createdAt: t(11 * 24 * 60),
          },
          {
            id: 3,
            label: "MC-3",
            title: "Newsletter segment refresh",
            tag: "low",
            assignees: [],
            createdAt: t(10 * 24 * 60),
          },
        ],
      },
      {
        id: "c-m-progress",
        name: "In Progress",
        tasks: [
          {
            id: 4,
            label: "MC-4",
            title: "Community AMA prep",
            description: "Collect questions from the beta channel, draft answers with the team.",
            tag: "medium",
            assignees: ["u-maria"],
            checklist: { done: 1, total: 3 },
            createdAt: t(4 * 24 * 60),
          },
        ],
      },
    ],
  },
  {
    id: "b-mobile",
    name: "Mobile App Redesign",
    idPrefix: "MA",
    favorite: false,
    status: "on-hold",
    members: ["u-you", "u-maria"],
    updatedAt: t(14 * 24 * 60),
    columns: [
      {
        id: "c-ma-discovery",
        name: "Discovery",
        tasks: [
          {
            id: 1,
            label: "MA-1",
            title: "Competitive teardown",
            tag: "design",
            assignees: ["u-maria"],
            createdAt: t(30 * 24 * 60),
          },
          {
            id: 2,
            label: "MA-2",
            title: "User interviews (6)",
            tag: "medium",
            assignees: [],
            createdAt: t(28 * 24 * 60),
          },
          {
            id: 3,
            label: "MA-3",
            title: "Navigation IA draft",
            tag: "design",
            assignees: ["u-you"],
            createdAt: t(26 * 24 * 60),
          },
        ],
      },
      {
        id: "c-ma-todo",
        name: "Todo",
        tasks: [
          {
            id: 4,
            label: "MA-4",
            title: "Prototype: board on 360px",
            description: "Paused until the desktop board view stabilizes.",
            tag: "low",
            assignees: [],
            createdAt: t(20 * 24 * 60),
          },
        ],
      },
    ],
  },
  {
    id: "b-retro",
    name: "Q1 Retrospective",
    idPrefix: "QR",
    favorite: false,
    status: "archived",
    members: ["u-you", "u-maria", "u-david", "u-anika", "u-tom"],
    updatedAt: t(60 * 24 * 60),
    columns: [
      {
        id: "c-r-actions",
        name: "Actions",
        tasks: [
          {
            id: 1,
            label: "QR-1",
            title: "Weekly demo cadence",
            tag: "low",
            assignees: [],
            createdAt: t(90 * 24 * 60),
          },
          {
            id: 2,
            label: "QR-2",
            title: "Reduce meeting load",
            tag: "low",
            assignees: [],
            createdAt: t(90 * 24 * 60),
          },
        ],
      },
    ],
  },
];

export const SECTIONS: { key: Board["status"]; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "on-hold", label: "On hold" },
  { key: "archived", label: "Archived" },
];

export function userById(id: string): User {
  return TEAM.find((u) => u.id === id) ?? devUser;
}

import type { Column } from "@flow/shared";

export function nextLabel(board: Board): string {
  const max = board.columns.reduce((acc: number, c: Column) => Math.max(acc, ...c.tasks.map((t: Task) => t.id)), 0);
  return `${board.idPrefix}-${max + 1}`;
}

export function nextTaskId(board: Board): number {
  return board.columns.reduce((acc: number, c: Column) => Math.max(acc, ...c.tasks.map((t: Task) => t.id)), 0) + 1;
}

export function countTasks(board: Board): number {
  return board.columns.reduce((acc: number, c: Column) => acc + c.tasks.length, 0);
}

export function latestTask(board: Board): Task | undefined {
  let latest: Task | undefined;
  for (const c of board.columns)
    for (const t of c.tasks) if (!latest || t.createdAt > latest.createdAt) latest = t;
  return latest;
}
