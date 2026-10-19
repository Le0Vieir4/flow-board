import * as z from "zod"
import { emailSchema, passwordSchema, usernameSchema } from "./password"

export const RegisterRequest = z.object({
  name: z.string().min(1).max(100),
  username: usernameSchema.optional(),
  email: emailSchema,
  password: passwordSchema,
  terms: z.boolean().refine((v) => v === true, { message: "You must accept the terms" }),
})

export type RegisterRequest = z.infer<typeof RegisterRequest>
