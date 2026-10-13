import * as z from "zod"

export const TagType = z.enum(["electric", "design", "high", "medium", "low"])

export const Checklist = z.object({
  done: z.number().int().min(0),
  total: z.number().int().min(0),
})

export const Comment = z.object({
  id: z.string(),
  userId: z.string(),
  body: z.string(),
  at: z.string(),
})

export const Task = z.object({
  id: z.number().int(),
  label: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  tag: TagType.optional(),
  assignees: z.array(z.string()),
  checklist: Checklist.optional(),
  dueDate: z.string().optional(),
  createdAt: z.string(),
  comments: z.array(Comment).optional(),
})

export type Task = z.infer<typeof Task>
export type TagType = z.infer<typeof TagType>
export type Checklist = z.infer<typeof Checklist>
export type Comment = z.infer<typeof Comment>
