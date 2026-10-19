import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { boards, boardColumns, boardMembers, tasks, taskAssignees } from "../db/schema";

export interface TaskDetail {
  id: number;
  boardId: string;
  columnId: string;
  number: number;
  label: string;
  title: string;
  description: string | null;
  tag: string | null;
  assignees: string[];
  checklistDone: number | null;
  checklistTotal: number | null;
  dueDate: string | null;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

function mapTask(row: typeof tasks.$inferSelect, assignees: string[]): TaskDetail {
  return {
    id: row.id,
    boardId: row.boardId,
    columnId: row.columnId,
    number: row.number,
    label: row.label,
    title: row.title,
    description: row.description ?? null,
    tag: row.tag ?? null,
    assignees,
    checklistDone: row.checklistDone ?? null,
    checklistTotal: row.checklistTotal ?? null,
    dueDate: row.dueDate ?? null,
    position: row.position,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function assertBoardAccess(board: typeof boards.$inferSelect, userId: string) {
  if (board.ownerId !== userId) throw new ForbiddenException("Access to board is restricted");
}

async function requireBoardMember(boardId: string, userId: string) {
  const [board] = await db.select().from(boards).where(eq(boards.id, boardId));
  if (!board) throw new NotFoundException("Board not found");
  const isOwner = board.ownerId === userId;
  const [member] = await db
    .select()
    .from(boardMembers)
    .where(and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, userId)));
  if (!isOwner && !member) throw new ForbiddenException("Access to board is restricted");
  return board;
}

@Injectable()
export class TasksService {
  private async getTaskWithBoardAccess(taskId: number, userId: string) {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId));
    if (!task) throw new NotFoundException("Task not found");
    await requireBoardMember(task.boardId, userId);
    return task;
  }

  private async setAssignees(taskId: number, assignees: string[] | undefined) {
    await db.delete(taskAssignees).where(eq(taskAssignees.taskId, taskId));
    if (assignees && assignees.length > 0) {
      await db.insert(taskAssignees).values(
        assignees.map((userId) => ({ taskId, userId } as typeof taskAssignees.$inferInsert)),
      );
    }
  }

  async create(columnId: string, userId: string, input: { title: string; description?: string | null; tag?: string | null; assignees?: string[]; dueDate?: string | null; position?: number }): Promise<TaskDetail> {
    const [column] = await db.select().from(boardColumns).where(eq(boardColumns.id, columnId));
    if (!column) throw new NotFoundException("Column not found");
    const board = await requireBoardMember(column.boardId, userId);

    const numberRows = await db.select({ number: tasks.number }).from(tasks).where(eq(tasks.boardId, board.id));
    const number = numberRows.reduce((max, r) => Math.max(max, r.number), 0) + 1;
    const label = `${board.idPrefix}-${number}`;

    const columnTasks = await db.select({ position: tasks.position }).from(tasks).where(eq(tasks.columnId, columnId));
    const position = input.position ?? (columnTasks.reduce((max, r) => Math.max(max, r.position), -1) + 1);

    const [created] = await db
      .insert(tasks)
      .values({
        boardId: board.id,
        columnId,
        number,
        label,
        title: input.title,
        description: input.description ?? null,
        tag: input.tag ?? null,
        checklistDone: null,
        checklistTotal: null,
        dueDate: input.dueDate ?? null,
        position,
      } as typeof tasks.$inferInsert)
      .returning();

    await this.setAssignees(created.id, input.assignees);
    const assigneeRows = await db
      .select({ userId: taskAssignees.userId })
      .from(taskAssignees)
      .where(eq(taskAssignees.taskId, created.id));
    return mapTask(created, assigneeRows.map((a) => a.userId));
  }

  async update(taskId: number, userId: string, input: { title?: string; description?: string | null; tag?: string | null; assignees?: string[]; dueDate?: string | null; position?: number }): Promise<TaskDetail> {
    const task = await this.getTaskWithBoardAccess(taskId, userId);

    if (input.assignees !== undefined) await this.setAssignees(taskId, input.assignees);

    const values: Record<string, unknown> = { updatedAt: new Date() };
    if (input.title !== undefined) values.title = input.title;
    if (input.description !== undefined) values.description = input.description;
    if (input.tag !== undefined) values.tag = input.tag;
    if (input.dueDate !== undefined) values.dueDate = input.dueDate;
    if (input.position !== undefined) values.position = input.position;

    const [updated] = await db.update(tasks).set(values).where(eq(tasks.id, taskId)).returning();
    if (!updated) throw new NotFoundException("Task not found");

    const assigneeRows = await db
      .select({ userId: taskAssignees.userId })
      .from(taskAssignees)
      .where(eq(taskAssignees.taskId, taskId));
    return mapTask(updated, assigneeRows.map((a) => a.userId));
  }

  async remove(taskId: number, userId: string): Promise<void> {
    await this.getTaskWithBoardAccess(taskId, userId);
    await db.delete(tasks).where(eq(tasks.id, taskId));
  }

  async move(boardId: string, taskId: number, toColumnId: string, userId: string): Promise<{ from: string; to: string }> {
    await requireBoardMember(boardId, userId);

    const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId));
    if (!task || task.boardId !== boardId) throw new NotFoundException("Task not found");

    const [fromColumn] = await db.select().from(boardColumns).where(eq(boardColumns.id, task.columnId));
    const [toColumn] = await db.select().from(boardColumns).where(eq(boardColumns.id, toColumnId));
    if (!toColumn || toColumn.boardId !== boardId) throw new NotFoundException("Target column not found");
    if (fromColumn.id === toColumnId) return { from: fromColumn.name, to: toColumn.name };

    const toTasks = await db.select({ position: tasks.position }).from(tasks).where(eq(tasks.columnId, toColumnId));
    const position = toTasks.reduce((max, r) => Math.max(max, r.position), -1) + 1;

    await db.update(tasks).set({ columnId: toColumnId, position, updatedAt: new Date() }).where(eq(tasks.id, taskId));
    return { from: fromColumn.name, to: toColumn.name };
  }
}
