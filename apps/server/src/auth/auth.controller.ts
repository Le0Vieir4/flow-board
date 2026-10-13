import { BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { LoginRequest, RefreshTokenRequest, RegisterRequest } from "@flow/shared";
import { UsersService } from "../users/users.service";
import { AuthService, type TokenPair } from "./auth.service";
import { AuthGuard, type AuthedRequest } from "./middleware";
import type { OAuthProfile } from "./passport";
import { ACCESS_COOKIE, ACCESS_TTL_MS, REFRESH_COOKIE, REFRESH_TTL_MS } from "./utils";

const cookieBase = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
} as const;

function setAuthCookies(res: Response, tokens: TokenPair) {
  res.cookie(ACCESS_COOKIE, tokens.accessToken, { ...cookieBase, maxAge: ACCESS_TTL_MS });
  res.cookie(REFRESH_COOKIE, tokens.refreshToken, { ...cookieBase, maxAge: REFRESH_TTL_MS });
}

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post("register")
  async register(@Body() body: unknown, @Res({ passthrough: true }) res: Response) {
    const parsed = RegisterRequest.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const mappedErrors: Record<string, string> = {};
      for (const [key, messages] of Object.entries(fieldErrors)) {
        mappedErrors[key] = Array.isArray(messages) ? messages[0] : String(messages);
      }
      throw new BadRequestException({ fieldErrors: mappedErrors });
    }
    const user = await this.authService.register(parsed.data);
    setAuthCookies(res, await this.authService.issueTokens(user));
    return { user };
  }

  @Post("login")
  async login(@Body() body: unknown, @Res({ passthrough: true }) res: Response) {
    const parsed = LoginRequest.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const mappedErrors: Record<string, string> = {};
      for (const [key, messages] of Object.entries(fieldErrors)) {
        mappedErrors[key] = Array.isArray(messages) ? messages[0] : String(messages);
      }
      throw new BadRequestException({ fieldErrors: mappedErrors });
    }
    const user = await this.authService.login(parsed.data);
    setAuthCookies(res, await this.authService.issueTokens(user));
    return { user };
  }

  @Post("refresh")
  async refresh(@Req() req: AuthedRequest, @Body() body: unknown, @Res({ passthrough: true }) res: Response) {
    let token = req.cookies?.[REFRESH_COOKIE];
    if (!token) {
      const parsed = RefreshTokenRequest.safeParse(body);
      if (parsed.success) token = parsed.data.refreshToken;
    }
    if (!token) throw new UnauthorizedException("No refresh token");
    const { user, tokens } = await this.authService.refresh(token);
    setAuthCookies(res, tokens);
    return { user };
  }

  @Post("logout")
  async logout(@Req() req: AuthedRequest, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.cookies?.[REFRESH_COOKIE]);
    res.clearCookie(ACCESS_COOKIE, { path: "/" });
    res.clearCookie(REFRESH_COOKIE, { path: "/" });
    return { ok: true };
  }

  @Get("me")
  @UseGuards(AuthGuard)
  async me(@Req() req: AuthedRequest) {
    return this.usersService.findById(req.user!.id);
  }

  @Get("google/callback")
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    await this.oauthResponse(res, req.user as OAuthProfile | undefined);
  }

  @Get("github/callback")
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    await this.oauthResponse(res, req.user as OAuthProfile | undefined);
  }

  @Get("google/failure")
  @Get("github/failure")
  oauthFailure(@Res() res: Response) {
    const redirectBase = process.env.AUTH_REDIRECT_URL ?? "http://localhost:3000/boards";
    res.redirect(`${redirectBase}?auth=failed`);
  }

  private async oauthResponse(res: Response, profile: OAuthProfile | undefined) {
    const redirectBase = process.env.AUTH_REDIRECT_URL ?? "http://localhost:3000/boards";
    if (!profile) {
      res.redirect(`${redirectBase}?auth=failed`);
      return;
    }
    const { tokens } = await this.authService.oauthLogin(profile);
    setAuthCookies(res, tokens);
    res.redirect(redirectBase);
  }
}
