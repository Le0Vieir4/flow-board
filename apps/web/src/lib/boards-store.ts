import { useSyncExternalStore } from "react";
import type { Board, BoardStatus, TagType, Task, Column } from "@flow/shared";
import { useBoards as useBoardsQuery, useBoard as useBoardQuery } from "@/hooks/queries/boards";

interface PresenceMap {
  [boardId: string]: { [userId: string]: boolean };
}

const EMPTY_PRESENCE: PresenceMap[string] = {};

let presence: PresenceMap = {};
const listeners = new Set<() => void>();

function emit() {
  for (const fn of listeners) fn();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useBoards() {
  return useBoardsQuery();
}

export function useBoard(id: string | undefined) {
  return useBoardQuery(id);
}

export function usePresence(boardId: string | undefined) {
  return useSyncExternalStore(
    subscribe,
    () => (boardId ? (presence[boardId] ?? EMPTY_PRESENCE) : EMPTY_PRESENCE),
    () => (boardId ? (presence[boardId] ?? EMPTY_PRESENCE) : EMPTY_PRESENCE)
  );
}

export function setPresence(boardId: string, userId: string, online: boolean) {
  if (presence[boardId]?.[userId] === online) return;
  presence = { ...presence, [boardId]: { ...presence[boardId], [userId]: online } };
  emit();
}

export function applyInboundMove() {
  // Presence-only store; board mutations flow through tRPC.
}

export function boardStatus(board: Board): BoardStatus {
  return board.status;
}

export type { Board, BoardStatus, TagType, Task, Column };
