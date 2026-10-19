"use client";

import { useToastStore } from "../../hooks/useToastStore";
import { Toast, type ToastProps } from "./Toast";

export function ToastStack() {
  const { toasts, dismiss } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-6 bottom-6 z-[60] flex w-[var(--toast-width)] max-w-[calc(100vw-3rem)] flex-col gap-2.5"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          body={toast.body}
          time={toast.time}
          icon={toast.icon}
          userColor={toast.userColor}
          variant={toast.variant}
          onClose={() => dismiss(toast.id)}
        />
      ))}
    </div>
  );
}