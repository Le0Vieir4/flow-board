import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq, desc } from "drizzle-orm";
import { db } from "../db";
import { boards, boardMembers, comments, tasks } from "../db/schema";

export interface CommentDetail {
  id: string;
  taskId: number;
  userId: string;
  body: string;
  at: string;
}

function mapComment(row: typeof comments.$inferSelect): CommentDetail {
  return {
    id: row.id,
    taskId: row.taskId,
    userId: row.userId,
    body: row.body,
    at: row.createdAt.toISOString(),
  };
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
export class CommentsService {
  private async getTaskWithBoardAccess(taskId: number, userId: string) {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId));
    if (!task) throw new NotFoundException("Task not found");
    await requireBoardMember(task.boardId, userId);
    return task;
  }

  async create(input: { taskId: number; userId: string; body: string }): Promise<CommentDetail> {
    await this.getTaskWithBoardAccess(input.taskId, input.userId);

    const [created] = await db
      .insert(comments)
      .values({
        taskId: input.taskId,
        userId: input.userId,
        body: input.body,
      } as typeof comments.$inferInsert)
      .returning();

    return mapComment(created);
  }

  async findAll(taskId: number, userId: string): Promise<CommentDetail[]> {
    await this.getTaskWithBoardAccess(taskId, userId);

    const rows = await db
      .select()
      .from(comments)
      .where(eq(comments.taskId, taskId))
      .orderBy(desc(comments.createdAt));

    return rows.map(mapComment);
  }
}
