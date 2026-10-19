import { Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { nextPosition, requireBoardMember } from "../common/board-access";
import { boardColumns } from "../db/schema";

export interface ColumnDetail {
  id: string;
  boardId: string;
  name: string;
  position: number;
}

@Injectable()
export class ColumnsService {
  private async getColumn(columnId: string) {
    const [column] = await db.select().from(boardColumns).where(eq(boardColumns.id, columnId));
    if (!column) throw new NotFoundException("Column not found");
    return column;
  }

  async create(boardId: string, userId: string, name: string): Promise<ColumnDetail> {
    await requireBoardMember(boardId, userId);

    const rows = await db
      .select({ position: boardColumns.position })
      .from(boardColumns)
      .where(eq(boardColumns.boardId, boardId));
    const position = nextPosition(rows);

    const [created] = await db
      .insert(boardColumns)
      .values({ boardId, name, position } as typeof boardColumns.$inferInsert)
      .returning();
    return { id: created.id, boardId: created.boardId, name: created.name, position: created.position };
  }

  async update(columnId: string, userId: string, name: string): Promise<ColumnDetail> {
    const column = await this.getColumn(columnId);
    await requireBoardMember(column.boardId, userId);

    const [updated] = await db
      .update(boardColumns)
      .set({ name })
      .where(eq(boardColumns.id, columnId))
      .returning();
    if (!updated) throw new NotFoundException("Column not found");
    return { id: updated.id, boardId: updated.boardId, name: updated.name, position: updated.position };
  }

  async remove(columnId: string, userId: string): Promise<void> {
    const column = await this.getColumn(columnId);
    await requireBoardMember(column.boardId, userId);
    await db.delete(boardColumns).where(eq(boardColumns.id, columnId));
  }
}
