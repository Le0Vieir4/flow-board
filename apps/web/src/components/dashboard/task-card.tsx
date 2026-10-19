"use client";

import { memo } from "react";
import type { Task } from "@flow/shared";
import { userById } from "@/lib/mock-data";
import { shortDate } from "@/lib/time";
import { AvatarStack } from "@flow/ui";
import { Tag, TagLabel } from "@flow/ui";
import { Icons } from "@flow/ui/icons";

export const TaskCard = memo(function TaskCard({
  task,
  dragging,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  task: Task;
  dragging: boolean;
  onOpen: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const assignees = task.assignees.map(userById);

  const baseClasses = "w-full cursor-pointer rounded-card border border-line-soft bg-card p-card text-left transition-all duration-150 select-none hover:border-white/14 focus-visible:outline-primary-2";

  const draggingClasses = "shadow-elevated opacity-90 rotate-2 z-50";

  return (
    <button
      type="button"
      onClick={onOpen}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", `${task.id}`);
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`${baseClasses} ${dragging ? draggingClasses : ""}`}
    >
      <span className="block text-micro text-muted">{task.label}</span>
      <span className="mt-1 block text-title leading-snug font-medium text-foreground">{task.title}</span>
      <span className="mt-2.5 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          {task.tag && <Tag type={task.tag}>{TagLabel(task.tag)}</Tag>}
          {task.dueDate && (
            <span className="flex items-center gap-1.5 text-meta-small font-medium text-muted">
              <Icons.ClockIcon size={11} />
              {shortDate(task.dueDate)}
            </span>
          )}
        </span>
        <span className="flex items-center gap-2">
          {task.checklist && (
            <span className="flex items-center gap-1.5 text-meta-small font-semibold text-muted">
              <Icons.ChecklistIcon size={11} />
              {task.checklist.done}/{task.checklist.total}
            </span>
          )}
          {assignees.length > 0 && (
            <AvatarStack users={assignees} size={18} max={3} />
          )}
        </span>
      </span>
    </button>
  );
});