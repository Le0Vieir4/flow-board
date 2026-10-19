import { Controller, Get, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { UsersService } from "../users/users.service";
import { AuthService, type TokenPair } from "./auth.service";
import type { OAuthProfile } from "./passport";
import { setAuthCookies } from "./utils";

const redirectBase = () => process.env.AUTH_REDIRECT_URL ?? "http://localhost:3000/dashboard";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

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
    res.redirect(`${redirectBase()}?auth=failed`);
  }

  private async oauthResponse(res: Response, profile: OAuthProfile | undefined) {
    if (!profile) {
      res.redirect(`${redirectBase()}?auth=failed`);
      return;
    }
    const { tokens } = await this.authService.oauthLogin(profile);
    setAuthCookies(res, tokens);
    res.redirect(redirectBase());
  }
}
