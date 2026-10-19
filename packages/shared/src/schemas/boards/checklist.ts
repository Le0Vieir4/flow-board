import * as z from "zod"

export const Checklist = z.object({
  id: z.string(),
  taskId: z.number().int(),
  done: z.number().int().min(0),
  total: z.number().int().min(0),
  updatedAt: z.string(),
})

export type Checklist = z.infer<typeof Checklist>

export const SetChecklist = z.object({
  taskId: z.number().int(),
  done: z.number().int().min(0),
  total: z.number().int().min(0),
})

export type SetChecklist = z.infer<typeof SetChecklist>
