import * as z from "zod"

export const UpdateBoard = z.object({
  name: z.string().min(1).max(100).optional(),
  favorite: z.boolean().optional(),
  status: z.enum(["active", "on-hold", "archived"]).optional(),
})

export type UpdateBoard = z.infer<typeof UpdateBoard>
