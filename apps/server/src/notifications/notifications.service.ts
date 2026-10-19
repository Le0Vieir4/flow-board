import { Injectable, NotFoundException } from "@nestjs/common";
import { and, eq, desc } from "drizzle-orm";
import { db } from "../db";
import { notifications, users } from "../db/schema";
import type { User } from "@flow/shared";

export type NotificationKind = "moved" | "created" | "assigned" | "comment" | "mention";

export interface NotificationDetail {
  id: string;
  kind: NotificationKind;
  actorId: string;
  actorName: string;
  actorColor: string;
  boardId: string;
  taskId: number | null;
  taskLabel: string | null;
  taskTitle: string | null;
  columnName: string | null;
  read: boolean;
  at: string;
}

function mapNotification(row: typeof notifications.$inferSelect, actor: typeof users.$inferSelect): NotificationDetail {
  return {
    id: row.id,
    kind: row.kind as NotificationKind,
    actorId: row.actorId,
    actorName: actor.name,
    actorColor: actor.color,
    boardId: row.boardId,
    taskId: row.taskId ?? null,
    taskLabel: row.taskLabel ?? null,
    taskTitle: row.taskTitle ?? null,
    columnName: row.columnName ?? null,
    read: row.read,
    at: row.createdAt.toISOString(),
  };
}

@Injectable()
export class NotificationsService {
  async create(input: {
    userId: string;
    kind: NotificationKind;
    actorId: string;
    boardId: string;
    taskId?: number | null;
    taskLabel?: string | null;
    taskTitle?: string | null;
    columnName?: string | null;
  }): Promise<void> {
    await db.insert(notifications).values({
      userId: input.userId,
      actorId: input.actorId,
      kind: input.kind,
      boardId: input.boardId,
      taskId: input.taskId ?? null,
      taskLabel: input.taskLabel ?? null,
      taskTitle: input.taskTitle ?? null,
      columnName: input.columnName ?? null,
    });
  }

  async findAll(userId: string): Promise<NotificationDetail[]> {
    const rows = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));

    const actorIds = [...new Set(rows.map((r) => r.actorId))];
    const actors = await db.select().from(users).where(and(...actorIds.map((id) => eq(users.id, id))));
    const actorById = new Map(actors.map((a) => [a.id, a]));

    return rows.map((row) => mapNotification(row, actorById.get(row.actorId)!));
  }

  async unreadCount(userId: string): Promise<number> {
    const rows = await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
    return rows.length;
  }

  async markRead(id: string, userId: string): Promise<void> {
    const [row] = await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning();
    if (!row) throw new NotFoundException("Notification not found");
  }

  async markAllRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
  }
}
