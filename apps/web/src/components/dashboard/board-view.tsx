"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBoard, useUpdateBoard, useAddColumn, useDeleteBoard, useDuplicateBoard, useMoveTask } from "@/hooks/queries/boards";
import { usePresence } from "@/lib/boards-store";
import { userById } from "@/lib/mock-data";
import { pushToast } from "@/lib/toast-store";
import { useRealtime, useRealtimeStatus, announceTaskMove } from "@/hooks/useRealtime";
import { BoardColumn } from "./column";
import { TaskModal } from "./task-modal";
import { TimeAgo } from "./time-ago";
import { AvatarStack } from "@flow/ui";
import { Chip } from "@flow/ui";
import { Icons } from "@flow/ui/icons";

function StatusDot({ status }: { status: "connecting" | "live" | "offline" }) {
  const colorClass = status === "live" ? "bg-success" : status === "connecting" ? "bg-warning" : "bg-muted-foreground";
  return <span className={`h-1.5 w-1.5 rounded-full ${colorClass}`} aria-hidden />;
}

export function BoardView({ boardId }: { boardId: string }) {
  const { data: board, isLoading } = useBoard(boardId);
  const presence = usePresence(boardId);
  const status = useRealtimeStatus();
  useRealtime(boardId);

  const router = useRouter();
  const updateBoard = useUpdateBoard(boardId);
  const addColumn = useAddColumn(boardId);
  const deleteBoard = useDeleteBoard();
  const duplicateBoard = useDuplicateBoard();
  const moveTask = useMoveTask();

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

  if (isLoading) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-3 border-primary border-t-transparent animate-spin" />
          <p className="text-[14px] text-muted-foreground">Loading board…</p>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center p-6 text-center">
        <p className="text-stub-heading font-extrabold tracking-tight">Board not found</p>
        <p className="mt-2 max-w-[300px] text-body leading-relaxed text-muted">This board may have been archived or moved.</p>
        <Link
          href="/dashboard"
          className="mt-6 rounded-md border border-line bg-white/3 px-5 py-3 text-label font-semibold hover:bg-white/6"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const current = board;

  function dropTask(columnId: string) {
    if (draggingTaskId == null) return;
    if (dragOverColumn === columnId) return;
    moveTask.mutate({ boardId: current.id, taskId: draggingTaskId, toColumnId: columnId });
    announceTaskMove(current.id, draggingTaskId, columnId);
  }

  function commitBoardName() {
    const name = nameDraft.trim();
    if (name && name !== current.name) updateBoard.mutate({ name });
    setEditingName(false);
  }

  function commitColumn() {
    const name = columnDraft.trim();
    if (name) addColumn.mutate(name);
    setColumnDraft("");
    setAddingColumn(false);
  }

  function toggleFavorite() {
    updateBoard.mutate({ favorite: !current.favorite });
  }

  function handleDuplicate() {
    duplicateBoard.mutate(current.id, {
      onSuccess: (dup: { id: string }) => router.push(`/dashboard/boards/${dup.id}`),
    });
  }

  function handleArchive() {
    updateBoard.mutate({ status: "archived" as const }, {
      onSuccess: () => router.push("/dashboard"),
    });
  }

  function handleDelete() {
    deleteBoard.mutate(current.id, {
      onSuccess: () => router.push("/dashboard"),
    });
  }

  return (
    <div className="flex h-dvh flex-col max-[899px]:h-[calc(100dvh-var(--header-height))]">
      <header className="flex h-board-header-height flex-shrink-0 items-center justify-between gap-3 border-b border-line-soft px-6">
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-meta font-medium">
          <Link
          href="/dashboard"
          className="flex-shrink-0 text-muted-foreground hover:text-foreground"
        >
          Dashboard
        </Link>
          <Icons.ChevronRightIcon size={13} className="flex-shrink-0 text-muted-foreground/60" />
          <span className="truncate text-muted">{board.name}</span>
        </nav>
        <div className="flex items-center gap-2">
          <Chip
            variant="default"
            icon={<StatusDot status={status} />}
            className="text-meta"
          >
            {status === "live" ? "Live" : status === "connecting" ? "Connecting" : "Offline demo"}
          </Chip>
          <Chip
            variant="default"
            icon={<Icons.InviteIcon size={15} />}
            onClick={() => pushToast({ title: "Invite", body: "Team invites arrive with accounts & permissions.", time: "Just now" })}
          >
            Invite
          </Chip>
          <Chip
            variant="default"
            icon={<Icons.ListIcon size={14} />}
            onClick={() => router.push(`/dashboard/boards/${board.id}/list`)}
            className="hidden max-[719px]:hidden min-[720px]:flex"
            aria-label="List view"
          >
            List
          </Chip>
          <Chip variant="active" icon={<Icons.GridIcon size={14} />} aria-label="Board view">
            Board
          </Chip>
          <Chip
            variant="default"
            icon={<Icons.CalendarIcon size={14} />}
            onClick={() => router.push(`/dashboard/boards/${board.id}/calendar`)}
            className="hidden max-[719px]:hidden min-[720px]:flex"
            aria-label="Calendar view"
          >
            Calendar
          </Chip>
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
            className="rounded-badge border border-line bg-field px-2 py-1 text-headline font-bold focus:border-primary-2/60 focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setNameDraft(board.name);
              setEditingName(true);
            }}
            title="Rename board"
            className="max-w-[min(480px,60vw)] truncate text-left text-headline font-bold rounded-badge px-1.5 py-1 hover:bg-white/4"
          >
            {board.name}
          </button>
        )}
        <button
          type="button"
          aria-label={board.favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={board.favorite}
          disabled={updateBoard.isPending}
          onClick={toggleFavorite}
          className="flex h-8 w-8 items-center justify-center rounded-badge text-muted-foreground hover:bg-white/6 hover:text-foreground"
        >
          <Icons.StarIcon size={16} fill={board.favorite ? "currentColor" : "none"} className={board.favorite ? "text-star" : ""} />
        </button>
        <div className="relative" data-board-menu-trigger>
          <button
            type="button"
            aria-label="Board options"
            aria-expanded={boardMenuOpen}
            disabled={updateBoard.isPending || deleteBoard.isPending}
            onClick={(event) => {
              const r = (event.currentTarget as HTMLElement).getBoundingClientRect();
              setBoardMenuAnchor({ left: r.left, top: r.top, right: r.right });
              setBoardMenuOpen((v) => !v);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-badge text-muted-foreground hover:bg-white/6 hover:text-foreground"
          >
            <Icons.MoreIcon size={16} />
          </button>
          {boardMenuOpen && boardMenuAnchor && (
            <div
              data-board-menu
              className="fixed z-50 w-[200px] rounded-lg border border-line bg-panel-2 p-1 shadow-dropdown"
              style={{
                left: Math.max(8, boardMenuAnchor.right - 200),
                top: Math.max(8, boardMenuAnchor.top - 8),
                transform: "translateY(-100%)",
              }}
            >
              <button
                type="button"
                disabled={duplicateBoard.isPending}
                onClick={() => {
                  handleDuplicate();
                  setBoardMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-badge px-2.5 py-2 text-label font-medium hover:bg-white/6"
              >
                <Icons.CopyIcon size={13} />
                Duplicate
              </button>
              <button
                type="button"
                onClick={() => {
                  setBoardMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-badge px-2.5 py-2 text-label font-medium hover:bg-white/6"
              >
                <Icons.SettingsIcon size={13} />
                Settings
              </button>
              <button
                type="button"
                disabled={updateBoard.isPending}
                onClick={() => {
                  handleArchive();
                  setBoardMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-badge px-2.5 py-2 text-label font-medium text-error hover:bg-error/10"
              >
                <Icons.ArchiveIcon size={13} />
                Archive
              </button>
              <button
                type="button"
                disabled={deleteBoard.isPending}
                onClick={() => {
                  handleDelete();
                  setBoardMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-badge bg-error/15 px-2.5 py-2 text-label font-bold text-error hover:bg-error/25"
              >
                <Icons.TrashIcon size={13} />
                Delete
              </button>
            </div>
          )}
          </div>
        <span className="ml-auto flex-shrink-0 text-meta font-medium text-muted-foreground">
          Updated <TimeAgo iso={board.updatedAt} />
        </span>
      </div>

      <div className="flex min-h-0 flex-1 items-start gap-4 overflow-x-auto px-6 pt-3 pb-8 snap-x snap-mandatory">
        {board.columns.map((c: import("@flow/shared").Column) => (
          <BoardColumn
            key={c.id}
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
          <div className="w-column flex-shrink-0 rounded-lg border border-line bg-field p-2.5">
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
              className="w-full rounded-badge bg-transparent px-1.5 py-1 text-label font-bold placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        ) : (
          <button
            type="button"
            disabled={addColumn.isPending}
            onClick={() => setAddingColumn(true)}
            className="flex w-column flex-shrink-0 items-center justify-center gap-2 rounded-lg border border-dashed border-white/12 py-2 text-label font-semibold text-muted-foreground hover:border-white/22 hover:text-foreground"
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
