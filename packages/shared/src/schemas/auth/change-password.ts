import * as z from "zod"
import { passwordSchema } from "./password"

export const ChangePasswordRequest = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
})

export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequest>