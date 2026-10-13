import { useSyncExternalStore } from "react";
import { MOCK_BOARDS } from "./mock-data";

/**
 * In-UI notification feed. Fed by realtime inbound activity and demo seeds.
 * Client-side in-memory until persistence lands — same contract as
 * boards-store: swap the internals when the API arrives.
 */

export type NotificationKind = "moved" | "created" | "assigned" | "comment" | "mention";

export interface AppNotification {
  id: number;
  kind: NotificationKind;
  actorId: string;
  boardId: string;
  taskId?: number;
  taskLabel?: string;
  taskTitle?: string;
  columnName?: string;
  at: string;
  read: boolean;
}

const MAX_KEPT = 50;

/* ---- demo seed helpers (must precede store init: seed() runs at import) ---- */

const min = 60_000;

function t(minsAgo: number) {
  return new Date(Date.now() - minsAgo * min).toISOString();
}

function seedTask(boardId: string, taskId: number): { label: string; title: string } {
  const board = MOCK_BOARDS.find((b) => b.id === boardId);
  const column = board?.columns.find((c: { tasks: { id: number }[] }) => c.tasks.some((x: { id: number }) => x.id === taskId));
  const task = column?.tasks.find((x: { id: number }) => x.id === taskId);
  return { label: task?.label ?? `${board?.idPrefix ?? "FB"}-${taskId}`, title: task?.title ?? "" };
}

function seed(): AppNotification[] {
  const fb134 = seedTask("b-launch", 134);
  const eb6 = seedTask("b-eng", 6);
  const fb133 = seedTask("b-launch", 133);
  const fb130 = seedTask("b-launch", 130);
  const fb140 = seedTask("b-launch", 140);

  return [
    {
      id: -5,
      kind: "moved",
      actorId: "u-david",
      boardId: "b-launch",
      taskId: 134,
      taskLabel: fb134.label,
      taskTitle: fb134.title,
      columnName: "Review",
      at: t(38),
      read: false,
    },
    {
      id: -4,
      kind: "assigned",
      actorId: "u-tom",
      boardId: "b-eng",
      taskId: 6,
      taskLabel: eb6.label,
      taskTitle: eb6.title,
      at: t(4 * 60),
      read: false,
    },
    {
      id: -3,
      kind: "created",
      actorId: "u-maria",
      boardId: "b-launch",
      taskId: 133,
      taskLabel: fb133.label,
      taskTitle: fb133.title,
      at: t(6 * 60),
      read: true,
    },
    {
      id: -2,
      kind: "comment",
      actorId: "u-anika",
      boardId: "b-launch",
      taskId: 130,
      taskLabel: fb130.label,
      taskTitle: fb130.title,
      at: t(26 * 60),
      read: true,
    },
    {
      id: -1,
      kind: "mention",
      actorId: "u-david",
      boardId: "b-launch",
      taskId: 140,
      taskLabel: fb140.label,
      taskTitle: fb140.title,
      at: t(49 * 60),
      read: true,
    },
  ];
}

let notifications: AppNotification[] = seed();
let seq = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const fn of listeners) fn();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useNotifications(): AppNotification[] {
  return useSyncExternalStore(subscribe, () => notifications, () => notifications);
}

export function useUnreadCount(): number {
  return useSyncExternalStore(
    subscribe,
    () => notifications.reduce((acc, n) => acc + (n.read ? 0 : 1), 0),
    () => notifications.reduce((acc, n) => acc + (n.read ? 0 : 1), 0)
  );
}

export function pushNotification(partial: Omit<AppNotification, "id" | "read">) {
  const next: AppNotification = { ...partial, id: ++seq, read: false };
  notifications = [next, ...notifications].slice(0, MAX_KEPT);
  emit();
}

export function markRead(id: number) {
  notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  emit();
}

export function markAllRead() {
  if (notifications.every((n) => n.read)) return;
  notifications = notifications.map((n) => ({ ...n, read: true }));
  emit();
}
