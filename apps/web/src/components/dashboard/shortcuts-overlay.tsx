"use client";

import { useEffect } from "react";
import { Icons } from "@flow/ui/icons";

interface Shortcut {
  key: string;
  description: string;
}

const SHORTCUTS: Shortcut[] = [
  { key: "?", description: "Show keyboard shortcuts" },
  { key: "n", description: "Create new board" },
  { key: "b", description: "Go to Boards" },
  { key: "t", description: "Go to My Tasks" },
  { key: "i", description: "Go to Notifications" },
  { key: "/", description: "Search (coming soon)" },
];

export function ShortcutsOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "?") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-panel border border-line rounded-[14px] p-6 w-full max-w-[420px] mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-bold">Keyboard Shortcuts</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
            aria-label="Close shortcuts"
          >
            <Icons.CloseIcon size={18} />
          </button>
        </div>
        <div className="space-y-3">
          {SHORTCUTS.map((s) => (
            <div key={s.key} className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] bg-white/[0.03]">
              <kbd className="flex-shrink-0 items-center gap-1.5 rounded-[6px] border border-line bg-white/[0.05] px-2.5 py-1 text-[12px] font-medium text-foreground">
                {s.key}
              </kbd>
              <span className="text-[13.5px] text-muted">{s.description}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[12px] text-muted-foreground text-center">
          Press <kbd className="rounded-[4px] border border-line bg-white/[0.05] px-1.5 py-0.5 text-[11px] font-medium">?</kbd> again to close
        </p>
      </div>
    </div>
  );
}