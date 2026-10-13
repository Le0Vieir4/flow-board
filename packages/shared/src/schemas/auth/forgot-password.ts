import * as z from "zod"
import { emailSchema } from "./password"

export const ForgotPasswordRequest = z.object({
  email: emailSchema,
})

export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequest>