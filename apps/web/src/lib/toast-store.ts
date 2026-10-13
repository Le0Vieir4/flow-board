import { useSyncExternalStore } from "react";

export interface Toast {
  id: number;
  title: string;
  body?: string;
  time: string;
  userColor?: string;
}

let toasts: Toast[] = [];
let seq = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const fn of listeners) fn();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useToasts() {
  return useSyncExternalStore(subscribe, () => toasts, () => toasts);
}

export function pushToast(toast: Omit<Toast, "id">) {
  const id = ++seq;
  toasts = [...toasts, { ...toast, id }];
  emit();
  window.setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 5200);
}

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}
