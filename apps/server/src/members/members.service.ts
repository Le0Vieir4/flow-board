import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { requireBoardMember } from "../common/board-access";
import { boardMembers, users } from "../db/schema";
import type { User } from "@flow/shared";
import { toUser } from "../users/users.service";

@Injectable()
export class MembersService {
  async listMembers(boardId: string, userId: string): Promise<User[]> {
    await requireBoardMember(boardId, userId);

    const memberRows = await db
      .select({ userId: boardMembers.userId })
      .from(boardMembers)
      .where(eq(boardMembers.boardId, boardId));
    if (memberRows.length === 0) return [];

    const uniqueUserIds = [...new Set(memberRows.map((m) => m.userId))];
    const userRows = await db.select().from(users).where(inArray(users.id, uniqueUserIds));
    const userMap = new Map(userRows.map((r) => [r.id, r]));

    return memberRows.map((m) => toUser(userMap.get(m.userId)!));
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
    if (existing) return toUser(targetUser);

    await db.insert(boardMembers).values({
      boardId,
      userId: targetUserId,
    } as typeof boardMembers.$inferInsert);

    return toUser(targetUser);
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
