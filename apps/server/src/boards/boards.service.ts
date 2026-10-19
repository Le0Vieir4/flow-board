import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq, desc } from "drizzle-orm";
import { db } from "../db";
import { boards, boardMembers, boardColumns, tasks, taskAssignees } from "../db/schema";

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

export interface ColumnDetail {
  id: string;
  boardId: string;
  name: string;
  position: number;
  tasks: TaskDetail[];
}

export interface BoardDetail {
  id: string;
  name: string;
  idPrefix: string;
  favorite: boolean;
  status: string;
  ownerId: string;
  members: string[];
  updatedAt: Date;
  createdAt: Date;
  columns: ColumnDetail[];
}

type NewBoardInput = {
  name: string;
};

function boardIdPrefix(name: string): string {
  return (
    name
      .split(/\s+/)
      .map((w) => (w[0] ?? "").toUpperCase())
      .join("")
      .slice(0, 2) || "FB"
  );
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

@Injectable()
export class BoardsService {
  private async ensureBoardAccess(boardId: string, userId: string): Promise<typeof boards.$inferSelect> {
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

  async assertBoardAccess(boardId: string, userId: string): Promise<void> {
    await this.ensureBoardAccess(boardId, userId);
  }

  private async ensureBoardOwner(boardId: string, userId: string): Promise<typeof boards.$inferSelect> {
    const board = await this.ensureBoardAccess(boardId, userId);
    if (board.ownerId !== userId) throw new ForbiddenException("Only the board owner can do this");
    return board;
  }

  async loadBoardDetail(boardId: string): Promise<BoardDetail> {
    const [board] = await db.select().from(boards).where(eq(boards.id, boardId));
    if (!board) throw new NotFoundException("Board not found");

    const memberRows = await db.select().from(boardMembers).where(eq(boardMembers.boardId, boardId));
    const members = memberRows.map((m) => m.userId);

    const columns = await db
      .select()
      .from(boardColumns)
      .where(eq(boardColumns.boardId, boardId))
      .orderBy(boardColumns.position);

    const columnDetails: ColumnDetail[] = [];
    for (const column of columns) {
      const taskRows = await db
        .select()
        .from(tasks)
        .where(eq(tasks.columnId, column.id))
        .orderBy(desc(tasks.number));
      const taskDetails: TaskDetail[] = [];
      for (const task of taskRows) {
        const assigneeRows = await db
          .select({ userId: taskAssignees.userId })
          .from(taskAssignees)
          .where(eq(taskAssignees.taskId, task.id));
        taskDetails.push(mapTask(task, assigneeRows.map((a) => a.userId)));
      }
      columnDetails.push({
        id: column.id,
        boardId: column.boardId,
        name: column.name,
        position: column.position,
        tasks: taskDetails,
      });
    }

    return {
      id: board.id,
      name: board.name,
      idPrefix: board.idPrefix,
      favorite: board.favorite,
      status: board.status,
      ownerId: board.ownerId,
      members,
      updatedAt: board.updatedAt,
      createdAt: board.createdAt,
      columns: columnDetails,
    };
  }

  async findAll(userId: string): Promise<BoardDetail[]> {
    const owned = await db.select().from(boards).where(eq(boards.ownerId, userId));
    const memberRows = await db.select({ boardId: boardMembers.boardId }).from(boardMembers).where(eq(boardMembers.userId, userId));
    const memberBoardIds = memberRows.map((m) => m.boardId);

    const boardIds = new Set<string>();
    for (const b of owned) boardIds.add(b.id);
    for (const id of memberBoardIds) boardIds.add(id);

    const details: BoardDetail[] = [];
    for (const id of boardIds) details.push(await this.loadBoardDetail(id));
    return details.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async findOne(boardId: string, userId: string): Promise<BoardDetail> {
    await this.ensureBoardAccess(boardId, userId);
    return this.loadBoardDetail(boardId);
  }

  async create(input: NewBoardInput, ownerId: string): Promise<BoardDetail> {
    const idPrefix = boardIdPrefix(input.name);
    const [board] = await db
      .insert(boards)
      .values({ name: input.name, idPrefix, ownerId } as typeof boards.$inferInsert)
      .returning();
    await db.insert(boardMembers).values({ boardId: board.id, userId: ownerId } as typeof boardMembers.$inferInsert);

    const defaultColumns = ["Backlog", "Todo", "In Progress"];
    for (let i = 0; i < defaultColumns.length; i++) {
      await db
        .insert(boardColumns)
        .values({ boardId: board.id, name: defaultColumns[i], position: i } as typeof boardColumns.$inferInsert);
    }

    return this.loadBoardDetail(board.id);
  }

  async update(
    boardId: string,
    userId: string,
    patch: { name?: string; favorite?: boolean; status?: string },
  ): Promise<BoardDetail> {
    await this.ensureBoardAccess(boardId, userId);
    if (patch.status !== undefined && patch.status !== "active" && patch.status !== "on-hold" && patch.status !== "archived") {
      throw new ForbiddenException("Invalid board status");
    }
    const values: Record<string, unknown> = { updatedAt: new Date() };
    if (patch.name !== undefined) values.name = patch.name;
    if (patch.favorite !== undefined) values.favorite = patch.favorite;
    if (patch.status !== undefined) values.status = patch.status;

    const [board] = await db.update(boards).set(values).where(eq(boards.id, boardId)).returning();
    if (!board) throw new NotFoundException("Board not found");
    return this.loadBoardDetail(board.id);
  }

  async remove(boardId: string, userId: string): Promise<void> {
    await this.ensureBoardOwner(boardId, userId);
    await db.delete(boards).where(eq(boards.id, boardId));
  }

  async duplicate(boardId: string, userId: string): Promise<BoardDetail> {
    await this.ensureBoardAccess(boardId, userId);
    const source = await this.loadBoardDetail(boardId);

    const [newBoard] = await db
      .insert(boards)
      .values({
        name: `${source.name} (copy)`,
        idPrefix: source.idPrefix,
        ownerId: userId,
        favorite: false,
        status: "active",
      } as typeof boards.$inferInsert)
      .returning();
    await db.insert(boardMembers).values({
      boardId: newBoard.id,
      userId,
    } as typeof boardMembers.$inferInsert);

    for (const column of source.columns) {
      const [newCol] = await db
        .insert(boardColumns)
        .values({ boardId: newBoard.id, name: column.name, position: column.position } as typeof boardColumns.$inferInsert)
        .returning();
      for (const task of column.tasks) {
        const numberRows = await db.select({ number: tasks.number }).from(tasks).where(eq(tasks.boardId, newBoard.id));
        const number = numberRows.reduce((max: number, r: { number: number }) => Math.max(max, r.number), 0) + 1;
        const [newTask] = await db
          .insert(tasks)
          .values({
            boardId: newBoard.id,
            columnId: newCol.id,
            number,
            label: `${source.idPrefix}-${number}`,
            title: task.title,
            description: task.description,
            tag: task.tag,
            checklistDone: null,
            checklistTotal: null,
            dueDate: null,
            position: task.position,
          } as typeof tasks.$inferInsert)
          .returning();
        if (task.assignees.length > 0) {
          await db.insert(taskAssignees).values(
            task.assignees.map((uId) => ({ taskId: newTask.id, userId: uId } as typeof taskAssignees.$inferInsert)),
          );
        }
      }
    }

    return this.loadBoardDetail(newBoard.id);
  }
}
