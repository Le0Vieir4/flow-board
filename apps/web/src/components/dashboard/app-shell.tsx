"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useNewBoardModalState } from "@/lib/commands";
import { Icons } from "@flow/ui/icons";
import { SidebarContent, Sidebar } from "./sidebar";
import { NewBoardModal } from "./new-board-modal";
import { ToastStack } from "./toast-stack";
import { ShortcutsOverlay } from "./shortcuts-overlay";

export function AppShell({ children }: { children: ReactNode }) {
  const { open: newBoardOpen, setOpen: setNewBoardOpen } = useNewBoardModalState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" || e.key === "h") {
        e.preventDefault();
        setShortcutsOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-dvh bg-bg">
      <Sidebar onAddBoard={() => setNewBoardOpen(true)} />
      {drawerOpen && (
        <div className="fixed inset-0 z-50 max-[899px]:block min-[900px]:hidden">
          <button
            type="button"
            aria-label="Dismiss menu"
            className="absolute inset-0 cursor-default bg-black/60"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-drawer border-r border-line bg-panel">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-3 flex h-8 w-8 items-center justify-center rounded-badge text-muted-foreground hover:bg-white/6 hover:text-foreground"
            >
              <Icons.CloseIcon size={15} />
            </button>
            <SidebarContent
              onNavigate={() => setDrawerOpen(false)}
              onAddBoard={() => {
                setDrawerOpen(false);
                setNewBoardOpen(true);
              }}
            />
          </div>
        </div>
      )}

      <ToastStack />
      {newBoardOpen && <NewBoardModal onClose={() => setNewBoardOpen(false)} />}
      <ShortcutsOverlay isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}