import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { eq, desc, inArray } from "drizzle-orm";
import { db } from "../db";
import { requireBoardMember } from "../common/board-access";
import { BoardStatus } from "@flow/shared";
import { boards, boardMembers, boardColumns, tasks, taskAssignees, taskChecklists, comments } from "../db/schema";

export interface TaskComment {
  id: string;
  userId: string;
  body: string;
  at: string;
}

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
  checklistId: string | null;
  comments: TaskComment[];
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

function mapTask(
  row: typeof tasks.$inferSelect,
  assignees: string[],
  checklistRow: typeof taskChecklists.$inferSelect | null,
  taskComments: TaskComment[],
): TaskDetail {
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
    checklistId: checklistRow?.id ?? null,
    comments: taskComments,
    dueDate: row.dueDate ?? null,
    position: row.position,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

@Injectable()
export class BoardsService {
  async assertBoardAccess(boardId: string, userId: string): Promise<void> {
    await requireBoardMember(boardId, userId);
  }

  private async ensureBoardOwner(boardId: string, userId: string): Promise<typeof boards.$inferSelect> {
    const board = await requireBoardMember(boardId, userId);
    if (board.ownerId !== userId) throw new ForbiddenException("Only the board owner can do this");
    return board;
  }

  async loadBoardDetail(boardId: string): Promise<BoardDetail> {
    const [board] = await db.select().from(boards).where(eq(boards.id, boardId));
    if (!board) throw new NotFoundException("Board not found");

    const memberRows = await db.select().from(boardMembers).where(eq(boardMembers.boardId, boardId));

    const columns = await db
      .select()
      .from(boardColumns)
      .where(eq(boardColumns.boardId, boardId))
      .orderBy(boardColumns.position);

    const columnIds = columns.map((c) => c.id);
    const taskRows = columnIds.length
      ? await db
          .select()
          .from(tasks)
          .where(inArray(tasks.columnId, columnIds))
          .orderBy(desc(tasks.number))
      : [];
    const taskIds = taskRows.map((t) => t.id);

    const assigneeRows = taskIds.length
      ? await db
          .select({ taskId: taskAssignees.taskId, userId: taskAssignees.userId })
          .from(taskAssignees)
          .where(inArray(taskAssignees.taskId, taskIds))
      : [];
    const checklistRows = taskIds.length
      ? await db.select().from(taskChecklists).where(inArray(taskChecklists.taskId, taskIds))
      : [];
    const commentRows = taskIds.length
      ? await db
          .select()
          .from(comments)
          .where(inArray(comments.taskId, taskIds))
          .orderBy(desc(comments.createdAt))
      : [];

    const assigneesByTask = new Map<number, string[]>();
    for (const row of assigneeRows) {
      const list = assigneesByTask.get(row.taskId) ?? [];
      list.push(row.userId);
      assigneesByTask.set(row.taskId, list);
    }

    const checklistByTask = new Map(checklistRows.map((r) => [r.taskId, r]));

    const commentsByTask = new Map<number, TaskComment[]>();
    for (const c of commentRows) {
      const list = commentsByTask.get(c.taskId) ?? [];
      list.push({ id: c.id, userId: c.userId, body: c.body, at: c.createdAt.toISOString() });
      commentsByTask.set(c.taskId, list);
    }

    const tasksByColumn = new Map<string, typeof tasks.$inferSelect[]>();
    for (const task of taskRows) {
      const list = tasksByColumn.get(task.columnId) ?? [];
      list.push(task);
      tasksByColumn.set(task.columnId, list);
    }

    const columnDetails: ColumnDetail[] = await Promise.all(
      columns.map(async (column) => ({
        id: column.id,
        boardId: column.boardId,
        name: column.name,
        position: column.position,
        tasks: await Promise.all(
          (tasksByColumn.get(column.id) ?? []).map((task) =>
            mapTask(
              task,
              assigneesByTask.get(task.id) ?? [],
              checklistByTask.get(task.id) ?? null,
              commentsByTask.get(task.id) ?? [],
            ),
          ),
        ),
      })),
    );

    return {
      id: board.id,
      name: board.name,
      idPrefix: board.idPrefix,
      favorite: board.favorite,
      status: board.status,
      ownerId: board.ownerId,
      members: memberRows.map((m) => m.userId),
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
    await requireBoardMember(boardId, userId);
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
    await db.insert(boardColumns).values(
      defaultColumns.map((name, position) => ({ boardId: board.id, name, position } as typeof boardColumns.$inferInsert)),
    );

    return this.loadBoardDetail(board.id);
  }

  async update(
    boardId: string,
    userId: string,
    patch: { name?: string; favorite?: boolean; status?: string },
  ): Promise<BoardDetail> {
    await requireBoardMember(boardId, userId);
    if (patch.status !== undefined && !BoardStatus.safeParse(patch.status).success) {
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
    await requireBoardMember(boardId, userId);
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

    let number = await this.nextTaskNumber(newBoard.id);
    for (const column of source.columns) {
      const [newCol] = await db
        .insert(boardColumns)
        .values({ boardId: newBoard.id, name: column.name, position: column.position } as typeof boardColumns.$inferInsert)
        .returning();
      for (const task of column.tasks) {
        number += 1;
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

  private async nextTaskNumber(boardId: string): Promise<number> {
    const numberRows = await db.select({ number: tasks.number }).from(tasks).where(eq(tasks.boardId, boardId));
    return numberRows.reduce((max, r) => Math.max(max, r.number), 0);
  }
}
