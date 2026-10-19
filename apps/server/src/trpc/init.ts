import { initTRPC, TRPCError } from "@trpc/server";
import type { CookieOptions, Request, Response } from "express";
import { ACCESS_COOKIE, REFRESH_COOKIE, verifyAccessToken, type AccessPayload } from "../auth/utils";

export interface TrpcContext {
  user: AccessPayload | null;
}

export interface AuthedCtx {
  user: AccessPayload;
}

export interface CookieCtx {
  cookies: Record<string, string | undefined>;
  setCookie: (name: string, value: string, options?: CookieOptions) => void;
  clearCookie: (name: string, options?: CookieOptions) => void;
}

export async function createContext(opts: { req: Request; res: Response }): Promise<TrpcContext & CookieCtx> {
  const token = opts.req.cookies?.[ACCESS_COOKIE];
  const user = token ? verifyAccessToken(token) : null;
  return {
    user,
    cookies: opts.req.cookies ?? {},
    setCookie: (name, value, options) => opts.res.cookie(name, value, options ?? {}),
    clearCookie: (name, options) => opts.res.clearCookie(name, options),
  };
}

const t = initTRPC.context<TrpcContext & CookieCtx>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } as unknown as AuthedCtx & CookieCtx });
});

export type Context = TrpcContext & CookieCtx;
