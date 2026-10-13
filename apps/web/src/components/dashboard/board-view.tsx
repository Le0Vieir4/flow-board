"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { addColumn, archiveBoard, deleteBoard, duplicateBoard, moveTask, renameBoard, toggleFavorite, useBoard, usePresence } from "@/lib/boards-store";
import { userById } from "@/lib/mock-data";
import { pushToast } from "@/lib/toast-store";
import { useRealtime, useRealtimeStatus, announceTaskMove } from "@/hooks/useRealtime";
import { BoardColumn } from "./column";
import { TaskModal } from "./task-modal";
import { TimeAgo } from "./time-ago";
import { AvatarStack } from "./avatar";
import { Icons } from "@flow/ui/icons";

const chipClass = "flex items-center gap-2 rounded-[10px] border border-line px-3 py-[7px] text-[13px] font-semibold transition-colors duration-150";

function StatusDot({ status }: { status: "connecting" | "live" | "offline" }) {
  const color = status === "live" ? "#34c77b" : status === "connecting" ? "#e2924a" : "#7a8090";
  return <span className="h-[6px] w-[6px] rounded-full" style={{ background: color }} aria-hidden />;
}

export function BoardView({ boardId }: { boardId: string }) {
  const board = useBoard(boardId);
  const presence = usePresence(boardId);
  const status = useRealtimeStatus();
  useRealtime(boardId);

  const [openTaskId, setOpenTaskId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [addingColumn, setAddingColumn] = useState(false);
  const [columnDraft, setColumnDraft] = useState("");
  const [draggingTaskId, setDraggingTaskId] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [boardMenuOpen, setBoardMenuOpen] = useState(false);
  const [boardMenuAnchor, setBoardMenuAnchor] = useState<{ left: number; top: number; right: number } | null>(null);

  useEffect(() => {
    if (!boardMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const menu = document.querySelector('[data-board-menu]');
      const trigger = document.querySelector('[data-board-menu-trigger]');
      if (menu && !menu.contains(target) && trigger && !trigger.contains(target)) {
        setBoardMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBoardMenuOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [boardMenuOpen]);

  const members = useMemo(() => (board ? board.members.map(userById) : []), [board]);
  const openTask = useMemo(
    () => (openTaskId != null ? board?.columns.flatMap((c: { tasks: import("@flow/shared").Task[] }) => c.tasks).find((t: import("@flow/shared").Task) => t.id === openTaskId) : undefined),
    [board, openTaskId]
  );

  if (!board) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center p-6 text-center">
        <p className="text-[22px] font-extrabold -tracking-[0.02em]">Board not found</p>
        <p className="mt-2 max-w-[300px] text-[14px] leading-[1.6] text-muted">This board may have been archived or moved.</p>
        <Link
          href="/boards"
          className="mt-6 rounded-[10px] border border-line bg-white/[0.03] px-5 py-[11px] text-[14.5px] font-semibold hover:bg-white/[0.06]"
        >
          Back to boards
        </Link>
      </div>
    );
  }

  const current = board;

  function dropTask(columnId: string) {
    if (draggingTaskId == null) return;
    if (dragOverColumn === columnId) return;
    moveTask(current.id, draggingTaskId, columnId);
    announceTaskMove(current.id, draggingTaskId, columnId);
  }

  function commitBoardName() {
    const name = nameDraft.trim();
    if (name && name !== current.name) renameBoard(current.id, name);
    setEditingName(false);
  }

  function commitColumn() {
    const name = columnDraft.trim();
    if (name) addColumn(current.id, name);
    setColumnDraft("");
    setAddingColumn(false);
  }

  function comingSoon(view: string) {
    pushToast({ title: `${view} view`, body: "Planned after v1 — the board stays live meanwhile.", time: "Just now" });
  }

  return (
    <div className="flex h-dvh flex-col max-[899px]:h-[calc(100dvh-56px)]">
      <header className="flex h-[54px] flex-shrink-0 items-center justify-between gap-3 border-b border-line-soft px-6">
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[12.5px] font-medium">
          <Link href="/boards" className="flex-shrink-0 text-muted-foreground hover:text-foreground">
            Boards
          </Link>
          <Icons.ChevronRightIcon size={13} className="flex-shrink-0 text-muted-foreground/60" />
          <span className="truncate text-muted">{board.name}</span>
        </nav>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 rounded-[10px] border border-line px-3 py-[7px] text-[12.5px] font-semibold text-muted">
            <StatusDot status={status} />
            {status === "live" ? "Live" : status === "connecting" ? "Connecting" : "Offline demo"}
          </span>
          <button
            type="button"
            onClick={() => pushToast({ title: "Invite", body: "Team invites arrive with accounts & permissions.", time: "Just now" })}
            className={`${chipClass} bg-white/[0.03] text-foreground hover:bg-white/[0.06]`}
          >
            <Icons.InviteIcon size={15} />
            Invite
          </button>
          <button
            type="button"
            onClick={() => comingSoon("List")}
            className={`${chipClass} hidden max-[719px]:hidden min-[720px]:flex`}
            aria-label="List view (coming soon)"
          >
            <Icons.ListIcon size={14} />
          </button>
          <button type="button" aria-label="Board view" className={`${chipClass} bg-white/[0.06] text-foreground`}>
            <Icons.GridIcon size={14} />
            Board
          </button>
          <button
            type="button"
            onClick={() => comingSoon("Calendar")}
            className={`${chipClass} hidden max-[719px]:hidden min-[720px]:flex`}
            aria-label="Calendar view (coming soon)"
          >
            <Icons.CalendarIcon size={14} />
          </button>
          <AvatarStack users={members} presence={presence} size={24} />
        </div>
      </header>

      <div className="flex flex-shrink-0 items-center gap-2.5 px-6 pt-5 pb-1">
        {editingName ? (
          <input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={commitBoardName}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitBoardName();
              if (e.key === "Escape") setEditingName(false);
            }}
            aria-label="Board name"
            className="rounded-[8px] border border-line bg-field px-2 py-[3px] text-[18px] font-bold focus:border-primary-2/60 focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setNameDraft(board.name);
              setEditingName(true);
            }}
            title="Rename board"
            className="max-w-[min(480px,60vw)] truncate text-left text-[18px] font-bold rounded-[8px] px-1.5 py-[2px] hover:bg-white/[0.04]"
          >
            {board.name}
          </button>
        )}
        <button
          type="button"
          aria-label={board.favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={board.favorite}
          onClick={() => toggleFavorite(board.id)}
          className="flex h-8 w-8 items-center justify-center rounded-[9px] text-muted-foreground hover:bg-white/[0.06]"
        >
          <Icons.StarIcon size={16} fill={board.favorite ? "currentColor" : "none"} className={board.favorite ? "text-star" : ""} />
        </button>
        <div className="relative" data-board-menu-trigger>
          <button
            type="button"
            aria-label="Board options"
            aria-expanded={boardMenuOpen}
            onClick={(event) => {
              const r = (event.currentTarget as HTMLElement).getBoundingClientRect();
              setBoardMenuAnchor({ left: r.left, top: r.top, right: r.right });
              setBoardMenuOpen((v) => !v);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-[9px] text-muted-foreground hover:bg-white/[0.06]"
          >
            <Icons.MoreIcon size={16} />
          </button>
          {boardMenuOpen && boardMenuAnchor && (
            <div
              data-board-menu
              className="fixed z-50 w-[200px] rounded-[10px] border border-line bg-panel-2 p-1 shadow-[0_16px_32px_rgba(0,0,0,0.4)]"
              style={{
                left: Math.max(8, boardMenuAnchor.right - 200),
                top: Math.max(8, boardMenuAnchor.top - 8),
                transform: "translateY(-100%)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  duplicateBoard(board.id);
                  setBoardMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-[7px] text-[13px] font-medium hover:bg-white/[0.06]"
              >
                <Icons.CopyIcon size={13} />
                Duplicate
              </button>
              <button
                type="button"
                onClick={() => {
                  // Settings - placeholder
                  setBoardMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-[7px] text-[13px] font-medium hover:bg-white/[0.06]"
              >
                <Icons.SettingsIcon size={13} />
                Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  archiveBoard(board.id);
                  setBoardMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-[7px] text-[13px] font-medium text-error hover:bg-error/10"
              >
                <Icons.ArchiveIcon size={13} />
                Archive
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteBoard(board.id);
                  setBoardMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-[8px] bg-error/15 px-2.5 py-[7px] text-[13px] font-bold text-error hover:bg-error/25"
              >
                <Icons.TrashIcon size={13} />
                Delete
              </button>
            </div>
          )}
          </div>
        <span className="ml-auto flex-shrink-0 text-[12.5px] font-medium text-muted-foreground">
          Updated <TimeAgo iso={board.updatedAt} />
        </span>
      </div>

      <div className="flex min-h-0 flex-1 items-start gap-4 overflow-x-auto px-6 pt-3 pb-8 snap-x snap-mandatory">
        {board.columns.map((c: import("@flow/shared").Column) => (
          <BoardColumn
            key={c.id}
            boardId={board.id}
            column={c}
            draggingTaskId={draggingTaskId}
            dragOver={dragOverColumn === c.id}
            onDragOver={() => setDragOverColumn(c.id)}
            onDragLeave={() => setDragOverColumn((cur) => (cur === c.id ? null : cur))}
            onDrop={() => {
              dropTask(c.id);
              setDragOverColumn(null);
              setDraggingTaskId(null);
            }}
            onOpenTask={(id) => setOpenTaskId(id)}
            onDragStart={(taskId) => setDraggingTaskId(taskId)}
            onDragEnd={() => {
              setDraggingTaskId(null);
              setDragOverColumn(null);
            }}
          />
        ))}

        {addingColumn ? (
          <div className="w-[272px] flex-shrink-0 rounded-[14px] border border-line bg-field p-2.5">
            <input
              autoFocus
              value={columnDraft}
              onChange={(e) => setColumnDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitColumn();
                if (e.key === "Escape") {
                  setAddingColumn(false);
                  setColumnDraft("");
                }
              }}
              onBlur={() => {
                if (!columnDraft.trim()) setAddingColumn(false);
              }}
              placeholder="Column name"
              aria-label="New column name"
              className="w-full rounded-[8px] bg-transparent px-1.5 py-[3px] text-[13.5px] font-bold placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddingColumn(true)}
            className="flex w-[272px] flex-shrink-0 items-center justify-center gap-2 rounded-[14px] border border-dashed border-white/[0.12] py-[9px] text-[13.5px] font-semibold text-muted-foreground hover:border-white/[0.22] hover:text-foreground"
          >
            <Icons.PlusIcon size={14} />
            Add column
          </button>
        )}
      </div>

      {openTask && <TaskModal board={board} task={openTask} onClose={() => setOpenTaskId(null)} />}
    </div>
  );
}
