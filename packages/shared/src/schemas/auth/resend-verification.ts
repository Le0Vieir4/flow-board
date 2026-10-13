import * as z from "zod"
import { emailSchema } from "./password"

export const ResendVerificationRequest = z.object({
  email: emailSchema,
})

export type ResendVerificationRequest = z.infer<typeof ResendVerificationRequest>