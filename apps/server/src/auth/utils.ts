import { createHash, randomBytes } from "crypto";
import type { Response } from "express";
import * as jwt from "jsonwebtoken";

export const ACCESS_COOKIE = "fb_access";
export const REFRESH_COOKIE = "fb_refresh";

export const ACCESS_TTL_SECONDS = 60 * 15;
export const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 30;
export const ACCESS_TTL_MS = ACCESS_TTL_SECONDS * 1000;
export const REFRESH_TTL_MS = REFRESH_TTL_SECONDS * 1000;

const JWT_SECRET = process.env.JWT_SECRET;
if (process.env.NODE_ENV === "production" && !JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in production");
}
const SECRET = JWT_SECRET ?? "dev-jwt-secret-change-me";

export interface AccessPayload {
  id: string;
  role: string;
}

export function signAccessToken(user: AccessPayload): string {
  return jwt.sign({ role: user.role }, SECRET, {
    subject: user.id,
    expiresIn: ACCESS_TTL_SECONDS,
  });
}

export function verifyAccessToken(token: string): AccessPayload | null {
  try {
    const payload = jwt.verify(token, SECRET);
    if (typeof payload === "object" && typeof payload.sub === "string") {
      return { id: payload.sub, role: String(payload.role) };
    }
    return null;
  } catch {
    return null;
  }
}

export function newRefreshToken(): string {
  return randomBytes(48).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
} as const;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export function setAuthCookies(res: Response, tokens: TokenPair): void {
  res.cookie(ACCESS_COOKIE, tokens.accessToken, { ...cookieBase, maxAge: ACCESS_TTL_MS });
  res.cookie(REFRESH_COOKIE, tokens.refreshToken, { ...cookieBase, maxAge: REFRESH_TTL_MS });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_COOKIE, { path: "/" });
  res.clearCookie(REFRESH_COOKIE, { path: "/" });
}
