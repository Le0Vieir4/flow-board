"use client";

import { useEffect, useRef, useState } from "react";
import type { Column } from "@flow/shared";
import { addTask, deleteColumn, renameColumn } from "@/lib/boards-store";
import { TaskCard } from "./task-card";
import { Icons } from "@flow/ui/icons";

const chipClass = "flex items-center gap-2 rounded-[10px] border border-line px-3 py-[7px] text-[13px] font-semibold transition-colors duration-150";

export function BoardColumn({
  boardId,
  column,
  draggingTaskId,
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onOpenTask,
  onDragStart,
  onDragEnd,
}: {
  boardId: string;
  column: Column;
  draggingTaskId: number | null;
  dragOver: boolean;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: () => void;
  onOpenTask: (taskId: number) => void;
  onDragStart: (taskId: number) => void;
  onDragEnd: () => void;
}) {
  const [composing, setComposing] = useState(false);  const [draft, setDraft] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(column.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [bump, setBump] = useState(0);

  const count = column.tasks.length;
  const prevCount = useRef(count);
  useEffect(() => {
    if (prevCount.current !== count) {
      prevCount.current = count;
      setBump((b) => b + 1);
    }
  }, [count]);

  useEffect(() => {
    if (menuOpen) {
      const onDown = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      };
      window.addEventListener("mousedown", onDown);
      return () => window.removeEventListener("mousedown", onDown);
    }
  }, [menuOpen]);

  useEffect(() => {
    if (renaming) inputRef.current?.focus();
  }, [renaming]);

  function commitRename() {
    const name = nameDraft.trim();
    if (name && name !== column.name) renameColumn(boardId, column.id, name);
    setRenaming(false);
  }

  function commitAdd() {
    const title = draft.trim();
    if (!title) return;
    addTask(boardId, column.id, title);
    setDraft("");
    setComposing(false);
  }

  return (
    <section
      className={`flex w-[272px] flex-shrink-0 flex-col rounded-[14px] border p-2 transition-colors duration-150 snap-start ${
        dragOver ? "border-2 border-dashed border-primary-2 bg-primary-2/[0.06]" : "border-transparent hover:border-line-soft hover:bg-white/[0.015]"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        onDragOver();
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onDragLeave();
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
    >
      <header className="flex items-center justify-between gap-2 px-2.5 pt-2 pb-2.5">
        {renaming ? (
          <div className="flex items-center gap-2 w-full">
            <input
              ref={inputRef}
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setRenaming(false);
              }}
              aria-label="Column name"
              className="flex-1 rounded-[8px] border border-line bg-field px-2 py-[3px] text-[13.5px] font-bold focus:border-primary-2/60 focus:outline-none"
            />
            <button
              type="button"
              aria-label="Cancel rename"
              onClick={() => setRenaming(false)}
              className="flex h-6 w-6 items-center justify-center rounded-[7px] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
            >
              <Icons.CloseIcon size={13} />
            </button>
          </div>
        ) : (
          <>
            <h3 className="flex min-w-0 items-center gap-2">
              <span className="truncate text-[13.5px] font-bold">{column.name}</span>
              <span
                key={bump}
                className={`rounded-full bg-white/[0.05] px-[7px] py-[1px] text-[11px] font-semibold text-muted-foreground ${
                  bump > 1 ? "animate-count-bump" : ""
                }`}
              >
                {count}
              </span>
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label={`Add column after ${column.name}`}
                onClick={() => {
                  // Add column after this one - we'll use the board view's add column functionality
                  setComposing(true);
                  setMenuOpen(false);
                }}
                className={`${chipClass} bg-white/[0.03] text-foreground hover:bg-white/[0.06]`}
              >
                <Icons.PlusIcon size={13} />
                Add column
              </button>
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  aria-label={`${column.name} options`}
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex h-6 w-6 items-center justify-center rounded-[7px] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                >
                  <Icons.MoreIcon size={14} />
                </button>
                {menuOpen && (
                  <div className="absolute top-7 right-0 z-20 w-[168px] rounded-[10px] border border-line bg-panel-2 p-1 shadow-[0_16px_32px_rgba(0,0,0,0.4)]">
                    <button
                      type="button"
                      onClick={() => {
                        setRenaming(true);
                        setNameDraft(column.name);
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-[7px] text-[13px] font-medium hover:bg-white/[0.06]"
                    >
                      <Icons.PencilIcon size={13} />
                      Rename
                    </button>
                    {!confirmDelete ? (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-[7px] text-[13px] font-medium text-error hover:bg-error/10"
                      >
                        <Icons.TrashIcon size={13} />
                        Delete column
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          deleteColumn(boardId, column.id);
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-[8px] bg-error/15 px-2.5 py-[7px] text-[13px] font-bold text-error hover:bg-error/25"
                      >
                        <Icons.TrashIcon size={13} />
                        Confirm delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </header>

      <div className="flex min-h-[24px] flex-col gap-2 px-1 pb-1">
        {column.tasks.map((t: import("@flow/shared").Task) => (
          <TaskCard
            key={t.id}
            task={t}
            dragging={draggingTaskId === t.id}
            onOpen={() => onOpenTask(t.id)}
            onDragStart={() => onDragStart(t.id)}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>

      {dragOver && count === 0 && (
        <div className="m-1 rounded-[10px] border-2 border-dashed border-primary-2/60 p-3 text-center text-[12px] font-semibold text-primary-2">
          Drop cards here
        </div>
      )}

      <footer className="p-1">
        {composing ? (
          <div className="rounded-[10px] border border-line bg-field p-2">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitAdd();
                if (e.key === "Escape") {
                  setComposing(false);
                  setDraft("");
                }
              }}
              placeholder="Card title"
              aria-label="New card title"
              className="w-full bg-transparent px-1 py-[2px] text-[13px] placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={commitAdd}
                disabled={!draft.trim()}
                className="rounded-[8px] bg-primary px-3 py-[6px] text-[12.5px] font-semibold text-white transition-colors duration-150 hover:bg-primary-2 disabled:opacity-40"
              >
                Add card
              </button>
              <button
                type="button"
                aria-label="Cancel"
                onClick={() => {
                  setComposing(false);
                  setDraft("");
                }}
                className="flex h-7 w-7 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
              >
                <Icons.CloseIcon size={13} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setComposing(true)}
            className="flex w-full items-center gap-2 rounded-[9px] px-2.5 py-[8px] text-[13px] font-semibold text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
          >
            <Icons.PlusIcon size={13} />
            Add a card
          </button>
        )}
      </footer>
    </section>
  );
}
