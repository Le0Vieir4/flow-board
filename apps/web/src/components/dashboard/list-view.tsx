"use client";

import { useState } from "react";
import { useBoard, useMoveTask } from "@/hooks/queries/boards";
import { TimeAgo } from "./time-ago";
import { Icons } from "@flow/ui/icons";

const TAG_COLORS: Record<string, string> = {
  electric: "#3b5bff",
  design: "#6a4fd6",
  high: "#c24545",
  medium: "#9c6327",
  low: "#217a4d",
};

type FlatTask = {
  id: number;
  label: string;
  title: string;
  tag: string | null;
  dueDate: string | null;
  column: string;
  columnId: string;
};

export function ListView({ boardId }: { boardId: string }) {
  const { data: board, isLoading } = useBoard(boardId);
  const moveTask = useMoveTask();
  const [moving, setMoving] = useState<number | null>(null);

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
      </div>
    );
  }

  const flat: FlatTask[] = [];
  for (const column of board.columns) {
    for (const task of column.tasks) {
      flat.push({
        id: task.id,
        label: task.label,
        title: task.title,
        tag: task.tag ?? null,
        dueDate: task.dueDate ?? null,
        column: column.name,
        columnId: column.id,
      });
    }
  }

  function moveTo(taskId: number, toColumnId: string) {
    if (!board) return;
    setMoving(taskId);
    moveTask.mutate({ boardId: board.id, taskId, toColumnId }, { onSettled: () => setMoving(null) });
  }

  return (
    <div className="p-6 pb-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-stub-heading">{board.name}</h1>
          <p className="text-meta text-muted-foreground">
            List view · {flat.length} task{flat.length !== 1 ? "s" : ""}
          </p>
        </div>
        <a href={`/dashboard/boards/${board.id}`} className="inline-flex items-center gap-2 rounded-badge border border-line bg-white/3 px-4 py-[11px] text-[14px] font-medium hover:bg-white/6">
          <Icons.ArrowLeftIcon size={15} /> Back to board
        </a>
      </div>

      {flat.length === 0 ? (
        <div className="rounded-lg border border-line bg-card p-6 text-center text-muted-foreground">
          <Icons.ListIcon size={48} className="mx-auto mb-3" />
          <h3 className="text-label font-medium">No tasks yet</h3>
          <p className="mt-2 max-w-xs">Add tasks from the board view to see them here.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-line bg-card shadow-sm overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-panel-2 text-left">
                <th className="p-3 text-meta-small font-medium text-muted-foreground w-[72px]">ID</th>
                <th className="p-3 text-meta-small font-medium text-muted-foreground">Title</th>
                <th className="p-3 text-meta-small font-medium text-muted-foreground">Column</th>
                <th className="p-3 text-meta-small font-medium text-muted-foreground">Tag</th>
                <th className="p-3 text-meta-small font-medium text-muted-foreground">Due</th>
                <th className="p-3 text-meta-small font-medium text-muted-foreground w-[130px]">Move</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {flat.map((task) => (
                <tr key={task.id} className="hover:bg-white/3 transition-colors">
                  <td className="p-3 text-[10.5px] font-medium text-muted-foreground">{task.label}</td>
                  <td className="p-3 text-label font-medium truncate max-w-[260px]">{task.title}</td>
                  <td className="p-3 text-meta text-muted">{task.column}</td>
                  <td className="p-3">
                    {task.tag ? (
                      <span
                        className="inline-flex items-center rounded-badge px-2 py-[2px] text-[10px] font-semibold text-white"
                        style={{ backgroundColor: TAG_COLORS[task.tag] }}
                      >
                        {task.tag}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-3 text-meta">
                    {task.dueDate ? <TimeAgo iso={task.dueDate} /> : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="p-3">
                    <select
                      value={task.columnId}
                      onChange={(e) => moveTo(task.id, e.target.value)}
                      disabled={moving === task.id}
                      className="w-full text-[11px] border border-line rounded-badge bg-field px-2 py-1 text-meta focus:outline-none"
                    >
                      {board.columns.map((c) => (
                        <option key={c.id} value={c.id} disabled={c.id === task.columnId}>
                          {c.id === task.columnId ? `${c.name} (current)` : c.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
