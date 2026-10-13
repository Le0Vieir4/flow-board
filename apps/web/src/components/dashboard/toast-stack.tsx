"use client";

import { useToasts } from "@/lib/toast-store";
import { Icons } from "@flow/ui/icons";

function darken(hex: string, amount = 30): string {
  const n = hex.replace("#", "");
  const c = (i: number) => Math.max(0, parseInt(n.slice(i, i + 2), 16) - amount);
  return `rgb(${c(0)}, ${c(2)}, ${c(4)})`;
}

export function ToastStack() {
  const toasts = useToasts();
  if (toasts.length === 0) return null;
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-6 bottom-6 z-[60] flex w-[340px] max-w-[calc(100vw-3rem)] flex-col gap-2.5"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-toast-in pointer-events-auto flex items-start gap-3 rounded-xl border border-white/[0.09] bg-panel-2 p-[13px] shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
        >
          <span
            className="mt-[1px] flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white"
            style={{
              background: t.userColor
                ? `linear-gradient(135deg, ${t.userColor}, ${darken(t.userColor)})`
                : "linear-gradient(135deg, #5b76ff, #3f56e8)",
            }}
          >
            <Icons.SendIcon size={13} />
          </span>
          <div className="min-w-0">
            <div className="text-[13px] leading-snug font-semibold text-foreground">{t.title}</div>
            <div className="mt-[2px] truncate text-[12px] leading-snug text-muted">{t.body}</div>
            <div className="mt-[3px] text-[10.5px] text-muted-foreground">{t.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
