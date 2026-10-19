import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { CookieOptions } from "express";
import { authedProcedure, publicProcedure, router } from "../init";
import {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  ChangePasswordRequest,
} from "@flow/shared";
import { AuthService } from "../../auth/auth.service";
import { UsersService } from "../../users/users.service";
import { EmailService } from "../../email/email.service";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "../../auth/utils";

function issueSession(ctx: { setCookie: (name: string, value: string, options?: CookieOptions) => void }, tokens: { accessToken: string; refreshToken: string }) {
  ctx.setCookie(ACCESS_COOKIE, tokens.accessToken);
  ctx.setCookie(REFRESH_COOKIE, tokens.refreshToken);
}

function clearSession(ctx: { clearCookie: (name: string, options?: CookieOptions) => void }) {
  ctx.clearCookie(ACCESS_COOKIE);
  ctx.clearCookie(REFRESH_COOKIE);
}

const usersService = new UsersService();
const emailService = new EmailService();
const authService = new AuthService(usersService, emailService);

export const authRouter = router({
  register: publicProcedure
    .input(RegisterRequest)
    .mutation(async ({ ctx, input }) => {
      const user = await authService.register(input);
      const tokens = await authService.issueTokens(user);
      issueSession(ctx, tokens);
      return { user };
    }),
  login: publicProcedure.input(LoginRequest).mutation(async ({ ctx, input }) => {
    const user = await authService.login(input);
    const tokens = await authService.issueTokens(user);
    issueSession(ctx, tokens);
    return { user };
  }),
  refresh: publicProcedure
    .input(RefreshTokenRequest.optional())
    .mutation(async ({ ctx, input }) => {
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
    if (token) await authService.logout(token);
    clearSession(ctx);
    return { ok: true };
  }),
  me: authedProcedure.query(async ({ ctx }) => {
    return usersService.findById(ctx.user.id);
  }),
  "verify-email": publicProcedure
    .input(VerifyEmailRequest)
    .mutation(async ({ input }) => {
      await authService.verifyEmail(input.token);
      return { ok: true };
    }),
  "forgot-password": publicProcedure
    .input(ForgotPasswordRequest)
    .mutation(async ({ input }) => {
      await authService.sendPasswordReset(input.email);
      return { ok: true };
    }),
  "reset-password": publicProcedure
    .input(ResetPasswordRequest)
    .mutation(async ({ input }) => {
      await authService.resetPassword(input.token, input.password);
      return { ok: true };
    }),
  "resend-verification": publicProcedure
    .input(ResendVerificationRequest)
    .mutation(async ({ input }) => {
      await authService.resendEmailVerification(input.email);
      return { ok: true };
    }),
  "change-password": authedProcedure
    .input(ChangePasswordRequest)
    .mutation(async ({ ctx, input }) => {
      await authService.changePassword(ctx.user.id, input.currentPassword, input.newPassword);
      return { ok: true };
    }),
});
