import { describe, it, expect, vi, beforeEach } from "vitest";
import { UnauthorizedException, ConflictException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { db } from "../db";
import { refreshTokens, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { signAccessToken, newRefreshToken, hashToken, ACCESS_TTL_MS, REFRESH_TTL_MS } from "./utils";

const mockSelect = vi.hoisted(() => vi.fn().mockReturnThis());
const mockFrom = vi.hoisted(() => vi.fn().mockReturnThis());
const mockWhere = vi.hoisted(() => vi.fn().mockReturnThis());
const mockReturning = vi.hoisted(() => vi.fn().mockResolvedValue([]));
const mockValues = vi.hoisted(() => vi.fn().mockReturnThis());
const mockSet = vi.hoisted(() => vi.fn().mockReturnThis());
const mockUpdate = vi.hoisted(() => vi.fn().mockReturnValue({ set: mockSet, where: mockWhere }));
const mockInsert = vi.hoisted(() => vi.fn().mockReturnValue({ values: mockValues, returning: mockReturning }));

vi.mock("../db", () => ({
  db: {
    select: mockSelect,
    from: mockFrom,
    where: mockWhere,
    returning: mockReturning,
    values: mockValues,
    set: mockSet,
    update: mockUpdate,
    insert: mockInsert,
  },
}));

vi.mock("../users/users.service", () => ({
  UsersService: vi.fn().mockImplementation(
    class {
      findRowByEmail = vi.fn();
      findRowByUsername = vi.fn();
      create = vi.fn();
      ensureUniqueUsername = vi.fn();
      upsertOAuth = vi.fn();
    }
  ),
  toUser: vi.fn((row) => ({
    id: row.id,
    email: row.email,
    name: row.name,
    username: row.username,
    avatar: row.avatar,
    color: row.color,
    role: row.role,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  })),
}));

const mockCompare = vi.hoisted(() => vi.fn().mockResolvedValue(true));
const mockHash = vi.hoisted(() => vi.fn().mockResolvedValue("hashed-password"));
const mockSignAccessToken = vi.hoisted(() => vi.fn((user) => `access-token-${user.id}`));
const mockNewRefreshToken = vi.hoisted(() => vi.fn(() => "new-refresh-token"));
const mockHashToken = vi.hoisted(() => vi.fn((token) => `hashed-${token}`));

vi.mock("bcryptjs", () => ({
  default: {
    hash: mockHash,
    compare: mockCompare,
  },
  hash: mockHash,
  compare: mockCompare,
}));

vi.mock("./utils", () => ({
  signAccessToken: mockSignAccessToken,
  newRefreshToken: mockNewRefreshToken,
  hashToken: mockHashToken,
  ACCESS_TTL_MS: 900000,
  REFRESH_TTL_MS: 2592000000,
  REFRESH_TTL_SECONDS: 2592000,
  ACCESS_TTL_SECONDS: 900,
  REFRESH_COOKIE: "fb_refresh",
  ACCESS_COOKIE: "fb_access",
}));

describe("AuthService", () => {
  let service: AuthService;
  let mockUsersService: UsersService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCompare.mockResolvedValue(true);
    mockHash.mockResolvedValue("hashed-password");
    mockUsersService = new UsersService();
    service = new AuthService(mockUsersService);
  });

  describe("register", () => {
    it("creates a new user with generated username when not provided", async () => {
      const input = { email: "new@example.com", password: "Password123!", name: "New User" };
      const createdUser = { id: "user-123", ...input, username: "newuser", role: "USER", isActive: true };

      mockUsersService.ensureUniqueUsername = vi.fn().mockResolvedValue("newuser");
      mockUsersService.create = vi.fn().mockResolvedValue(createdUser as any);

      const result = await service.register(input);

      expect(mockUsersService.ensureUniqueUsername).toHaveBeenCalledWith("new");
      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: "new@example.com", username: "newuser" })
      );
      expect(result).toEqual(createdUser);
    });

    it("uses provided username when given", async () => {
      const input = { email: "new@example.com", password: "Password123!", name: "New User", username: "customuser" };
      const createdUser = { id: "user-123", ...input, role: "USER", isActive: true };

      mockUsersService.create = vi.fn().mockResolvedValue(createdUser as any);

      const result = await service.register(input);

      expect(mockUsersService.ensureUniqueUsername).not.toHaveBeenCalled();
      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({ username: "customuser" })
      );
      expect(result).toEqual(createdUser);
    });
  });

  describe("login", () => {
    it("returns user when credentials are valid", async () => {
      const input = { email: "test@example.com", password: "Password123!" };
      const userRow = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        username: "testuser",
        passwordHash: "hashed-password",
        role: "USER",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const expectedUser = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        username: "testuser",
        role: "USER",
        isActive: true,
        createdAt: userRow.createdAt.toISOString(),
        updatedAt: userRow.updatedAt.toISOString(),
      };

      mockUsersService.findRowByEmail = vi.fn().mockResolvedValue(userRow);
      mockCompare.mockResolvedValue(true);

      const result = await service.login(input);

      expect(mockUsersService.findRowByEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockCompare).toHaveBeenCalledWith("Password123!", "hashed-password");
      expect(result).toEqual(expectedUser);
    });

    it("throws UnauthorizedException when user not found", async () => {
      mockUsersService.findRowByEmail = vi.fn().mockResolvedValue(undefined);

      await expect(service.login({ email: "nonexistent@example.com", password: "Password123!" })).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("throws UnauthorizedException when password is invalid", async () => {
      const userRow = { passwordHash: "hashed-password", createdAt: new Date(), updatedAt: new Date() };
      mockUsersService.findRowByEmail = vi.fn().mockResolvedValue(userRow);
      mockCompare.mockResolvedValue(false);

      await expect(service.login({ email: "test@example.com", password: "WrongPassword123!" })).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("throws UnauthorizedException when user has no password hash", async () => {
      const userRow = { passwordHash: null };
      mockUsersService.findRowByEmail = vi.fn().mockResolvedValue(userRow);

      await expect(service.login({ email: "test@example.com", password: "Password123!" })).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe("issueTokens", () => {
    it("creates access and refresh tokens and stores refresh token", async () => {
      const user = { id: "user-123", role: "USER" };

      await service.issueTokens(user);

      expect(mockSignAccessToken).toHaveBeenCalledWith(user);
      expect(mockNewRefreshToken).toHaveBeenCalled();
      expect(mockHashToken).toHaveBeenCalledWith("new-refresh-token");
      expect(mockInsert).toHaveBeenCalledWith(refreshTokens);
      expect(mockValues).toHaveBeenCalledWith({
        userId: "user-123",
        tokenHash: "hashed-new-refresh-token",
        expiresAt: expect.any(Date),
      });
    });
  });

  describe("refresh", () => {
    it("rotates refresh token and returns new token pair", async () => {
      const token = "valid-refresh-token";
      const storedToken = {
        id: "token-123",
        userId: "user-123",
        tokenHash: "hashed-valid-refresh-token",
        expiresAt: new Date(Date.now() + 1000000),
        revokedAt: null,
      };
      const userRow = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        username: "testuser",
        avatar: null,
        color: "#4f6bff",
        role: "USER",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const expectedUser = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        username: "testuser",
        avatar: null,
        color: "#4f6bff",
        role: "USER",
        isActive: true,
        createdAt: userRow.createdAt.toISOString(),
        updatedAt: userRow.updatedAt.toISOString(),
      };

      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([storedToken]),
        }),
      });
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([userRow]),
        }),
      });

      const result = await service.refresh(token);

      expect(mockHashToken).toHaveBeenCalledWith(token);
      expect(mockUpdate).toHaveBeenCalledWith(refreshTokens);
      expect(mockSet).toHaveBeenCalledWith({ revokedAt: expect.any(Date) });
      expect(result.user).toEqual(expectedUser);
      expect(result.tokens.accessToken).toBe("access-token-user-123");
    });

    it("throws when refresh token not found", async () => {
      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      await expect(service.refresh("invalid-token")).rejects.toThrow(UnauthorizedException);
    });

    it("throws when refresh token is revoked", async () => {
      const storedToken = {
        id: "token-123",
        userId: "user-123",
        tokenHash: "hashed-token",
        expiresAt: new Date(Date.now() + 1000000),
        revokedAt: new Date(),
      };
      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([storedToken]),
        }),
      });

      await expect(service.refresh("revoked-token")).rejects.toThrow(UnauthorizedException);
    });

    it("throws when refresh token is expired", async () => {
      const storedToken = {
        id: "token-123",
        userId: "user-123",
        tokenHash: "hashed-token",
        expiresAt: new Date(Date.now() - 1000000),
        revokedAt: null,
      };
      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([storedToken]),
        }),
      });

      await expect(service.refresh("expired-token")).rejects.toThrow(UnauthorizedException);
    });

    it("throws when user not found", async () => {
      const storedToken = {
        id: "token-123",
        userId: "user-123",
        tokenHash: "hashed-token",
        expiresAt: new Date(Date.now() + 1000000),
        revokedAt: null,
      };
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([storedToken]),
        }),
      });
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      await expect(service.refresh("valid-token")).rejects.toThrow(UnauthorizedException);
    });

    it("throws when user is inactive", async () => {
      const storedToken = {
        id: "token-123",
        userId: "user-123",
        tokenHash: "hashed-token",
        expiresAt: new Date(Date.now() + 1000000),
        revokedAt: null,
      };
      const userRow = { isActive: false };
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([storedToken]),
        }),
      });
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([userRow]),
        }),
      });

      await expect(service.refresh("valid-token")).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("logout", () => {
    it("revokes refresh token when provided", async () => {
      await service.logout("refresh-token");

      expect(mockHashToken).toHaveBeenCalledWith("refresh-token");
      expect(mockUpdate).toHaveBeenCalledWith(refreshTokens);
      expect(mockSet).toHaveBeenCalledWith({ revokedAt: expect.any(Date) });
    });

    it("does nothing when token not provided", async () => {
      await service.logout(undefined);

      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe("oauthLogin", () => {
    it("creates or links OAuth user and returns tokens", async () => {
      const profile = {
        provider: "google" as const,
        providerId: "google-123",
        email: "oauth@example.com",
        name: "OAuth User",
      };
      const user = { id: "user-123", ...profile, role: "USER", isActive: true };

      mockUsersService.upsertOAuth = vi.fn().mockResolvedValue(user as any);

      const result = await service.oauthLogin(profile);

      expect(mockUsersService.upsertOAuth).toHaveBeenCalledWith(profile);
      expect(result.user).toEqual(user);
      expect(result.tokens.accessToken).toBe("access-token-user-123");
    });
  });
});