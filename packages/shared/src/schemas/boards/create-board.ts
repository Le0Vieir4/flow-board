import * as z from "zod"

export const CreateBoard = z.object({
  name: z.string().min(1).max(100),
})

export type CreateBoard = z.infer<typeof CreateBoard>
