import * as z from "zod"
import { TagType } from "./task"

export const CreateTask = z.object({
  columnId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  tag: TagType.optional(),
  assignees: z.array(z.string().uuid()).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  position: z.number().int().optional(),
})

export type CreateTask = z.infer<typeof CreateTask>
