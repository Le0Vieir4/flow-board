import { useSyncExternalStore } from "react";
import type { Board, BoardStatus, TagType, Task, Column } from "@flow/shared";
import { MOCK_BOARDS, devUser, nextLabel, nextTaskId } from "./mock-data";

interface PresenceMap {
  [boardId: string]: { [userId: string]: boolean };
}

interface BoardState {
  boards: Board[];
  presence: PresenceMap;
}

function seedPresence(): PresenceMap {
  const map: PresenceMap = {};
  for (const b of MOCK_BOARDS) {
    map[b.id] = {};
    for (const id of b.members) if (id !== devUser.id) map[b.id][id] = true;
  }
  return map;
}

let state: BoardState = { boards: MOCK_BOARDS, presence: seedPresence() };
const listeners = new Set<() => void>();

function emit() {
  for (const fn of listeners) fn();
}

function set(updater: (prev: BoardState) => BoardState) {
  state = updater(state);
  emit();
}

function patchBoard(id: string, patch: Partial<Board>) {
  set((prev) => ({
    ...prev,
    boards: prev.boards.map((b) => (b.id === id ? { ...b, ...patch, updatedAt: patch.updatedAt ?? b.updatedAt } : b)),
  }));
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useBoards() {
  return useSyncExternalStore(subscribe, () => state.boards, () => state.boards);
}

export function useBoard(id: string | undefined) {
  return useSyncExternalStore(
    subscribe,
    () => state.boards.find((b) => b.id === id),
    () => state.boards.find((b) => b.id === id)
  );
}

const EMPTY_PRESENCE: PresenceMap[string] = {};

export function usePresence(boardId: string | undefined) {
  return useSyncExternalStore(
    subscribe,
    () => (boardId ? (state.presence[boardId] ?? EMPTY_PRESENCE) : EMPTY_PRESENCE),
    () => (boardId ? (state.presence[boardId] ?? EMPTY_PRESENCE) : EMPTY_PRESENCE)
  );
}

export function useWorkspace() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

/* ---- board actions ---- */

export function createBoard(name: string) {
  const id = `b-${Math.random().toString(36).slice(2, 8)}`;
  const prefix = name
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2) || "FB";
  const board: Board = {
    id,
    name,
    idPrefix: prefix,
    favorite: false,
    status: "active",
    members: [devUser.id],
    updatedAt: new Date().toISOString(),
    columns: [
      { id: `${id}-c1`, name: "Backlog", tasks: [] },
      { id: `${id}-c2`, name: "Todo", tasks: [] },
      { id: `${id}-c3`, name: "In Progress", tasks: [] },
    ],
  };
  set((prev) => ({ ...prev, boards: [board, ...prev.boards] }));
  return board;
}

export function toggleFavorite(boardId: string) {
  const board = state.boards.find((b) => b.id === boardId);
  if (board) patchBoard(boardId, { favorite: !board.favorite });
}

export function renameBoard(boardId: string, name: string) {
  patchBoard(boardId, { name });
}

/* ---- column actions ---- */

export function addColumn(boardId: string, name: string) {
  set((prev) => ({
    ...prev,
    boards: prev.boards.map((b) =>
      b.id === boardId
        ? { ...b, updatedAt: new Date().toISOString(), columns: [...b.columns, { id: `${b.id}-c${Date.now()}`, name, tasks: [] }] }
        : b
    ),
  }));
}

export function renameColumn(boardId: string, columnId: string, name: string) {
  set((prev) => ({
    ...prev,
    boards: prev.boards.map((b) =>
      b.id === boardId
        ? { ...b, updatedAt: new Date().toISOString(), columns: b.columns.map((c: Column) => (c.id === columnId ? { ...c, name } : c)) }
        : b
    ),
  }));
}

export function deleteColumn(boardId: string, columnId: string) {
  set((prev) => ({
    ...prev,
    boards: prev.boards.map((b) =>
      b.id === boardId ? { ...b, updatedAt: new Date().toISOString(), columns: b.columns.filter((c: Column) => c.id !== columnId) } : b
    ),
  }));
}

/* ---- task actions ---- */

export function addTask(boardId: string, columnId: string, title: string, tag?: TagType): Task | undefined {
  const board = state.boards.find((b) => b.id === boardId);
  if (!board) return;
  const task: Task = {
    id: nextTaskId(board),
    label: nextLabel(board),
    title,
    tag,
    assignees: [],
    createdAt: new Date().toISOString(),
  };
  set((prev) => ({
    ...prev,
    boards: prev.boards.map((b) =>
      b.id === boardId
        ? {
            ...b,
            updatedAt: new Date().toISOString(),
            columns: b.columns.map((c: Column) => (c.id === columnId ? { ...c, tasks: [...c.tasks, task] } : c)),
          }
        : b
    ),
  }));
  return task;
}

export function moveTask(boardId: string, taskId: number, toColumnId: string) {
  const board = state.boards.find((b) => b.id === boardId);
  if (!board) return;
  const from = board.columns.find((c: Column) => c.tasks.some((t: Task) => t.id === taskId));
  const to = board.columns.find((c: Column) => c.id === toColumnId);
  if (!from || !to || from.id === toColumnId) return;
  const task = from.tasks.find((t: Task) => t.id === taskId);
  if (!task) return;
  set((prev) => ({
    ...prev,
    boards: prev.boards.map((b) =>
      b.id === boardId
        ? {
            ...b,
            updatedAt: new Date().toISOString(),
            columns: b.columns.map((c: Column) => {
              if (c.id === from.id) return { ...c, tasks: c.tasks.filter((t: Task) => t.id !== taskId) };
              if (c.id === to.id) return { ...c, tasks: [...c.tasks, task] };
              return c;
            }),
          }
        : b
    ),
  }));
  return { from: from.name, to: to.name };
}

export function updateTask(boardId: string, taskId: number, patch: Partial<Task>) {
  set((prev) => ({
    ...prev,
    boards: prev.boards.map((b) =>
      b.id === boardId
        ? {
            ...b,
            updatedAt: new Date().toISOString(),
            columns: b.columns.map((c: Column) => ({
              ...c,
              tasks: c.tasks.map((t: Task) => (t.id === taskId ? { ...t, ...patch } : t)),
            })),
          }
        : b
    ),
  }));
}

export function deleteTask(boardId: string, taskId: number) {
  set((prev) => ({
    ...prev,
    boards: prev.boards.map((b) =>
      b.id === boardId
        ? {
            ...b,
            updatedAt: new Date().toISOString(),
            columns: b.columns.map((c: Column) => ({ ...c, tasks: c.tasks.filter((t: Task) => t.id !== taskId) })),
          }
        : b
    ),
  }));
}

/* ---- realtime inbound ---- */

export function applyInboundMove(boardId: string, taskId: number, toColumnId: string) {
  moveTask(boardId, taskId, toColumnId);
}

export function setPresence(boardId: string, userId: string, online: boolean) {
  set((prev) => {
    const current = prev.presence[boardId] ?? {};
    if (current[userId] === online) return prev;
    return { ...prev, presence: { ...prev.presence, [boardId]: { ...current, [userId]: online } } };
  });
}

export function findTaskInBoard(boardId: string, taskId: number) {
  const board = state.boards.find((b) => b.id === boardId);
  if (!board) return undefined;
  for (const column of board.columns) {
    const task = column.tasks.find((t: Task) => t.id === taskId);
    if (task) return { board, column, task };
  }
  return undefined;
}

export function boardStatus(board: Board): BoardStatus {
  return board.status;
}

export function duplicateBoard(boardId: string) {
  const board = state.boards.find((b) => b.id === boardId);
  if (!board) return;
  const newId = `b-${Math.random().toString(36).slice(2, 8)}`;
  const prefix = board.idPrefix;
  const newBoard: Board = {
    ...board,
    id: newId,
    name: `${board.name} (copy)`,
    idPrefix: prefix,
    favorite: false,
    updatedAt: new Date().toISOString(),
    columns: board.columns.map((c) => ({
      ...c,
      id: `${newId}-c${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tasks: [],
    })),
  };
  set((prev) => ({ ...prev, boards: [newBoard, ...prev.boards] }));
  return newBoard;
}

export function archiveBoard(boardId: string) {
  patchBoard(boardId, { status: "archived" });
}

export function deleteBoard(boardId: string) {
  set((prev) => ({
    ...prev,
    boards: prev.boards.filter((b) => b.id !== boardId),
  }));
}

export { nextTaskId } from "./mock-data";
export const boardsState = state;
