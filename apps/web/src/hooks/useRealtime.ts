import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ServerMessage } from "@flow/shared";
import { applyInboundMove, setPresence } from "@/lib/boards-store";
import { pushToast } from "@/lib/toast-store";
import { userById } from "@/lib/mock-data";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws";

export type RealtimeStatus = "connecting" | "live" | "offline";

let clientId = "";
let socket: WebSocket | null = null;
let desiredBoard: string | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let retries = 0;
let failed = false;
let manualClose = false;

let invalidateNotifications: (() => void) | null = null;

export function setNotificationsInvalidator(fn: () => void) {
  invalidateNotifications = fn;
}

const listeners = new Set<() => void>();

function emitStatus() {
  for (const fn of listeners) fn();
}

function getStatus(): RealtimeStatus {
  if (!socket || failed) return "offline";
  return socket.readyState === WebSocket.OPEN ? "live" : "connecting";
}

function subscribeStatus(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useRealtimeStatus(): RealtimeStatus {
  const [status, setStatus] = useState<RealtimeStatus>(getStatus());
  useEffect(() => {
    const unsub = subscribeStatus(() => setStatus(getStatus()));
    return () => {
      unsub();
    };
  }, []);
  return status;
}

function connect() {
  if (manualClose || (socket && socket.readyState !== WebSocket.CLOSED)) return;
  socket = new WebSocket(WS_URL);
  socket.onopen = () => {
    retries = 0;
    failed = false;
    emitStatus();
    if (desiredBoard) send({ type: "subscribe", clientId, boardId: desiredBoard });
  };
  socket.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data as string);
      if (!parsed || typeof parsed !== "object") return;
      handleInbound(parsed as ServerMessage);
    } catch {
      return;
    }
  };
  socket.onclose = () => {
    emitStatus();
    if (manualClose) return;
    if (retries >= 3) failed = true;
    const delay = Math.min(1000 * 2 ** retries, 15000);
    retries += 1;
    reconnectTimer = setTimeout(connect, delay);
    emitStatus();
  };
  socket.onerror = () => socket?.close();
}

function send(message: Record<string, unknown>) {
  if (socket && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
}

function handleInbound(msg: unknown) {
  const m = msg as ServerMessage;
  switch (m.type) {
    case "task.moved":
      if (m.taskId !== undefined && m.toColumnId) {
        applyInboundMove(m.boardId, m.taskId, m.toColumnId);
        const actor = m.userId ? userById(m.userId) : undefined;
        pushToast({
          title: `Task moved to ${m.toColumnName}`,
          body: m.taskLabel ? `${m.userName ?? "Someone"} · ${m.taskLabel}` : m.userName ?? "Someone",
          time: "Just now",
          userColor: actor?.color,
        });
        invalidateNotifications?.();
      }
      break;
    case "presence":
      if (m.userId) setPresence(m.boardId, m.userId, !!m.online);
      break;
    default:
      break;
  }
}

export function useRealtime(boardId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    setNotificationsInvalidator(() => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    });
  }, [queryClient]);

  useEffect(() => {
    clientId = clientId || `c-${Math.random().toString(36).slice(2, 10)}`;
    desiredBoard = boardId ?? null;
    manualClose = false;
    connect();
    if (boardId) {
      send({ type: "subscribe", clientId, boardId });
    }
    return () => {
      if (boardId) send({ type: "unsubscribe", clientId, boardId });
    };
  }, [boardId]);
}

export function announceTaskMove(boardId: string, taskId: number, toColumnId: string) {
  send({ type: "task.moved", clientId, boardId, taskId, toColumnId });
}

export function closeRealtime() {
  manualClose = true;
  if (reconnectTimer) clearTimeout(reconnectTimer);
  socket?.close();
  socket = null;
}
