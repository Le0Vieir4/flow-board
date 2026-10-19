import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { CreateUser, type LoginRequest, type RegisterRequest, type User } from "@flow/shared";
import { db } from "../db";
import { refreshTokens, users, verificationTokens } from "../db/schema";
import { UsersService, toUser, type OAuthUpsertInput } from "../users/users.service";
import { REFRESH_TTL_MS, hashToken, newRefreshToken, signAccessToken } from "./utils";
import { EmailService } from "../email/email.service";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const VERIFICATION_TTL_MS = 60 * 60 * 1000; // 1 hour

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  async register(input: RegisterRequest): Promise<User> {
    const username = input.username ?? (await this.usersService.ensureUniqueUsername(input.email.split("@")[0]));
    const dto = CreateUser.parse({ ...input, username });
    const user = await this.usersService.create(dto);

    // Send email verification
    await this.sendEmailVerification(user.id, user.email);

    return user;
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

  /* ---------- Email verification ---------- */

  async sendEmailVerification(userId: string, email: string): Promise<void> {
    const [existing] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.userId, userId),
          eq(verificationTokens.type, "email_verification"),
        ),
      );

    if (existing && existing.expiresAt.getTime() > Date.now()) {
      return; // valid token already exists
    }

    const token = newRefreshToken();
    await db.insert(verificationTokens).values({
      userId,
      token,
      type: "email_verification",
      expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS),
    } as typeof verificationTokens.$inferInsert);

    const verifyUrl = `${process.env.WEB_URL ?? "http://localhost:3000"}/verify-email?token=${token}`;
    await this.emailService.send({
      to: email,
      subject: "Verify your email address — FlowBoard",
      text: `Verify your email by clicking: ${verifyUrl}`,
      html: `<p>Verify your email by clicking <a href="${verifyUrl}">here</a>.</p>`,
    });
  }

  async verifyEmail(token: string): Promise<void> {
    const [stored] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token));

    if (!stored) throw new NotFoundException("Invalid verification token");
    if (stored.type !== "email_verification") throw new NotFoundException("Invalid verification token");
    if (stored.usedAt) throw new ConflictException("Verification token already used");
    if (stored.expiresAt.getTime() <= Date.now()) throw new UnauthorizedException("Verification token expired");

    const [user] = await db.select().from(users).where(eq(users.id, stored.userId));
    if (!user) throw new NotFoundException("User not found");

    await db.update(verificationTokens).set({ usedAt: new Date() }).where(eq(verificationTokens.id, stored.id));
    await db.update(users).set({ emailVerified: true }).where(eq(users.id, stored.userId));
  }

  async resendEmailVerification(email: string): Promise<void> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return; // don't reveal whether email exists

    if (user.emailVerified) return;

    await this.sendEmailVerification(user.id, user.email);
  }

  /* ---------- Password reset ---------- */

  async sendPasswordReset(email: string): Promise<void> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return; // don't reveal whether email exists

    const [existing] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.userId, user.id),
          eq(verificationTokens.type, "password_reset"),
        ),
      );

    if (existing && existing.expiresAt.getTime() > Date.now()) {
      return;
    }

    const token = newRefreshToken();
    await db.insert(verificationTokens).values({
      userId: user.id,
      token,
      type: "password_reset",
      expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS),
    } as typeof verificationTokens.$inferInsert);

    const resetUrl = `${process.env.WEB_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;
    await this.emailService.send({
      to: email,
      subject: "Reset your password — FlowBoard",
      text: `Reset your password by clicking: ${resetUrl}`,
      html: `<p>Reset your password by clicking <a href="${resetUrl}">here</a>.</p>`,
    });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const [stored] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token));

    if (!stored) throw new NotFoundException("Invalid reset token");
    if (stored.type !== "password_reset") throw new NotFoundException("Invalid reset token");
    if (stored.usedAt) throw new ConflictException("Reset token already used");
    if (stored.expiresAt.getTime() <= Date.now()) throw new UnauthorizedException("Reset token expired");

    const [user] = await db.select().from(users).where(eq(users.id, stored.userId));
    if (!user) throw new NotFoundException("User not found");

    const passwordHash = await bcrypt.hash(password, 10);

    await db.update(verificationTokens).set({ usedAt: new Date() }).where(eq(verificationTokens.id, stored.id));
    await db.update(users).set({ passwordHash }).where(eq(users.id, stored.userId));

    // Revoke all existing refresh tokens
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() } as Partial<typeof refreshTokens.$inferInsert>)
      .where(eq(refreshTokens.userId, stored.userId));
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw new NotFoundException("User not found");
    if (!user.passwordHash) throw new UnauthorizedException("No password set for this account");
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
      throw new UnauthorizedException("Current password is incorrect");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.update(users).set({ passwordHash }).where(eq(users.id, userId));

    // Revoke all existing refresh tokens except current session
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() } as Partial<typeof refreshTokens.$inferInsert>)
      .where(eq(refreshTokens.userId, userId));
  }
}
