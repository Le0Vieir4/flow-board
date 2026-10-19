"use client";

import { useEffect, useRef, type ReactNode, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icons } from "../icons";

const modalVariants = cva(
  "relative z-10 flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-lg border border-white/9 bg-panel-2 shadow-modal",
  {
    variants: {
      size: {
        sm: "max-w-[400px]",
        md: "max-w-[560px]",
        lg: "max-w-[720px]",
        xl: "max-w-[900px]",
        full: "max-w-[95vw]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const overlayVariants = cva("fixed inset-0 z-50 flex items-center justify-center p-5", {
  variants: {
    closable: {
      true: "",
      false: "pointer-events-none",
    },
  },
  defaultVariants: {
    closable: true,
  },
});

export interface ModalProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof modalVariants> {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeButton?: boolean;
}

export function Modal({ open, onClose, title, children, size = "md", closeButton = true, className, ...props }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={cn(overlayVariants({ closable: true }))} {...props}>
      <button
        type="button"
        aria-label="Dismiss dialog"
        className="absolute inset-0 cursor-default bg-black/60"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={cn(modalVariants({ size, className }))}
      >
        {closeButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-badge text-muted-foreground hover:bg-white/6 hover:text-foreground"
          >
            <Icons.CloseIcon size={15} />
          </button>
        )}
        {title && (
          <h2 id="modal-title" className="sr-only">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}