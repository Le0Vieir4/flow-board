"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBoards, usePresence } from "@/lib/boards-store";
import { useUnreadCount } from "@/lib/notification-store";
import { useAuth, clearAuth } from "@/hooks/useAuth";
import { devUser } from "@/lib/mock-data";
import { LogoMark } from "@/components/auth/auth-shell";
import { Avatar } from "./avatar";
import { Icons } from "@flow/ui/icons";
import { logoutUser } from "@/app/(auth)/logout/actions";

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
      href={`/boards/${board.id}`}
      onClick={onNavigate}
      className={`group flex items-center gap-[10px] rounded-[10px] px-3 py-[6px] text-[13.5px] font-medium ${
        activeBoardId === board.id
          ? "bg-white/[0.06] text-foreground"
          : "text-muted hover:bg-white/[0.04] hover:text-foreground"
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
  const body = (
    <div
      className={`flex items-center gap-[10px] rounded-[10px] px-3 py-[7px] text-[14.5px] font-medium ${
        active
          ? "bg-white/[0.06] text-foreground"
          : disabled
            ? "text-muted-foreground/70"
            : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
      }`}
    >
      <span className={active ? "text-foreground" : "text-muted-foreground/80"}>{icon}</span>
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          key={badge}
          className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-tag-electric px-1.5 text-[10px] font-bold text-white"
        >
          {badge}
        </span>
      )}
      {disabled && (
        <span className="rounded-full border border-line bg-white/[0.04] px-[7px] py-[1px] text-[10px] font-semibold text-muted-foreground">
          Soon
        </span>
      )}
    </div>
  );
  return href ? (
    <Link href={href} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}

export function SidebarContent({
  onNavigate,
  onAddBoard,
}: {
  onNavigate?: () => void;
  onAddBoard?: () => void;
}) {
  const pathname = usePathname();
  const boards = useBoards();
  const unread = useUnreadCount();
  const { user } = useAuth();
  const displayUser = user ?? devUser;
  const pinned = boards.filter((b) => b.status !== "archived" && b.favorite);
  const activeBoardId = pathname.startsWith("/boards/") ? pathname.split("/")[2] : undefined;

  return (
    <div className="flex h-full w-full flex-col">
      <Link href="/boards" onClick={onNavigate} className="flex items-center gap-[10px] px-5 pt-5 pb-2">
        <LogoMark />
        <span className="text-[19px] font-extrabold -tracking-[0.01em]">FlowBoard</span>
      </Link>

      <nav aria-label="Workspace" className="mt-3 space-y-[2px] px-3">
        <Link href="/boards" onClick={onNavigate} className="block">
          <NavItem icon={<Icons.HomeIcon size={16} />} label="Home" active={pathname === "/boards"} />
        </Link>
        <NavItem
          icon={<Icons.TasksIcon size={16} />}
          label="My Tasks"
          href="/tasks"
          active={pathname === "/tasks"}
        />
        <NavItem
          icon={<Icons.BellIcon size={16} />}
          label="Notifications"
          href="/notifications"
          active={pathname === "/notifications"}
          badge={unread}
        />
      </nav>

      <div className="px-5 pt-5 pb-1 text-[11px] font-semibold text-muted-foreground">Pinned boards</div>
      <div className="mt-[2px] space-y-[2px] px-3">
        {pinned.map((b) => (
          <PinnedBoardItem key={b.id} board={b} activeBoardId={activeBoardId} onNavigate={onNavigate} />
        ))}
        {pinned.length === 0 && (
          <div className="px-3 py-[6px] text-[12.5px] text-muted-foreground">Star a board to pin it here.</div>
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
          <Avatar user={displayUser} size={28} ringColor="#10131c" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold">{displayUser.name}</div>
            <div className="text-[11.5px] text-muted-foreground">Demo workspace</div>
          </div>
          <form action={async () => {
            await logoutUser();
            clearAuth();
          }}>
            <button
              type="submit"
              aria-label="Log out"
              className="flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
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
      className="sticky top-0 hidden h-dvh w-[232px] flex-shrink-0 border-r border-line bg-panel max-[899px]:hidden min-[900px]:block"
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
      className="flex items-center gap-[10px] rounded-[10px] px-3 py-[6px] text-[13.5px] font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
    >
      <Icons.PlusIcon size={15} className="opacity-70" />
      Add board
    </button>
  );
}
