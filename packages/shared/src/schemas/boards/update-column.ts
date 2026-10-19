import * as z from "zod"

export const UpdateColumn = z.object({
  name: z.string().min(1).max(100).optional(),
})

export type UpdateColumn = z.infer<typeof UpdateColumn>
