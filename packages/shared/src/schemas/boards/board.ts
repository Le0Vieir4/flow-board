import * as z from "zod"
import { Task } from "./task"

export const BoardStatus = z.enum(["active", "on-hold", "archived"])

export const Column = z.object({
  id: z.string(),
  name: z.string().min(1),
  position: z.number(),
  tasks: z.array(Task),
})

export const Board = z.object({
  id: z.string(),
  name: z.string().min(1),
  idPrefix: z.string().min(1),
  favorite: z.boolean(),
  status: BoardStatus,
  ownerId: z.string(),
  members: z.array(z.string()),
  updatedAt: z.string(),
  columns: z.array(Column),
})

export type Board = z.infer<typeof Board>
export type BoardStatus = z.infer<typeof BoardStatus>
export type Column = z.infer<typeof Column>
