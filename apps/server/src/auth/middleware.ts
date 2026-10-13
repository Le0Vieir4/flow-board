import { Injectable, NestMiddleware, UnauthorizedException, CanActivate, ExecutionContext } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { ACCESS_COOKIE, verifyAccessToken, type AccessPayload } from "./utils";

export interface AuthedRequest extends Request {
  user?: AccessPayload;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: AuthedRequest, _res: Response, next: NextFunction) {
    const token = req.cookies?.[ACCESS_COOKIE];
    if (token) {
      const payload = verifyAccessToken(token);
      if (payload) req.user = payload;
    }
    next();
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    if (!req.user) throw new UnauthorizedException("Authentication required");
    return true;
  }
}
