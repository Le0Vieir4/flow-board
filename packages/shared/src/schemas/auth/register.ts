import * as z from "zod"
import { emailSchema, passwordSchema, usernameSchema } from "./password"

export const RegisterRequest = z.object({
  name: z.string().min(1).max(100),
  username: usernameSchema.optional(),
  email: emailSchema,
  password: passwordSchema,
})

export type RegisterRequest = z.infer<typeof RegisterRequest>
