import * as z from "zod"

export const ClientMessage = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("subscribe"),
    clientId: z.string(),
    boardId: z.string(),
  }),
  z.object({
    type: z.literal("unsubscribe"),
    clientId: z.string(),
    boardId: z.string(),
  }),
  z.object({
    type: z.literal("task.moved"),
    clientId: z.string(),
    boardId: z.string(),
    taskId: z.number().int(),
    toColumnId: z.string(),
  }),
  z.object({
    type: z.literal("comment.created"),
    clientId: z.string(),
    boardId: z.string(),
    taskId: z.number().int(),
    commentId: z.string(),
    userId: z.string(),
    userName: z.string(),
    body: z.string(),
  }),
])

export const ServerMessage = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("task.moved"),
    clientId: z.string().optional(),
    boardId: z.string(),
    taskId: z.number().int().optional(),
    toColumnId: z.string(),
    toColumnName: z.string().optional(),
    userId: z.string().optional(),
    userName: z.string().optional(),
    taskLabel: z.string().optional(),
    at: z.string().optional(),
  }),
  z.object({
    type: z.literal("comment.created"),
    clientId: z.string().optional(),
    boardId: z.string(),
    taskId: z.number().int().optional(),
    commentId: z.string().optional(),
    userId: z.string().optional(),
    userName: z.string().optional(),
    userColor: z.string().optional(),
    body: z.string().optional(),
    at: z.string().optional(),
  }),
  z.object({
    type: z.literal("presence"),
    clientId: z.string().optional(),
    boardId: z.string(),
    userId: z.string().optional(),
    online: z.boolean().optional(),
  }),
])

export type ClientMessage = z.infer<typeof ClientMessage>
export type ServerMessage = z.infer<typeof ServerMessage>
