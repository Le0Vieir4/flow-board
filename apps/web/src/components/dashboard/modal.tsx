"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Icons } from "@flow/ui/icons";

export function Modal({
  onClose,
  children,
  width = "max-w-[560px]",
}: {
  onClose: () => void;
  children: ReactNode;
  width?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
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
        className={`relative z-10 flex max-h-[85dvh] w-full ${width} flex-col overflow-hidden rounded-[14px] border border-white/[0.09] bg-panel-2 shadow-[0_30px_60px_rgba(0,0,0,0.55)]`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
        >
          <Icons.CloseIcon size={15} />
        </button>
        {children}
      </div>
    </div>
  );
}
