import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { boards, boardMembers, users } from "../db/schema";
import type { User } from "@flow/shared";

function mapUser(row: typeof users.$inferSelect): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    username: row.username,
    avatar: row.avatar,
    color: row.color,
    role: row.role as User["role"],
    isActive: row.isActive,
    emailVerified: row.emailVerified,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
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
export class MembersService {
  async listMembers(boardId: string, userId: string): Promise<User[]> {
    await requireBoardMember(boardId, userId);

    const memberRows = await db
      .select({ userId: boardMembers.userId })
      .from(boardMembers)
      .where(eq(boardMembers.boardId, boardId));

    const uniqueUserIds = [...new Set(memberRows.map((m) => m.userId))];
    const userMap = new Map<string, typeof users.$inferSelect>();
    for (const id of uniqueUserIds) {
      const [row] = await db.select().from(users).where(eq(users.id, id));
      if (row) userMap.set(id, row);
    }

    return memberRows.map((m) => mapUser(userMap.get(m.userId)!));
  }

  async addMember(boardId: string, actorId: string, targetUserId: string): Promise<User> {
    const board = await requireBoardMember(boardId, actorId);
    if (board.ownerId !== actorId) throw new ForbiddenException("Only the board owner can add members");

    const [targetUser] = await db.select().from(users).where(eq(users.id, targetUserId));
    if (!targetUser) throw new NotFoundException("User not found");

    const [existing] = await db
      .select()
      .from(boardMembers)
      .where(and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, targetUserId)));
    if (existing) return mapUser(targetUser);

    await db.insert(boardMembers).values({
      boardId,
      userId: targetUserId,
    } as typeof boardMembers.$inferInsert);

    return mapUser(targetUser);
  }

  async removeMember(boardId: string, actorId: string, targetUserId: string): Promise<void> {
    const board = await requireBoardMember(boardId, actorId);
    if (board.ownerId !== actorId) throw new ForbiddenException("Only the board owner can remove members");
    if (targetUserId === board.ownerId) throw new ForbiddenException("Cannot remove the board owner");

    const [targetUser] = await db.select().from(users).where(eq(users.id, targetUserId));
    if (!targetUser) throw new NotFoundException("User not found");

    await db
      .delete(boardMembers)
      .where(and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, targetUserId)));
  }
}
