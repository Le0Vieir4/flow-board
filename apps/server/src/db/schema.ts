import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  avatar: text("avatar"),
  color: text("color").notNull().default("#4f6bff"),
  passwordHash: text("password_hash"),
  googleId: text("google_id").unique(),
  githubId: text("github_id").unique(),
  role: text("role").notNull().default("USER"),
  isActive: boolean("is_active").notNull().default(true),
  emailVerified: boolean("email_verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const boards = pgTable("boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  idPrefix: text("id_prefix").notNull(),
  favorite: boolean("favorite").notNull().default(false),
  status: text("status").notNull().default("active"),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const boardMembers = pgTable(
  "board_members",
  {
    boardId: uuid("board_id")
      .notNull()
      .references(() => boards.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.boardId, t.userId] })]
);

export const boardColumns = pgTable("board_columns", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  position: integer("position").notNull(),
});

export const tasks = pgTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    boardId: uuid("board_id")
      .notNull()
      .references(() => boards.id, { onDelete: "cascade" }),
    columnId: uuid("column_id")
      .notNull()
      .references(() => boardColumns.id, { onDelete: "cascade" }),
    number: integer("number").notNull(),
    label: text("label").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    tag: text("tag"),
    dueDate: date("due_date"),
    position: integer("position").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("tasks_board_number_idx").on(t.boardId, t.number)]
);

export const taskAssignees = pgTable(
  "task_assignees",
  {
    taskId: integer("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.taskId, t.userId] })]
);

export const taskChecklists = pgTable("task_checklists", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  done: integer("done").notNull().default(0),
  total: integer("total").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const taskChecklistsRelations = relations(taskChecklists, ({ one }) => ({
  task: one(tasks, { fields: [taskChecklists.taskId], references: [tasks.id] }),
}));

export const verificationTokens = pgTable("verification_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  type: text("type").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const verificationTokensRelations = relations(verificationTokens, ({ one }) => ({
  user: one(users, { fields: [verificationTokens.userId], references: [users.id] }),
}));

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const boardShares = pgTable("board_shares", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  actorId: uuid("actor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  boardId: uuid("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  taskId: integer("task_id").references(() => tasks.id, { onDelete: "set null" }),
  taskLabel: text("task_label"),
  taskTitle: text("task_title"),
  columnName: text("column_name"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  ownedBoards: many(boards),
  memberships: many(boardMembers),
  assignees: many(taskAssignees),
  notifications: many(notifications),
}));

export const boardsRelations = relations(boards, ({ one, many }) => ({
  owner: one(users, { fields: [boards.ownerId], references: [users.id] }),
  members: many(boardMembers),
  columns: many(boardColumns),
}));

export const boardMembersRelations = relations(boardMembers, ({ one }) => ({
  board: one(boards, { fields: [boardMembers.boardId], references: [boards.id] }),
  user: one(users, { fields: [boardMembers.userId], references: [users.id] }),
}));

export const boardColumnsRelations = relations(boardColumns, ({ one, many }) => ({
  board: one(boards, { fields: [boardColumns.boardId], references: [boards.id] }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  board: one(boards, { fields: [tasks.boardId], references: [boards.id] }),
  column: one(boardColumns, { fields: [tasks.columnId], references: [boardColumns.id] }),
  assignees: many(taskAssignees),
  comments: many(comments),
  checklist: many(taskChecklists),
}));

export const taskAssigneesRelations = relations(taskAssignees, ({ one }) => ({
  task: one(tasks, { fields: [taskAssignees.taskId], references: [tasks.id] }),
  user: one(users, { fields: [taskAssignees.userId], references: [users.id] }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, { fields: [comments.taskId], references: [tasks.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, { fields: [refreshTokens.userId], references: [users.id] }),
}));

export const boardSharesRelations = relations(boardShares, ({ one }) => ({
  board: one(boards, { fields: [boardShares.boardId], references: [boards.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
  actor: one(users, { fields: [notifications.actorId], references: [users.id] }),
  board: one(boards, { fields: [notifications.boardId], references: [boards.id] }),
  task: one(tasks, { fields: [notifications.taskId], references: [tasks.id] }),
}));

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
export type BoardRow = typeof boards.$inferSelect;
export type BoardColumnRow = typeof boardColumns.$inferSelect;
export type TaskRow = typeof tasks.$inferSelect;
export type TaskChecklistRow = typeof taskChecklists.$inferSelect;
export type NewTaskChecklistRow = typeof taskChecklists.$inferInsert;
export type CommentRow = typeof comments.$inferSelect;
export type NotificationRow = typeof notifications.$inferSelect;
export type NewNotificationRow = typeof notifications.$inferInsert;
export type VerificationTokenRow = typeof verificationTokens.$inferSelect;
export type NewVerificationTokenRow = typeof verificationTokens.$inferInsert;
export type BoardMemberRow = typeof boardMembers.$inferSelect;
export type NewBoardMemberRow = typeof boardMembers.$inferInsert;
export type BoardShareRow = typeof boardShares.$inferSelect;
export type NewBoardShareRow = typeof boardShares.$inferInsert;
export type RefreshTokenRow = typeof refreshTokens.$inferSelect;
export type NewRefreshTokenRow = typeof refreshTokens.$inferInsert;
export type TaskAssigneeRow = typeof taskAssignees.$inferSelect;
export type NewTaskAssigneeRow = typeof taskAssignees.$inferInsert;
