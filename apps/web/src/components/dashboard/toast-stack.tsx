"use client";

import { useToasts } from "@/lib/toast-store";
import { Icons } from "@flow/ui/icons";
import { darken } from "@flow/ui";

export function ToastStack() {
  const toasts = useToasts();
  if (toasts.length === 0) return null;
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-6 bottom-6 z-[60] flex w-[var(--toast-width)] max-w-[calc(100vw-3rem)] flex-col gap-2.5"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-toast-in pointer-events-auto flex items-start gap-3 rounded-xl border border-white/9 bg-panel-2 p-4 shadow-toast"
        >
          <span
            className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white"
            style={{
              background: t.userColor
                ? `linear-gradient(135deg, ${t.userColor}, ${darken(t.userColor)})`
                : "var(--color-toast-gradient-start) var(--color-toast-gradient-end)",
            }}
          >
            <Icons.SendIcon size={13} />
          </span>
          <div className="min-w-0">
            <div className="text-label font-semibold text-foreground">{t.title}</div>
            <div className="mt-1 truncate text-meta text-muted">{t.body}</div>
            <div className="mt-1 text-micro text-muted-foreground">{t.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}