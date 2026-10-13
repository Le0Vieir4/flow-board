"use client";

import { useEffect, useState, type ReactNode } from "react";
import { devUser } from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";
import { useNewBoardModalState } from "@/lib/commands";
import { Avatar } from "./avatar";
import { LogoMark } from "@/components/auth/auth-shell";
import { Icons } from "@flow/ui/icons";
import { SidebarContent, Sidebar } from "./sidebar";
import { NewBoardModal } from "./new-board-modal";
import { ToastStack } from "./toast-stack";
import { ShortcutsOverlay } from "./shortcuts-overlay";

export function AppShell({ children }: { children: ReactNode }) {
  const { open: newBoardOpen, setOpen: setNewBoardOpen } = useNewBoardModalState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const { user } = useAuth();
  const displayUser = user ?? devUser;

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

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[56px] items-center justify-between border-b border-line bg-bg px-4 max-[899px]:flex min-[900px]:hidden">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
            >
              <Icons.MenuIcon size={18} />
            </button>
            <div className="flex items-center gap-[8px]">
              <LogoMark size="small" />
              <span className="text-[16px] font-extrabold -tracking-[0.01em]">FlowBoard</span>
            </div>
          </div>
          <Avatar user={displayUser} size={28} ringColor="#05070d" />
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 max-[899px]:block min-[900px]:hidden">
          <button
            type="button"
            aria-label="Dismiss menu"
            className="absolute inset-0 cursor-default bg-black/60"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-[264px] border-r border-line bg-panel">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-3 flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
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
