import * as z from "zod"

export const RefreshTokenRequest = z.object({
  refreshToken: z.string().min(1),
})

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequest>
