"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Board, TagType, Task } from "@flow/shared";
import { useUpdateTask, useDeleteTask, useMoveTask, useAddComment, useComments, useSetChecklist, useChecklist } from "@/hooks/queries/boards";
import { useUsers } from "@/hooks/queries/users";
import { useAuth } from "@/hooks/useAuth";
import { announceTaskMove } from "@/hooks/useRealtime";
import { Modal } from "@flow/ui";
import { Avatar, Button, Chip } from "@flow/ui";
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-meta-small font-semibold text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function AssigneePicker({ board, task }: { board: Board; task: Task }) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ left: number; top: number; right: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const usersQuery = useUsers(board.members);
  const members = usersQuery.data ? board.members.map((id) => usersQuery.data[id]).filter(Boolean) : [];
  const updateTask = useUpdateTask(task.id);

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
    updateTask.mutate({
      assignees: has ? task.assignees.filter((id: string) => id !== userId) : [...task.assignees, userId],
    });
  }

  return (
    <div ref={triggerRef} className="relative">
      <Chip
        variant="default"
        icon={<Icons.PlusIcon size={12} />}
        onClick={toggleOpen}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change assignees"
      >
        Assign
      </Chip>
      {open && anchor && (
        <div
          ref={listRef}
          role="listbox"
          aria-label="Assignees"
          className="fixed z-50 w-[240px] rounded-lg border border-line bg-panel-2 p-1 shadow-dropdown"
          style={{
            left: `max(8px, calc(var(--anchor-right, 0px) - 240px))`,
            top: `max(8px, calc(var(--anchor-top, 0px) - 8px))`,
            transform: "translateY(-100%)",
          }}
        >
          <div className="px-2.5 pt-1.5 pb-1 text-meta-small font-semibold text-muted-foreground">Assign to</div>
          {members.map((u: import("@flow/shared").User) => {
            const on = task.assignees.includes(u.id);
            return (
              <button
                key={u.id}
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => toggle(u.id)}
                className="flex w-full items-center gap-2.5 rounded-badge px-2.5 py-2 text-label font-medium hover:bg-white/6"
              >
                <Avatar user={u} size={22} />
                <span className="min-w-0 flex-1 truncate text-left">{u.name}</span>
                <span
                  aria-hidden
                  className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-150 ${
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
  const { user } = useAuth();
  const commentsData = useComments(task.id);
  const commentCount = commentsData.data?.length ?? 0;
  const allUserIds = useMemo(() => {
    const ids = new Set<string>(task.assignees);
    for (const c of commentsData.data ?? []) ids.add(c.userId);
    return [...ids];
  }, [task.assignees, commentsData.data]);
  const usersQuery = useUsers(allUserIds);
  const userMap = usersQuery.data ?? {};
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [comment, setComment] = useState("");
  const updateTask = useUpdateTask(task.id);
  const deleteTask = useDeleteTask();
  const moveTask = useMoveTask();
  const addComment = useAddComment();
  const setChecklist = useSetChecklist();
  const checklist = useChecklist(task.id);
  const column = board.columns.find((c: import("@flow/shared").Column) => c.tasks.some((t: import("@flow/shared").Task) => t.id === task.id));
  const assignees = task.assignees.map((id) => userMap[id]).filter(Boolean);

  function move(toColumnId: string) {
    moveTask.mutate({ boardId: board.id, taskId: task.id, toColumnId });
    announceTaskMove(board.id, task.id, toColumnId);
  }

  function toggleChecklist() {
    const current = checklist.data;
    if (!current) return;
    setChecklist.mutate({
      taskId: task.id,
      done: current.done >= current.total ? 0 : current.done + 1,
      total: current.total,
    });
  }

  function handleAddComment() {
    const body = comment.trim();
    if (!body) return;
    addComment.mutate({ taskId: task.id, body });
    setComment("");
  }

  return (
    <Modal open onClose={onClose} size="lg">
      <div className="overflow-y-auto p-6 pb-5">
        <span className="text-micro text-muted-foreground">
          {task.label} · {column?.name ?? "Column"}
        </span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title.trim() && title !== task.title && updateTask.mutate({ title: title.trim() })}
          aria-label="Task title"
          className="mt-1 w-full rounded-badge bg-transparent px-1.5 -mx-1.5 text-headline font-bold focus:bg-field focus:outline-none"
        />

        <div className="mt-5 grid grid-cols-2 gap-3 max-[480px]:grid-cols-1">
          <Field label="Column">
            <select
              value={column?.id ?? ""}
              onChange={(e) => e.target.value && move(e.target.value)}
              className="w-full rounded-button border border-line bg-field px-3 py-2 text-label font-medium focus:border-primary-2/60 focus:outline-none"
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
              onChange={(e) => updateTask.mutate({ tag: (e.target.value || undefined) as TagType | undefined })}
              className="w-full rounded-button border border-line bg-field px-3 py-2 text-label font-medium focus:border-primary-2/60 focus:outline-none"
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
              onChange={(e) => updateTask.mutate({ dueDate: e.target.value || undefined })}
              className="w-full rounded-button border border-line bg-field px-3 py-2 text-label font-medium focus:border-primary-2/60 focus:outline-none [color-scheme:dark]"
              aria-label="Due date"
            />
          </Field>
          <Field label="Checklist">
            <Chip
              variant="default"
              icon={<Icons.ChecklistIcon size={13} />}
              className="w-full justify-between text-label"
              onClick={toggleChecklist}
              disabled={!checklist.data}
            >
              <span className="flex items-center gap-2">
                <Icons.ChecklistIcon size={13} />
                {checklist.data ? `${checklist.data.done} of ${checklist.data.total}` : "Not started"}
              </span>
              <span className="text-meta font-semibold text-link">Toggle +1</span>
            </Chip>
          </Field>
        </div>

        <div className="mt-5">
          <div className="mb-1.5 text-meta-small font-semibold text-muted-foreground">Description</div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => description.trim() !== (task.description ?? "") && updateTask.mutate({ description: description.trim() || undefined })}
            placeholder="Add a description…"
            aria-label="Task description"
            className="min-h-[88px] w-full resize-y rounded-button border border-line bg-field px-3.5 py-2.5 text-label leading-relaxed placeholder:text-muted-foreground focus:border-primary-2/60 focus:outline-none"
          />
        </div>

        <div className="mt-5">
          <div className="mb-1.5 text-meta-small font-semibold text-muted-foreground">
            Comments {commentCount > 0 ? `(${commentCount})` : ""}
          </div>
          <div className="space-y-4">
            {(commentsData.data ?? []).map((c: { id: string; userId: string; body: string; at: string }) => {
              const author = userMap[c.userId];
              return (
                <div key={c.id} className="flex items-start gap-2.5">
                  <Avatar user={author} size={24} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-label font-semibold">{author.name}</span>
                      <span className="text-meta-small text-muted-foreground">
                        <TimeAgo iso={c.at} />
                      </span>
                    </div>
                    <p className="mt-1 text-label leading-relaxed text-muted">{c.body}</p>
                  </div>
                </div>
              );
            })}
            {!commentsData.data || commentsData.data.length === 0 ? (
              <p className="text-label text-muted-foreground">No comments yet — this thread is open.</p>
            ) : null}
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <Avatar user={{ id: user?.id ?? "u-you", name: user?.name ?? "You", color: user?.color ?? "#4f6bff" }} size={26} />
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-button border border-line bg-field px-3 py-2 focus-within:border-primary-2/60">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddComment();
                }}
                placeholder="Write a comment…"
                aria-label="Write a comment"
                className="min-w-0 flex-1 bg-transparent text-label placeholder:text-muted-foreground focus:outline-none"
              />
              <Button
                type="button"
                onClick={handleAddComment}
                disabled={!comment.trim() || addComment.isPending}
                variant="primary"
                size="sm"
                aria-label="Send comment"
                icon={<Icons.SendIcon size={12} />}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-line px-6 py-3.5">
        <div className="flex items-center gap-2">
          <span className="mr-1 text-meta-small font-semibold text-muted-foreground">Assignees</span>
          <span className="flex items-center">
            {assignees.map((u: import("@flow/shared").User, i: number) => (
              <span key={u.id} className={i === 0 ? "" : "-ml-1.75"}>
                <Avatar user={u} size={24} />
              </span>
            ))}
          </span>
          {assignees.length === 0 && <span className="text-label text-muted-foreground">Unassigned</span>}
          <AssigneePicker board={board} task={task} />
        </div>
        <Button
          type="button"
          variant="destructive"
          icon={<Icons.TrashIcon size={13} />}
          onClick={() => {
            deleteTask.mutate(task.id);
            onClose();
          }}
        >
          Delete task
        </Button>
      </div>
    </Modal>
  );
}