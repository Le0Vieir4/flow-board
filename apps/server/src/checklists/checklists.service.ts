import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { requireBoardMember } from "../common/board-access";
import { boardColumns, tasks, taskChecklists } from "../db/schema";

export interface ChecklistDetail {
  id: string;
  taskId: number;
  done: number;
  total: number;
  updatedAt: Date;
}

function mapChecklist(row: typeof taskChecklists.$inferSelect): ChecklistDetail {
  return {
    id: row.id,
    taskId: row.taskId,
    done: row.done,
    total: row.total,
    updatedAt: row.updatedAt,
  };
}

@Injectable()
export class ChecklistsService {
  private async getTaskWithBoardAccess(taskId: number, userId: string) {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId));
    if (!task) throw new NotFoundException("Task not found");
    await requireBoardMember(task.boardId, userId);
    return task;
  }

  async get(taskId: number, userId: string): Promise<ChecklistDetail | null> {
    await this.getTaskWithBoardAccess(taskId, userId);
    const [row] = await db
      .select()
      .from(taskChecklists)
      .where(eq(taskChecklists.taskId, taskId));
    if (!row) return null;
    return mapChecklist(row);
  }

  async set(
    taskId: number,
    userId: string,
    input: { done: number; total: number },
  ): Promise<ChecklistDetail> {
    await this.getTaskWithBoardAccess(taskId, userId);

    const [existing] = await db
      .select()
      .from(taskChecklists)
      .where(eq(taskChecklists.taskId, taskId));

    if (existing) {
      const [updated] = await db
        .update(taskChecklists)
        .set({ done: input.done, total: input.total, updatedAt: new Date() })
        .where(eq(taskChecklists.taskId, taskId))
        .returning();
      return mapChecklist(updated);
    }

    const [created] = await db
      .insert(taskChecklists)
      .values({
        taskId,
        done: input.done,
        total: input.total,
      } as typeof taskChecklists.$inferInsert)
      .returning();
    return mapChecklist(created);
  }
}
