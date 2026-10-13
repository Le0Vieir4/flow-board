"use client";

import { useEffect, useRef, useState } from "react";
import type { Board, TagType, Task } from "@flow/shared";
import { deleteTask, moveTask, updateTask } from "@/lib/boards-store";
import { userById } from "@/lib/mock-data";
import { announceTaskMove } from "@/hooks/useRealtime";
import { Modal } from "./modal";
import { Avatar } from "./avatar";
import { TimeAgo } from "./time-ago";
import { Icons } from "@flow/ui/icons";

const TAG_OPTIONS = [
  { value: "", label: "No tag" },
  { value: "electric", label: "Electric" },
  { value: "design", label: "Design" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] as const;

const selectClass =
  "w-full rounded-[10px] border border-line bg-field px-3 py-[9px] text-[13.5px] font-medium focus:border-primary-2/60 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-[6px] text-[11.5px] font-semibold text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function AssigneePicker({ board, task }: { board: Board; task: Task }) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ left: number; top: number; right: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const members = board.members.map(userById);

  function toggleOpen() {
    if (!open) {
      const r = triggerRef.current?.getBoundingClientRect();
      if (r) setAnchor({ left: r.left, top: r.top, right: r.right });
    }
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node) && !listRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle(userId: string) {
    const has = task.assignees.includes(userId);
    updateTask(board.id, task.id, {
      assignees: has ? task.assignees.filter((id: string) => id !== userId) : [...task.assignees, userId],
    });
  }

  return (
    <div ref={triggerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change assignees"
        onClick={toggleOpen}
        className="flex items-center gap-[6px] rounded-[9px] border border-line px-2.5 py-[5px] text-[12.5px] font-semibold text-muted-foreground transition-colors duration-150 hover:bg-white/[0.04] hover:text-foreground"
      >
        <Icons.PlusIcon size={12} />
        Assign
      </button>
      {open && anchor && (
        <div
          ref={listRef}
          role="listbox"
          aria-label="Assignees"
          className="fixed z-50 w-[240px] rounded-[10px] border border-line bg-panel-2 p-1 shadow-[0_16px_32px_rgba(0,0,0,0.4)]"
          style={{
            left: Math.max(8, anchor.right - 240),
            top: Math.max(8, anchor.top - 8),
            transform: "translateY(-100%)",
          }}
        >
          <div className="px-2.5 pt-1.5 pb-1 text-[11px] font-semibold text-muted-foreground">Assign to</div>
          {members.map((u: import("@flow/shared").User) => {
            const on = task.assignees.includes(u.id);
            return (
              <button
                key={u.id}
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => toggle(u.id)}
                className="flex w-full items-center gap-2.5 rounded-[8px] px-2.5 py-[7px] text-[13px] font-medium hover:bg-white/[0.06]"
              >
                <Avatar user={u} size={22} />
                <span className="min-w-0 flex-1 truncate text-left">{u.name}</span>
                <span
                  aria-hidden
                  className={`flex h-[17px] w-[17px] flex-shrink-0 items-center justify-center rounded-full transition-colors duration-150 ${
                    on ? "bg-primary text-white" : "border border-line"
                  }`}
                >
                  {on && <Icons.CheckIcon size={10} />}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function TaskModal({
  board,
  task,
  onClose,
}: {
  board: Board;
  task: Task;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [comment, setComment] = useState("");
  const column = board.columns.find((c: import("@flow/shared").Column) => c.tasks.some((t: import("@flow/shared").Task) => t.id === task.id));
  const assignees = task.assignees.map(userById);

  function move(toColumnId: string) {
    moveTask(board.id, task.id, toColumnId);
    announceTaskMove(board.id, task.id, toColumnId);
  }

  function toggleChecklist() {
    const cl = task.checklist;
    if (!cl) return;
    updateTask(board.id, task.id, { checklist: { ...cl, done: cl.done >= cl.total ? 0 : cl.done + 1 } });
  }

  function addComment() {
    const body = comment.trim();
    if (!body) return;
    updateTask(board.id, task.id, {
      comments: [...(task.comments ?? []), { id: `c${Date.now()}`, userId: "u-you", body, at: new Date().toISOString() }],
    });
    setComment("");
  }

  return (
    <Modal onClose={onClose} width="max-w-[600px]">
      <div className="overflow-y-auto p-6 pb-5">
        <span className="text-[10.5px] font-medium text-muted-foreground">
          {task.label} · {column?.name ?? "Column"}
        </span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title.trim() && title !== task.title && updateTask(board.id, task.id, { title: title.trim() })}
          aria-label="Task title"
          className="mt-[5px] w-full rounded-[8px] bg-transparent px-1.5 -mx-1.5 text-[15px] font-bold focus:bg-field focus:outline-none"
        />

        <div className="mt-5 grid grid-cols-2 gap-3 max-[480px]:grid-cols-1">
          <Field label="Column">
            <select
              value={column?.id ?? ""}
              onChange={(e) => e.target.value && move(e.target.value)}
              className={selectClass}
              aria-label="Move task to column"
            >
              {board.columns.map((c: import("@flow/shared").Column) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tag">
            <select
              value={task.tag ?? ""}
              onChange={(e) => updateTask(board.id, task.id, { tag: (e.target.value || undefined) as TagType | undefined })}
              className={selectClass}
              aria-label="Task tag"
            >
              {TAG_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Due date">
            <input
              type="date"
              value={task.dueDate ?? ""}
              onChange={(e) => updateTask(board.id, task.id, { dueDate: e.target.value || undefined })}
              className={`${selectClass} [color-scheme:dark]`}
              aria-label="Due date"
            />
          </Field>
          <Field label="Checklist">
            <button
              type="button"
              onClick={toggleChecklist}
              disabled={!task.checklist}
              className="flex w-full items-center justify-between rounded-[10px] border border-line bg-field px-3 py-[9px] text-[13.5px] font-medium hover:bg-white/[0.03] disabled:opacity-40"
            >
              <span className="flex items-center gap-2">
                <Icons.ChecklistIcon size={13} />
                {task.checklist ? `${task.checklist.done} of ${task.checklist.total}` : "Not started"}
              </span>
              <span className="text-[12px] font-semibold text-link">Toggle +1</span>
            </button>
          </Field>
        </div>

        <div className="mt-5">
          <div className="mb-[6px] text-[11.5px] font-semibold text-muted-foreground">Description</div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => description.trim() !== (task.description ?? "") && updateTask(board.id, task.id, { description: description.trim() || undefined })}
            placeholder="Add a description…"
            aria-label="Task description"
            className="min-h-[88px] w-full resize-y rounded-[10px] border border-line bg-field px-3.5 py-2.5 text-[13.5px] leading-[1.6] placeholder:text-muted-foreground focus:border-primary-2/60 focus:outline-none"
          />
        </div>

        <div className="mt-5">
          <div className="mb-[6px] text-[11.5px] font-semibold text-muted-foreground">
            Comments {task.comments && task.comments.length > 0 ? `(${task.comments.length})` : ""}
          </div>
          <div className="space-y-4">
            {(task.comments ?? []).map((c: import("@flow/shared").Comment) => {
              const author = userById(c.userId);
              return (
                <div key={c.id} className="flex items-start gap-2.5">
                  <Avatar user={author} size={24} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[12.5px] font-semibold">{author.name}</span>
                      <span className="text-[11px] text-muted-foreground">
                        <TimeAgo iso={c.at} />
                      </span>
                    </div>
                    <p className="mt-[2px] text-[13px] leading-[1.55] text-muted">{c.body}</p>
                  </div>
                </div>
              );
            })}
            {!task.comments || task.comments.length === 0 ? (
              <p className="text-[12.5px] text-muted-foreground">No comments yet — this thread is open.</p>
            ) : null}
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <Avatar user={userById("u-you")} size={26} />
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-line bg-field px-3 py-[7px] focus-within:border-primary-2/60">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addComment();
                }}
                placeholder="Write a comment…"
                aria-label="Write a comment"
                className="min-w-0 flex-1 bg-transparent text-[13.5px] placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={addComment}
                disabled={!comment.trim()}
                aria-label="Send comment"
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[8px] bg-primary text-white hover:bg-primary-2 disabled:opacity-40"
              >
                <Icons.SendIcon size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-line px-6 py-3.5">
        <div className="flex items-center gap-2">
          <span className="mr-1 text-[11.5px] font-semibold text-muted-foreground">Assignees</span>
          <span className="flex items-center">
            {assignees.map((u: import("@flow/shared").User, i: number) => (
              <span key={u.id} style={{ marginLeft: i === 0 ? 0 : -7 }}>
                <Avatar user={u} size={24} />
              </span>
            ))}
          </span>
          {assignees.length === 0 && <span className="text-[12.5px] text-muted-foreground">Unassigned</span>}
          <AssigneePicker board={board} task={task} />
        </div>
        <button
          type="button"
          onClick={() => {
            deleteTask(board.id, task.id);
            onClose();
          }}
          className="flex items-center gap-[6px] rounded-[9px] px-2.5 py-[6px] text-[13px] font-semibold text-error hover:bg-error/10"
        >
          <Icons.TrashIcon size={13} />
          Delete task
        </button>
      </div>
    </Modal>
  );
}
