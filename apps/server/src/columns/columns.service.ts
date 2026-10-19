import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { boardColumns, boards, boardMembers } from "../db/schema";

export interface ColumnDetail {
  id: string;
  boardId: string;
  name: string;
  position: number;
}

function assertBoardAccess(board: typeof boards.$inferSelect, userId: string) {
  const isOwner = board.ownerId === userId;
  if (!isOwner) throw new ForbiddenException("Access to board is restricted");
}

@Injectable()
export class ColumnsService {
  private async getColumnWithBoard(columnId: string) {
    const [column] = await db.select().from(boardColumns).where(eq(boardColumns.id, columnId));
    if (!column) throw new NotFoundException("Column not found");

    const [board] = await db.select().from(boards).where(eq(boards.id, column.boardId));
    if (!board) throw new NotFoundException("Board not found");

    return { column, board };
  }

  async create(boardId: string, userId: string, name: string): Promise<ColumnDetail> {
    const [board] = await db.select().from(boards).where(eq(boards.id, boardId));
    if (!board) throw new NotFoundException("Board not found");
    if (board.ownerId !== userId) {
      const [member] = await db
        .select()
        .from(boardMembers)
        .where(and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, userId)));
      if (!member) throw new ForbiddenException("Access to board is restricted");
    }

    const rows = await db
      .select({ position: boardColumns.position })
      .from(boardColumns)
      .where(eq(boardColumns.boardId, boardId));
    const position = (rows.reduce((max, r) => Math.max(max, r.position), -1) ?? -1) + 1;

    const [created] = await db
      .insert(boardColumns)
      .values({ boardId, name, position } as typeof boardColumns.$inferInsert)
      .returning();
    return { id: created.id, boardId: created.boardId, name: created.name, position: created.position };
  }

  async update(columnId: string, userId: string, name: string): Promise<ColumnDetail> {
    const { column, board } = await this.getColumnWithBoard(columnId);
    assertBoardAccess(board, userId);

    const [updated] = await db
      .update(boardColumns)
      .set({ name })
      .where(eq(boardColumns.id, columnId))
      .returning();
    if (!updated) throw new NotFoundException("Column not found");
    return { id: updated.id, boardId: updated.boardId, name: updated.name, position: updated.position };
  }

  async remove(columnId: string, userId: string): Promise<void> {
    const { board } = await this.getColumnWithBoard(columnId);
    assertBoardAccess(board, userId);
    await db.delete(boardColumns).where(eq(boardColumns.id, columnId));
  }
}
