"use client";

import { type ReactNode, type HTMLAttributes, type CSSProperties } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icons } from "../icons";

const toastVariants = cva(
  "animate-toast-in pointer-events-auto flex items-start gap-3 rounded-xl border border-white/9 bg-panel-2 p-4 shadow-toast",
  {
    variants: {
      variant: {
        default: "",
        success: "border-success/30",
        error: "border-error/30",
        warning: "border-warning/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ToastProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  title: string;
  body?: string;
  time?: string;
  icon?: ReactNode;
  userColor?: string;
  onClose?: () => void;
}

function getGradientStyle(color: string): CSSProperties {
  const hex = color.replace("#", "");
  const matches = hex.match(/[0-9a-f]{2}/g);
  if (!matches) return { background: "var(--color-toast-gradient-start, #5b76ff) var(--color-toast-gradient-end, #3f56e8)" };
  const darkened = matches.map((c) => Math.max(0, parseInt(c, 16) - 30).toString(16).padStart(2, "0")).join("");
  return { background: `linear-gradient(135deg, ${color}, #${darkened})` };
}

export function Toast({ title, body, time, icon, userColor, variant = "default", onClose, className, ...props }: ToastProps) {
  const iconStyle: CSSProperties = userColor ? getGradientStyle(userColor) : { background: "var(--color-toast-gradient-start, #5b76ff) var(--color-toast-gradient-end, #3f56e8)" };

  return (
    <div className={cn(toastVariants({ variant, className }))} {...props}>
      <span className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white" style={iconStyle}>
        {icon || <Icons.SendIcon size={13} />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-label font-semibold text-foreground">{title}</div>
        {body && <div className="mt-1 truncate text-meta text-muted">{body}</div>}
        {time && <div className="mt-1 text-micro text-muted-foreground">{time}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="flex-shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Icons.CloseIcon size={14} />
        </button>
      )}
    </div>
  );
}