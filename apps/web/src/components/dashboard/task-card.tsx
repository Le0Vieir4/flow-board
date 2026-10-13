"use client";

import { memo } from "react";
import type { Task } from "@flow/shared";
import { userById } from "@/lib/mock-data";
import { shortDate } from "@/lib/time";
import { Avatar } from "./avatar";
import { Tag } from "./tag";
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

  const baseClasses = "w-full cursor-pointer rounded-[10px] border border-line-soft bg-card p-[11px_12px] text-left transition-all duration-150 select-none hover:border-white/[0.14] focus-visible:outline-primary-2";

  const draggingClasses = "shadow-elevated opacity-90 rotate-[2deg] z-50";

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
      style={dragging ? { transform: "rotate(2deg)" } : undefined}
    >
      <span className="block text-[10.5px] font-medium text-muted">{task.label}</span>
      <span className="mt-[4px] block text-[12.5px] leading-[1.35] font-medium text-[#eef0f6]">{task.title}</span>
      <span className="mt-[10px] flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          {task.tag && <Tag type={task.tag} />}
          {task.dueDate && (
            <span className="flex items-center gap-[4px] text-[11px] font-medium text-muted">
              <Icons.ClockIcon size={11} />
              {shortDate(task.dueDate)}
            </span>
          )}
        </span>
        <span className="flex items-center gap-2">
          {task.checklist && (
            <span className="flex items-center gap-[4px] text-[11px] font-semibold text-muted">
              <Icons.ChecklistIcon size={11} />
              {task.checklist.done}/{task.checklist.total}
            </span>
          )}
          {assignees.length > 0 && (
            <span className="flex items-center">
              {assignees.slice(0, 3).map((u: import("@flow/shared").User, i: number) => (
                <span key={u.id} style={{ marginLeft: i === 0 ? 0 : -7 }}>
                  <Avatar user={u} size={18} />
                </span>
              ))}
            </span>
          )}
        </span>
      </span>
    </button>
  );
});
