"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Board, Column, Task } from "@flow/shared";
import { useBoards, usePresence } from "@/lib/boards-store";
import { devUser, userById } from "@/lib/mock-data";
import { TimeAgo } from "./time-ago";
import { Tag, TagLabel, AvatarStack, Chip } from "@flow/ui";
import { Icons } from "@flow/ui/icons";

type Scope = "mine" | "all";

interface Entry {
  task: Task;
  board: Board;
  column: Column;
}

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dueLabel(due?: string, today?: string): { text: string; overdue: boolean } | undefined {
  if (!due) return undefined;
  const day = today ?? dateKey(new Date());
  const pretty = new Date(due).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (due < day) return { text: `Overdue · ${pretty}`, overdue: true };
  if (due === day) return { text: "Due today", overdue: false };
  return { text: pretty, overdue: false };
}

const BUCKETS = [
  { key: "overdue", label: "Overdue", match: (due?: string, today?: string) => !!due && due < (today ?? dateKey(new Date())) },
  { key: "today", label: "Today", match: (due?: string, today?: string) => due === (today ?? dateKey(new Date())) },
  { key: "upcoming", label: "Upcoming", match: (due?: string, today?: string) => !!due && due > (today ?? dateKey(new Date())) },
  { key: "someday", label: "No due date", match: (due?: string) => !due },
] as const;

function TaskRow({ entry }: { entry: Entry }) {
  const router = useRouter();
  const presence = usePresence(entry.board.id);
  const assigneeUsers = entry.task.assignees.map(userById);
  const due = dueLabel(entry.task.dueDate);
  const done = entry.task.checklist ? entry.task.checklist.done >= entry.task.checklist.total : false;

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/boards/${entry.board.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/dashboard/boards/${entry.board.id}`);
        }
      }}
      className="group flex cursor-pointer items-center gap-3 rounded-md border border-line-soft bg-panel p-3 transition-colors duration-150 hover:border-line hover:bg-panel-2"
    >
      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 items-center gap-2">
          {entry.task.tag && <Tag type={entry.task.tag}>{TagLabel(entry.task.tag)}</Tag>}
          <span className={`truncate text-label font-semibold ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
            {entry.task.title}
          </span>
        </span>
        <span className="mt-1 flex items-center gap-1.5 text-meta-small text-muted-foreground">
          <span className="flex-shrink-0">{entry.task.label}</span>
          <span aria-hidden>·</span>
          <span className="flex min-w-0 items-center gap-1 truncate">
            <Icons.BoardIcon size={11} className="flex-shrink-0 opacity-70" />
            <span className="truncate">{entry.board.name}</span>
            <span className="flex-shrink-0 text-muted-foreground/70">· {entry.column.name}</span>
          </span>
          <span aria-hidden>·</span>
          <span className="flex-shrink-0 text-muted-foreground/80">
            <TimeAgo iso={entry.task.createdAt} />
          </span>
        </span>
      </span>

      {due && (
        <span
          className={`flex-shrink-0 rounded-full px-2 py-0.5 text-micro font-semibold ${
            due.overdue ? "bg-warning/10 text-warning" : "bg-white/5 text-muted-foreground"
          }`}
          aria-label={`Due: ${due.text}`}
        >
          {due.text}
        </span>
      )}

      {assigneeUsers.length > 0 && <AvatarStack users={assigneeUsers} presence={presence} size={22} max={3} ringColor="var(--color-panel)" />}
    </div>
  );
}

function Section({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <section className="pt-7 first:pt-0">
      <div className="flex items-center gap-2.5">
        <h2 className="text-headline font-bold">{label}</h2>
        <span className="rounded-full border border-line bg-white/4 px-2 py-0.5 text-meta-small font-semibold text-muted-foreground">
          {count}
        </span>
      </div>
      <div className="mt-3 flex flex-col gap-2">{children}</div>
    </section>
  );
}

const SCOPE_OPTIONS: { key: Scope; label: string }[] = [
  { key: "mine", label: "My tasks" },
  { key: "all", label: "All tasks" },
];

function collectEntries(boards: Board[], scope: Scope): Entry[] {
  const list: Entry[] = [];
  for (const board of boards) {
    if (board.status === "archived") continue;
    for (const column of board.columns) {
      for (const task of column.tasks) {
        if (scope === "mine" && !task.assignees.includes(devUser.id)) continue;
        if (task.checklist && task.checklist.done >= task.checklist.total) continue;
        list.push({ task, board, column });
      }
    }
  }
  return list.sort((a, b) => (a.task.createdAt < b.task.createdAt ? 1 : -1));
}

function collectOpenCount(boards: Board[]): number {
  let count = 0;
  for (const board of boards) {
    if (board.status === "archived") continue;
    for (const column of board.columns) {
      for (const task of column.tasks) {
        if (!task.assignees.includes(devUser.id)) continue;
        if (task.checklist && task.checklist.done >= task.checklist.total) continue;
        count += 1;
      }
    }
  }
  return count;
}

export function MyTasks() {
  const boards = useBoards();
  const [scope, setScope] = useState<Scope>("mine");
  const today = dateKey(new Date());

  const entries = collectEntries(boards, scope);

  const sections = BUCKETS.map((b) => ({ ...b, entries: entries.filter((e) => b.match(e.task.dueDate, today)) })).filter(
    (s) => s.entries.length > 0
  );

  const mineCount = collectOpenCount(boards);

  if (entries.length === 0) {
    return (
      <div className="relative flex min-h-[70dvh] flex-col items-center justify-center p-6">
        <div
          className="pointer-events-none absolute top-[-180px] left-1/2 h-[640px] w-[640px] -translate-x-1/2 globe-glow-tertiary"
        />
        <div className="relative flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
            <Icons.TasksIcon size={24} />
          </span>
          <h1 className="mt-5 text-stub-heading font-extrabold tracking-tight">
            {scope === "mine" ? "Nothing assigned to you" : "No open tasks"}
          </h1>
          <p className="mt-2 max-w-[330px] text-body leading-relaxed text-muted">
            {scope === "mine"
              ? "Tasks your team assigns to you appear here, sorted by what's due first."
              : "Open tasks across your workspace land here, sorted by what's due first."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-stub-heading font-extrabold tracking-tight">My Tasks</h1>
          <span className="text-label font-medium text-muted-foreground">
            {scope === "mine" ? `${mineCount} assigned to you` : `${entries.length} open tasks`}
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-line bg-white/3 p-1">
          {SCOPE_OPTIONS.map((s) => (
            <Chip
              key={s.key}
              variant={scope === s.key ? "active" : "ghost"}
              onClick={() => setScope(s.key)}
              aria-pressed={scope === s.key}
              className="text-meta"
            >
              {s.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="max-w-[860px]">
        {sections.map((s) => (
          <Section key={s.key} label={s.label} count={s.entries.length}>
            {s.entries.map((e) => (
              <TaskRow key={`${e.board.id}-${e.task.id}`} entry={e} />
            ))}
          </Section>
        ))}
      </div>
    </div>
  );
}