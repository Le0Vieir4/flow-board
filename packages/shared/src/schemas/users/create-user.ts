import * as z from "zod"
import { UserRole } from "./user"
import { passwordSchema } from "../auth/password"

export const CreateUser = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  username: z.string().min(3).max(30),
  password: passwordSchema,
  avatar: z.string().url().optional(),
  color: z.string().optional(),
  role: UserRole.default("USER"),
  isActive: z.boolean().default(true),
})

export type CreateUser = z.infer<typeof CreateUser>
