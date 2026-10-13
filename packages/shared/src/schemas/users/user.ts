import * as z from "zod";

export const UserRole = z.enum(["USER", "ADMIN"]);

export const User = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  username: z.string().min(3).max(30),
  avatar: z.string().url().nullable(),
  color: z.string(),
  role: UserRole,
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type User = z.infer<typeof User>
export type UserRole = z.infer<typeof UserRole>
