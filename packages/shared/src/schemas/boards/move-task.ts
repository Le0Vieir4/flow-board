import * as z from "zod"

export const MoveTask = z.object({
  boardId: z.string().uuid(),
  taskId: z.number().int(),
  toColumnId: z.string().uuid(),
})

export type MoveTask = z.infer<typeof MoveTask>
