"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBoards } from "@/hooks/queries/boards";
import { useUnreadCount } from "@/hooks/queries/notifications";
import { usePresence } from "@/lib/boards-store";
import { useAuth, clearAuth } from "@/hooks/useAuth";
import { LogoMark } from "@/components/auth/auth-shell";
import { Avatar } from "@flow/ui";
import { Icons } from "@flow/ui/icons";
import { logoutUser } from "@/app/(auth)/logout/actions";
import { Chip } from "@flow/ui";

function PinnedBoardItem({
  board,
  activeBoardId,
  onNavigate,
}: {
  board: import("@flow/shared").Board;
  activeBoardId: string | undefined;
  onNavigate?: () => void;
}) {
  const presence = usePresence(board.id);
  const hasOnlineOthers = Object.values(presence).some((online) => online);

  return (
    <Link
      key={board.id}
      href={`/dashboard/boards/${board.id}`}
      onClick={onNavigate}
      className={`group flex items-center gap-[10px] rounded-md px-3 py-[6px] text-label ${
        activeBoardId === board.id
          ? "bg-white/6 text-foreground"
          : "text-muted hover:bg-white/4 hover:text-foreground"
      }`}
    >
      <Icons.BoardIcon size={15} className="flex-shrink-0 opacity-70" />
      <span className="min-w-0 flex-1 truncate">{board.name}</span>
      {board.favorite && <Icons.StarIcon size={12} fill="currentColor" className="text-star" />}
      {hasOnlineOthers && (
        <span className="flex-shrink-0 h-[7px] w-[7px] rounded-full bg-success" aria-label="Teammates online" />
      )}
    </Link>
  );
}

function NavItem({
  icon,
  label,
  active,
  disabled,
  badge,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  badge?: number;
  href?: string;
}) {
  const chip = (
    <Chip
      variant={active ? "active" : disabled ? "ghost" : "default"}
      disabled={disabled}
      icon={icon}
      badge={badge}
      badgeVariant={badge ? "electric" : undefined}
      className="w-full justify-start text-label"
    >
      {label}
    </Chip>
  );

  if (disabled) {
    return (
      <div className="w-full">
        {chip}
        <span className="mt-1 inline-flex items-center rounded-full border border-line bg-white/4 px-2 py-0.5 text-micro font-semibold text-muted-foreground">
          Soon
        </span>
      </div>
    );
  }

  return href ? <Link href={href} className="block">{chip}</Link> : chip;
}

export function SidebarContent({
  onNavigate,
  onAddBoard,
}: {
  onNavigate?: () => void;
  onAddBoard?: () => void;
}) {
  const pathname = usePathname();
  const { data: boards = [] } = useBoards();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { user } = useAuth();
  const displayUser = user;
  const pinned = boards.filter((b) => b.status !== "archived" && b.favorite);
  const activeBoardId = pathname.startsWith("/dashboard/boards/") ? pathname.split("/")[3] : undefined;

  const isActive = (href: string) => pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));

  return (
    <div className="flex h-full w-full flex-col">
      <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-[10px] px-5 pt-5 pb-2">
        <LogoMark />
        <span className="text-wordmark font-extrabold tracking-tighter">FlowBoard</span>
      </Link>

      <nav aria-label="Main navigation" className="mt-3 space-y-[2px] px-3">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={`flex items-center gap-[10px] rounded-md px-3 py-[8px] text-base font-medium transition-colors ${
            isActive("/dashboard")
              ? "bg-primary/15 text-primary-2"
              : "text-muted-foreground hover:bg-white/4 hover:text-foreground"
          }`}
        >
          <Icons.HomeIcon size={16} />
          Home
        </Link>
        <Link
          href="/tasks"
          onClick={onNavigate}
          className={`flex items-center gap-[10px] rounded-md px-3 py-[8px] text-base font-medium transition-colors ${
            isActive("/tasks")
              ? "bg-primary/15 text-primary-2"
              : "text-muted-foreground hover:bg-white/4 hover:text-foreground"
          }`}
        >
          <Icons.TasksIcon size={16} />
          My Tasks
        </Link>
        <Link
          href="/notifications"
          onClick={onNavigate}
          className={`flex items-center gap-[10px] rounded-md px-3 py-[8px] text-base font-medium transition-colors relative ${
            isActive("/notifications")
              ? "bg-primary/15 text-primary-2"
              : "text-muted-foreground hover:bg-white/4 hover:text-foreground"
          }`}
        >
          <Icons.BellIcon size={16} />
          Notifications
          {unreadCount > 0 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-tag-electric px-1.5 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </nav>

      <div className="px-5 pt-5 pb-1 text-meta-small font-semibold text-muted-foreground">Pinned boards</div>
      <div className="mt-[2px] space-y-[2px] px-3">
        {pinned.map((b) => (
          <PinnedBoardItem key={b.id} board={b} activeBoardId={activeBoardId} onNavigate={onNavigate} />
        ))}
        {pinned.length === 0 && (
          <div className="px-3 py-[6px] text-meta text-muted-foreground">Star a board to pin it here.</div>
        )}
        <div className="pt-[2px]">
          <AddBoardLink
            onClick={() => {
              onAddBoard?.();
              onNavigate?.();
            }}
          />
        </div>
      </div>

      <div className="flex-1" />

      <div className="border-t border-line px-5 py-4">
        <div className="flex items-center gap-[10px]">
          <Avatar user={{ id: displayUser?.id ?? "", name: displayUser?.name ?? "User", color: displayUser?.color ?? "#4f6bff" }} size={28} ringColor="var(--color-panel)" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-label font-semibold">{displayUser?.name ?? "User"}</div>
            <div className="text-meta-small text-muted-foreground">Demo workspace</div>
          </div>
          <form action={async () => {
            await logoutUser();
            clearAuth();
          }}>
            <button
              type="submit"
              aria-label="Log out"
              className="flex h-8 w-8 items-center justify-center rounded-badge text-muted-foreground hover:bg-white/6 hover:text-foreground"
            >
              <Icons.LogoutIcon size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ onAddBoard }: { onAddBoard?: () => void }) {
  return (
    <aside
      aria-label="Workspace sidebar"
      className="sticky top-0 hidden h-dvh w-sidebar flex-shrink-0 border-r border-line bg-panel max-[899px]:hidden min-[900px]:block"
    >
      <SidebarContent onAddBoard={onAddBoard} />
    </aside>
  );
}

export function AddBoardLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[10px] rounded-md px-3 py-[6px] text-label font-medium text-muted-foreground hover:bg-white/4 hover:text-foreground"
    >
      <Icons.PlusIcon size={15} className="opacity-70" />
      Add board
    </button>
  );
}