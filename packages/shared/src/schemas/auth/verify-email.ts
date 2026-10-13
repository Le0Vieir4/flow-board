import * as z from "zod"

export const VerifyEmailRequest = z.object({
  token: z.string().min(1),
})

export type VerifyEmailRequest = z.infer<typeof VerifyEmailRequest>