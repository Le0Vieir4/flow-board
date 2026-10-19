"use client";

import { useState } from "react";
import { useBoard } from "@/hooks/queries/boards";
import { Button } from "@flow/ui";
import { Icons } from "@flow/ui/icons";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView({ boardId }: { boardId: string }) {
  const { data: board, isLoading } = useBoard(boardId);
  const [viewMonth, setViewMonth] = useState<Date>(new Date());

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

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();

  const tasksByDay = new Map<string, Array<{ id: number; label: string; title: string }>>();
  const undated: Array<{ id: number; label: string; title: string }> = [];
  for (const column of board.columns) {
    for (const task of column.tasks) {
      if (!task.dueDate) {
        undated.push({ id: task.id, label: task.label, title: task.title });
        continue;
      }
      const day = tasksByDay.get(task.dueDate) ?? [];
      day.push({ id: task.id, label: task.label, title: task.title });
      tasksByDay.set(task.dueDate, day);
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthName = viewMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const prevMonth = new Date(year, month - 1, 1);
  const nextMonth = new Date(year, month + 1, 1);

  const days: Array<{ date: number; isCurrentMonth: boolean; isToday: boolean; tasks: Array<{ id: number; label: string; title: string }> }> = [];
  for (let i = 0; i < startOffset; i++) {
    days.push({ date: lastDay.getDate() - startOffset + i + 1, isCurrentMonth: false, isToday: false, tasks: [] });
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const ds = new Date(year, month, d);
    const iso = ds.toISOString().slice(0, 10);
    days.push({
      date: d,
      isCurrentMonth: true,
      isToday: ds.getTime() === today.getTime(),
      tasks: tasksByDay.get(iso) ?? [],
    });
  }
  const totalCells = 42;
  for (let i = days.length; i < totalCells; i++) {
    days.push({ date: i - lastDay.getDate() - startOffset + 1, isCurrentMonth: false, isToday: false, tasks: [] });
  }

  return (
    <div className="p-6 pb-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-stub-heading">{board.name}</h1>
          <p className="text-meta text-muted-foreground">Calendar view · tasks by due date</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMonth(prevMonth)}>
            <Icons.ArrowLeftIcon size={15} />
          </Button>
          <span className="rounded-badge border border-line bg-white/3 px-3 py-[10px] text-[14px] font-medium">{monthName}</span>
          <Button variant="outline" size="sm" onClick={() => setViewMonth(nextMonth)}>
            <Icons.ArrowRightIcon size={15} />
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-card shadow-sm">
        <div className="grid grid-cols-7 border-b border-line bg-panel-2">
          {WEEKDAYS.map((w) => (
            <div key={w} className="p-2 text-center text-[10px] font-medium text-muted-foreground uppercase">
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => (
            <div
              key={day.date}
              className={[
                "border border-line min-h-[96px] p-2 text-[11px]",
                !day.isCurrentMonth ? "bg-white/3 text-muted-foreground/40" : "bg-card",
                day.isToday ? "ring-1 ring-primary-2 bg-white/5" : "",
              ].join(" ")}
            >
              <div className="flex justify-between mb-1">
                <span className={day.isToday ? "font-bold text-foreground" : "text-meta"}>{day.date}</span>
              </div>
              <ul className="space-y-1">
                {day.tasks.slice(0, 3).map((t) => (
                  <li key={t.id} className="flex items-center gap-1.5 truncate">
                    <span className="w-[6px] h-[6px] rounded-full bg-primary shrink-0" />
                    <span className="text-[10px] text-foreground truncate">{t.label}</span>
                  </li>
                ))}
                {day.tasks.length > 3 && (
                  <span className="text-[9px] text-muted-foreground">+{day.tasks.length - 3} more</span>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {undated.length > 0 && (
        <div className="mt-6 rounded-lg border border-line bg-card shadow-sm p-4">
          <h3 className="text-label font-medium mb-3">No due date</h3>
          <ul className="space-y-2">
            {undated.map((t) => (
              <li key={t.id} className="flex items-center justify-between text-sm">
                <span className="text-label truncate">{t.title}</span>
                <span className="text-[10px] text-muted-foreground">{t.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
