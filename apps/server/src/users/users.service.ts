import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import type { CreateUser, UpdateUser, User } from "@flow/shared";
import { db } from "../db";
import { users, type UserRow } from "../db/schema";

const USER_COLORS = ["#4f6bff", "#8b6cf5", "#34c77b", "#e2924a", "#6d8bff", "#e2588a"];

export interface OAuthUpsertInput {
  provider: "google" | "github";
  providerId: string;
  email?: string;
  name?: string;
  username?: string;
  avatar?: string | null;
}

export function randomColor(): string {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}

export function toUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    username: row.username,
    avatar: row.avatar,
    color: row.color,
    role: row.role as User["role"],
    isActive: row.isActive,
    emailVerified: row.emailVerified,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

@Injectable()
export class UsersService {
  async create(input: CreateUser): Promise<User> {
    if (await this.findRowByEmail(input.email)) throw new ConflictException("Email already in use");
    if (await this.findRowByUsername(input.username)) throw new ConflictException("Username already taken");
    const passwordHash = await bcrypt.hash(input.password, 10);
    const [row] = await db
      .insert(users)
      .values({
        email: input.email,
        name: input.name,
        username: input.username,
        passwordHash,
        avatar: input.avatar ?? null,
        color: input.color ?? randomColor(),
        role: input.role,
        isActive: input.isActive,
      } as typeof users.$inferInsert)
      .returning();
    return toUser(row);
  }

  async findAll(): Promise<User[]> {
    const rows = await db.select().from(users);
    return rows.map(toUser);
  }

  async findById(id: string): Promise<User> {
    const row = await this.findRowById(id);
    if (!row) throw new NotFoundException("User not found");
    return toUser(row);
  }

  async findRowById(id: string): Promise<UserRow | undefined> {
    const [row] = await db.select().from(users).where(eq(users.id, id));
    return row;
  }

  async findRowByEmail(email: string): Promise<UserRow | undefined> {
    const [row] = await db.select().from(users).where(eq(users.email, email));
    return row;
  }

  async findRowByUsername(username: string): Promise<UserRow | undefined> {
    const [row] = await db.select().from(users).where(eq(users.username, username));
    return row;
  }

  async update(id: string, patch: UpdateUser): Promise<User> {
    const values: Partial<UserRow> = { updatedAt: new Date() };
    if (patch.email !== undefined) values.email = patch.email;
    if (patch.name !== undefined) values.name = patch.name;
    if (patch.username !== undefined) values.username = patch.username;
    if (patch.avatar !== undefined) values.avatar = patch.avatar;
    if (patch.color !== undefined) values.color = patch.color;
    if (patch.role !== undefined) values.role = patch.role;
    if (patch.isActive !== undefined) values.isActive = patch.isActive;
    if (patch.password !== undefined) values.passwordHash = await bcrypt.hash(patch.password, 10);
    const [row] = await db.update(users).set(values).where(eq(users.id, id)).returning();
    if (!row) throw new NotFoundException("User not found");
    return toUser(row);
  }

  async upsertOAuth(input: OAuthUpsertInput): Promise<User> {
    const providerColumn = input.provider === "google" ? users.googleId : users.githubId;
    const [existing] = await db.select().from(users).where(eq(providerColumn, input.providerId));
    if (existing) return toUser(existing);

    if (input.email) {
      const [byEmail] = await db.select().from(users).where(eq(users.email, input.email));
      if (byEmail) {
        const [linked] = await db
          .update(users)
          .set({
            ...(input.provider === "google" ? { googleId: input.providerId } : { githubId: input.providerId }),
            updatedAt: new Date(),
          } as Partial<typeof users.$inferInsert>)
          .where(eq(users.id, byEmail.id))
          .returning();
        return toUser(linked);
      }
    }

    const username = await this.uniqueUsername(input.username ?? input.email?.split("@")[0] ?? input.providerId);
    const insertValues: typeof users.$inferInsert = {
      email: input.email ?? `${input.provider}-${input.providerId}@flowboard.local`,
      name: input.name ?? username,
      username,
      avatar: input.avatar ?? null,
      color: randomColor(),
      ...(input.provider === "google" ? { googleId: input.providerId } : { githubId: input.providerId }),
    };
    const [row] = await db
      .insert(users)
      .values(insertValues)
      .returning();
    return toUser(row);
  }

  private async uniqueUsername(base: string): Promise<string> {
    let candidate = base.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24);
    if (candidate.length < 3) candidate = "user";
    let suffix = 0;
    while (await this.findRowByUsername(candidate)) {
      suffix += 1;
      candidate = `${candidate.slice(0, 24)}${suffix}`.slice(-30);
    }
    return candidate;
  }

  async ensureUniqueUsername(base: string): Promise<string> {
    return this.uniqueUsername(base);
  }
}
