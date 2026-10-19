import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { CookieOptions } from "express";
import { authedProcedure, publicProcedure, router } from "../init";
import { RegisterRequest, LoginRequest, RefreshTokenRequest } from "@flow/shared";
import { AuthService } from "../../auth/auth.service";
import { UsersService } from "../../users/users.service";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "../../auth/utils";

function issueSession(ctx: { setCookie: (name: string, value: string, options?: CookieOptions) => void }, tokens: { accessToken: string; refreshToken: string }) {
  ctx.setCookie(ACCESS_COOKIE, tokens.accessToken);
  ctx.setCookie(REFRESH_COOKIE, tokens.refreshToken);
}

function clearSession(ctx: { clearCookie: (name: string, options?: CookieOptions) => void }) {
  ctx.clearCookie(ACCESS_COOKIE);
  ctx.clearCookie(REFRESH_COOKIE);
}

export const authRouter = router({
  register: publicProcedure
    .input(RegisterRequest)
    .mutation(async ({ ctx, input }) => {
      const authService = new AuthService(new UsersService());
      const user = await authService.register(input);
      const tokens = await authService.issueTokens(user);
      issueSession(ctx, tokens);
      return { user };
    }),
  login: publicProcedure.input(LoginRequest).mutation(async ({ ctx, input }) => {
    const authService = new AuthService(new UsersService());
    const user = await authService.login(input);
    const tokens = await authService.issueTokens(user);
    issueSession(ctx, tokens);
    return { user };
  }),
  refresh: publicProcedure
    .input(RefreshTokenRequest.optional())
    .mutation(async ({ ctx, input }) => {
      const authService = new AuthService(new UsersService());
      const token = input?.refreshToken ?? ctx.cookies[REFRESH_COOKIE];
      if (!token) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "No refresh token" });
      }
      const { user, tokens } = await authService.refresh(token);
      issueSession(ctx, tokens);
      return { user };
    }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    const token = ctx.cookies[REFRESH_COOKIE];
    const authService = new AuthService(new UsersService());
    if (token) await authService.logout(token);
    clearSession(ctx);
    return { ok: true };
  }),
  me: authedProcedure.query(async ({ ctx }) => {
    return new UsersService().findById(ctx.user.id);
  }),
});
