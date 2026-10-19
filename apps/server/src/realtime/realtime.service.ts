import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { WebSocketServer } from "ws";
import type { Server as HttpServer } from "http";
import type { IncomingMessage } from "http";
import { WebSocket } from "ws";
import { ClientMessage, ServerMessage } from "@flow/shared";
import { verifyAccessToken, ACCESS_COOKIE } from "../auth/utils";
import { BoardsService } from "../boards/boards.service";
import { NotificationsService, NotificationKind } from "../notifications/notifications.service";
import { CommentsService } from "../comments/comments.service";
import { UsersService } from "../users/users.service";
import { db } from "../db";
import { taskAssignees, users, boardColumns, tasks } from "../db/schema";
import { eq } from "drizzle-orm";

interface ClientSession {
  userId: string;
  boardId?: string;
}

interface UserInfo {
  name: string;
  color: string;
}

function getCookie(req: IncomingMessage, name: string): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : undefined;
}

@Injectable()
export class RealtimeService implements OnModuleDestroy {
  private readonly logger = new Logger(RealtimeService.name);
  private wss: WebSocketServer | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  private clients = new Map<WebSocket, ClientSession>();
  private boardClients = new Map<string, Set<WebSocket>>();
  private presence = new Map<string, Map<string, boolean>>();
  private userInfo = new Map<string, UserInfo>();

  constructor(
    private boardsService: BoardsService,
    private notificationsService: NotificationsService,
    private commentsService: CommentsService,
    private usersService: UsersService,
  ) {}

  attachHttpServer(httpServer: HttpServer): void {
    this.wss = new WebSocketServer({ server: httpServer, path: "/ws" });
    this.logger.log("WebSocket server listening on /ws");

    this.wss.on("connection", (ws: WebSocket, req: IncomingMessage) => this.onConnection(ws, req));

    this.startHeartbeat();
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (!this.wss) return;
      this.wss.clients.forEach((ws) => {
        if (!(ws as unknown as { isAlive?: boolean }).isAlive) {
          return ws.terminate();
        }
        (ws as unknown as { isAlive?: boolean }).isAlive = false;
        ws.ping();
      });
    }, 30_000);
    if (this.wss) {
      this.wss.on("close", () => {
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
      });
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (this.wss) this.wss.close();
  }

  private onConnection(ws: WebSocket, req: IncomingMessage): void {
    (ws as unknown as { isAlive?: boolean }).isAlive = true;
    ws.on("pong", () => {
      (ws as unknown as { isAlive?: boolean }).isAlive = true;
    });

    const token = getCookie(req, ACCESS_COOKIE);
    const user = token ? verifyAccessToken(token) : null;
    if (!user) {
      this.logger.warn("WebSocket connection rejected: no valid session");
      ws.close(4001, "Authentication required");
      return;
    }

    const origin = req.headers.origin;
    const allowedOrigin = process.env.WEB_URL ?? "http://localhost:3000";
    if (origin && origin !== allowedOrigin) {
      this.logger.warn(`WebSocket connection rejected: origin ${origin}`);
      ws.close(4003, "Origin not allowed");
      return;
    }

    this.logger.log(`WebSocket client connected: user=${user.id}`);

    ws.on("message", (raw: Buffer | string) => this.onMessage(ws, user.id, raw));
    ws.on("close", () => this.onClose(ws));
    ws.on("error", (err) => {
      this.logger.error(`WebSocket error for user=${user.id}`, err);
    });
  }

  private async onMessage(ws: WebSocket, userId: string, raw: Buffer | string): Promise<void> {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw as string);
    } catch {
      return;
    }

    const parsedMessage = ClientMessage.safeParse(parsed);
    if (!parsedMessage.success) return;
    const message = parsedMessage.data;
    const { type } = message;

    try {
      switch (type) {
        case "subscribe":
          await this.handleSubscribe(ws, userId, message.clientId, message.boardId);
          break;
        case "unsubscribe":
          this.handleUnsubscribe(ws, userId, message.clientId, message.boardId);
          break;
        case "task.moved":
          await this.handleTaskMove(ws, userId, message.clientId, message.boardId, message.taskId, message.toColumnId);
          break;
        case "comment.created":
          await this.handleCommentCreate(ws, userId, message.clientId, message.boardId, message.taskId, message.body);
          break;
        default:
          break;
      }
    } catch (err) {
      this.logger.error(`WebSocket message error (${type}):`, err);
      try {
        ws.close(4000, "Message handling failed");
      } catch {
        /* ignore */
      }
    }
  }

  private async handleSubscribe(
    ws: WebSocket,
    userId: string,
    clientId: string,
    boardId: string,
  ): Promise<void> {
    await this.boardsService.assertBoardAccess(boardId, userId);

    const session: ClientSession = { userId, boardId };
    this.clients.set(ws, session);

    let room = this.boardClients.get(boardId);
    if (!room) {
      room = new Set();
      this.boardClients.set(boardId, room);
    }
    room.add(ws);

    let boardPresence = this.presence.get(boardId);
    if (!boardPresence) {
      boardPresence = new Map();
      this.presence.set(boardId, boardPresence);
    }
    if (!boardPresence.has(userId)) {
      boardPresence.set(userId, true);
      this.broadcastPresence(boardId, userId, true, ws);
    }

    // Send the joining client a snapshot of who else is online.
    const online = Array.from(boardPresence.entries())
      .filter(([uid]) => uid !== userId)
      .map(([uid]) => ({ userId: uid, online: true }));
    this.send(ws, { type: "presence.snapshot", boardId, users: online });

    this.logger.log(`WebSocket subscribe: user=${userId} board=${boardId}`);
  }

  private handleUnsubscribe(ws: WebSocket, userId: string, _clientId: string, boardId: string): void {
    const room = this.boardClients.get(boardId);
    if (room) {
      room.delete(ws);
      if (room.size === 0) this.boardClients.delete(boardId);
    }

    const boardPresence = this.presence.get(boardId);
    if (boardPresence) {
      boardPresence.set(userId, false);
      this.broadcastPresence(boardId, userId, false, ws);
    }

    this.clients.delete(ws);
    this.logger.log(`WebSocket unsubscribe: user=${userId} board=${boardId}`);
  }

  private async handleTaskMove(
    ws: WebSocket,
    userId: string,
    _clientId: string,
    boardId: string,
    taskId: number,
    toColumnId: string,
  ): Promise<void> {
    await this.boardsService.assertBoardAccess(boardId, userId);

    const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId));
    if (!task || task.boardId !== boardId) throw new Error("Task not found");

    const [toColumn] = await db.select().from(boardColumns).where(eq(boardColumns.id, toColumnId));
    if (!toColumn || toColumn.boardId !== boardId) throw new Error("Target column not found");

    const actor = await this.getUserInfo(userId);

    // Notify assignees (except the mover).
    const assigneeRows = await db
      .select({ userId: taskAssignees.userId })
      .from(taskAssignees)
      .where(eq(taskAssignees.taskId, taskId));
    const now = new Date().toISOString();
    for (const row of assigneeRows) {
      if (row.userId === userId) continue;
      await this.notificationsService.create({
        userId: row.userId,
        kind: "moved",
        actorId: userId,
        boardId,
        taskId,
        taskLabel: task.label,
        taskTitle: task.title,
        columnName: toColumn.name,
      });
    }

    const message: ServerMessage = {
      type: "task.moved",
      boardId,
      taskId,
      toColumnId,
      toColumnName: toColumn.name,
      userId,
      userName: actor.name,
      taskLabel: task.label,
      at: now,
    };

    this.broadcast(boardId, message, ws);
    this.logger.log(`WebSocket task.moved: user=${userId} task=${taskId} board=${boardId}`);
  }

  private async handleCommentCreate(
    ws: WebSocket,
    userId: string,
    _clientId: string,
    boardId: string,
    taskId: number,
    body: string,
  ): Promise<void> {
    await this.boardsService.assertBoardAccess(boardId, userId);

    const comment = await this.commentsService.create({ taskId, userId, body });

    const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId));
    if (!task || task.boardId !== boardId) throw new Error("Task not found");

    // Notify assignees (except the author).
    const assigneeRows = await db
      .select({ userId: taskAssignees.userId })
      .from(taskAssignees)
      .where(eq(taskAssignees.taskId, taskId));
    const now = new Date().toISOString();
    for (const row of assigneeRows) {
      if (row.userId === userId) continue;
      await this.notificationsService.create({
        userId: row.userId,
        kind: "comment",
        actorId: userId,
        boardId,
        taskId,
        taskLabel: task.label,
        taskTitle: task.title,
        columnName: "",
      });
    }

    const actor = await this.getUserInfo(userId);

    const message: ServerMessage = {
      type: "comment.created",
      boardId,
      taskId,
      commentId: comment.id,
      userId,
      userName: actor.name,
      userColor: actor.color,
      body: comment.body,
      at: now,
    };

    this.broadcast(boardId, message, ws);
    this.logger.log(`WebSocket comment.created: user=${userId} task=${taskId} board=${boardId}`);
  }

  private onClose(ws: WebSocket): void {
    const session = this.clients.get(ws);
    if (!session) return;

    const { userId, boardId } = session;
    if (!boardId) {
      this.clients.delete(ws);
      return;
    }
    this.clients.delete(ws);

    const room = this.boardClients.get(boardId);
    if (room) {
      room.delete(ws);
      if (room.size === 0) this.boardClients.delete(boardId);
    }

    const boardPresence = this.presence.get(boardId);
    if (boardPresence) {
      boardPresence.set(userId, false);
      this.broadcastPresence(boardId, userId, false, ws);
    }

    this.logger.log(`WebSocket client disconnected: user=${userId}`);
  }

  private broadcastPresence(boardId: string, userId: string, online: boolean, excludeWs?: WebSocket): void {
    const message: ServerMessage = {
      type: "presence",
      boardId,
      userId,
      online,
    };
    this.broadcast(boardId, message, excludeWs);
  }

  private broadcast(boardId: string, message: unknown, excludeWs?: WebSocket): void {
    const room = this.boardClients.get(boardId);
    if (!room) return;
    const payload = JSON.stringify(message);
    for (const client of room) {
      if (client === excludeWs) continue;
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }

  private send(ws: WebSocket, message: unknown): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private async getUserInfo(userId: string): Promise<UserInfo> {
    const cached = this.userInfo.get(userId);
    if (cached) return cached;
    try {
      const row = await this.usersService.findRowById(userId);
      if (row) {
        const info: UserInfo = { name: row.name, color: row.color ?? "#4f6bff" };
        this.userInfo.set(userId, info);
        return info;
      }
    } catch {
      /* ignore */
    }
    const fallback: UserInfo = { name: "User", color: "#4f6bff" };
    this.userInfo.set(userId, fallback);
    return fallback;
  }
}
