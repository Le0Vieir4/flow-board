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
      <div className="bg-panel border border-line rounded-lg p-6 w-full max-w-[420px] mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-headline font-bold">Keyboard Shortcuts</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-badge text-muted-foreground hover:bg-white/6 hover:text-foreground"
            aria-label="Close shortcuts"
          >
            <Icons.CloseIcon size={18} />
          </button>
        </div>
        <div className="space-y-3">
          {SHORTCUTS.map((s) => (
            <div key={s.key} className="flex items-center gap-3 px-3 py-2.5 rounded-button bg-white/3">
              <kbd className="flex-shrink-0 items-center gap-1.5 rounded-tag border border-line bg-white/5 px-2.5 py-1 text-label font-medium text-foreground">
                {s.key}
              </kbd>
              <span className="text-label text-muted">{s.description}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-meta-small text-muted-foreground text-center">
          Press <kbd className="rounded-sm border border-line bg-white/5 px-1.5 py-0.5 text-micro font-medium">?</kbd> again to close
        </p>
      </div>
    </div>
  );
}