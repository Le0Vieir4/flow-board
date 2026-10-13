import * as z from "zod"
import { UserRole } from "./user"

export const UpdateUser = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  username: z.string().min(3).max(30),
  password: z.string().min(8),
  avatar: z.string().url().nullable(),
  color: z.string(),
  role: UserRole,
  isActive: z.boolean(),
}).partial()

export type UpdateUser = z.infer<typeof UpdateUser>
