import * as z from "zod"
import { TagType } from "./task"

export const UpdateTask = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  tag: TagType.optional(),
  assignees: z.array(z.string().uuid()).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  position: z.number().int().optional(),
})

export type UpdateTask = z.infer<typeof UpdateTask>
