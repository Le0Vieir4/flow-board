import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { boards, boardMembers } from "../db/schema";

export async function requireBoardMember(boardId: string, userId: string) {
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

export function nextPosition(rows: { position: number }[]): number {
  return rows.reduce((max, r) => Math.max(max, r.position), -1) + 1;
}
