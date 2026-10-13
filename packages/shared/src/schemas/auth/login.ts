import * as z from "zod"
import { emailSchema, passwordSchema } from "./password"

export const LoginRequest = z.object({
  email: emailSchema,
  password: passwordSchema,
  remember: z.boolean().optional().default(false),
})

export type LoginRequest = z.infer<typeof LoginRequest>
