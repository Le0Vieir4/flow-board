import * as z from "zod"

export const CreateColumn = z.object({
  boardId: z.string().uuid(),
  name: z.string().min(1).max(100),
})

export type CreateColumn = z.infer<typeof CreateColumn>
