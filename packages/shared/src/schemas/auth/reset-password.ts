import * as z from "zod"
import { passwordSchema } from "./password"

export const ResetPasswordRequest = z.object({
  token: z.string().min(1),
  password: passwordSchema,
})

export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequest>