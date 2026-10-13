import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { CreateUser, type LoginRequest, type RegisterRequest, type User } from "@flow/shared";
import { db } from "../db";
import { refreshTokens, users } from "../db/schema";
import { UsersService, toUser, type OAuthUpsertInput } from "../users/users.service";
import { REFRESH_TTL_MS, hashToken, newRefreshToken, signAccessToken } from "./utils";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(input: RegisterRequest): Promise<User> {
    const username = input.username ?? (await this.usersService.ensureUniqueUsername(input.email.split("@")[0]));
    const dto = CreateUser.parse({ ...input, username });
    return this.usersService.create(dto);
  }

  async login(input: LoginRequest): Promise<User> {
    const row = await this.usersService.findRowByEmail(input.email);
    if (!row?.passwordHash || !(await bcrypt.compare(input.password, row.passwordHash))) {
      throw new UnauthorizedException("Invalid email or password");
    }
    return toUser(row);
  }

  async issueTokens(user: { id: string; role: string }): Promise<TokenPair> {
    const accessToken = signAccessToken(user);
    const refreshToken = newRefreshToken();
    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    });
    return { accessToken, refreshToken };
  }

  async refresh(token: string): Promise<{ user: User; tokens: TokenPair }> {
    const [stored] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, hashToken(token)));
    if (!stored || stored.revokedAt || stored.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException("Session expired — log in again");
    }
    const [row] = await db.select().from(users).where(eq(users.id, stored.userId));
    if (!row || !row.isActive) throw new UnauthorizedException();
    await db.update(refreshTokens).set({ revokedAt: new Date() } as Partial<typeof refreshTokens.$inferInsert>).where(eq(refreshTokens.id, stored.id));
    return { user: toUser(row), tokens: await this.issueTokens({ id: row.id, role: row.role }) };
  }

  async logout(token: string | undefined): Promise<void> {
    if (!token) return;
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() } as Partial<typeof refreshTokens.$inferInsert>)
      .where(eq(refreshTokens.tokenHash, hashToken(token)));
  }

  async oauthLogin(profile: OAuthUpsertInput): Promise<{ user: User; tokens: TokenPair }> {
    const user = await this.usersService.upsertOAuth(profile);
    return { user, tokens: await this.issueTokens(user) };
  }
}
