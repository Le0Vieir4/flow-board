import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { UsersService, toUser, randomColor } from "./users.service";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";

const mockSelect = vi.hoisted(() => vi.fn().mockReturnThis());
const mockFrom = vi.hoisted(() => vi.fn().mockReturnThis());
const mockWhere = vi.hoisted(() => vi.fn().mockReturnThis());
const mockReturning = vi.hoisted(() => vi.fn().mockResolvedValue([]));
const mockValues = vi.hoisted(() => vi.fn().mockReturnThis());
const mockSet = vi.hoisted(() => vi.fn().mockReturnThis());
const mockUpdate = vi.hoisted(() => vi.fn().mockReturnValue({ set: mockSet, where: mockWhere }));
const mockInsert = vi.hoisted(() => vi.fn().mockReturnValue({ values: mockValues, returning: mockReturning }));
const mockDelete = vi.hoisted(() => vi.fn().mockReturnThis());

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
    delete: mockDelete,
  },
}));

const mockHash = vi.hoisted(() => vi.fn().mockResolvedValue("hashed-password"));

vi.mock("bcryptjs", () => ({
  default: { hash: mockHash },
  hash: mockHash,
}));

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new UsersService();
  });

  describe("toUser", () => {
    it("converts database row to user object", () => {
      const row = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        username: "testuser",
        avatar: "avatar.png",
        color: "#4f6bff",
        passwordHash: "hashed",
        googleId: null,
        githubId: null,
        role: "USER",
        isActive: true,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-02T00:00:00Z"),
      };

      const result = toUser(row);

      expect(result).toEqual({
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        username: "testuser",
        avatar: "avatar.png",
        color: "#4f6bff",
        role: "USER",
        isActive: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      });
    });
  });

  describe("randomColor", () => {
    it("returns a color from the predefined list", () => {
      const colors = new Set();
      for (let i = 0; i < 100; i++) {
        colors.add(randomColor());
      }
      expect(colors.size).toBeGreaterThan(1);
      colors.forEach((color) => {
        expect(["#4f6bff", "#8b6cf5", "#34c77b", "#e2924a", "#6d8bff", "#e2588a"]).toContain(color);
      });
    });
  });

  describe("create", () => {
    it("creates a new user with hashed password", async () => {
      const input = {
        email: "new@example.com",
        name: "New User",
        username: "newuser",
        password: "Password123!",
        avatar: "avatar.png",
        color: "#ff0000",
        role: "ADMIN" as const,
        isActive: false,
      };
      const createdRow = {
        id: "user-123",
        ...input,
        passwordHash: "hashed-password",
        googleId: null,
        githubId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });
      mockReturning.mockResolvedValueOnce([createdRow]);

      const result = await service.create(input);

      expect(mockHash).toHaveBeenCalledWith("Password123!", 10);
      expect(mockInsert).toHaveBeenCalledWith(users);
      expect(mockValues).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "new@example.com",
          name: "New User",
          username: "newuser",
          passwordHash: "hashed-password",
          avatar: "avatar.png",
          color: "#ff0000",
          role: "ADMIN",
          isActive: false,
        })
      );
      expect(result.email).toBe("new@example.com");
      expect(result.username).toBe("newuser");
    });

    it("throws ConflictException when email already exists", async () => {
      const input = { email: "existing@example.com", name: "User", username: "user", password: "Password123!" };
      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ id: "existing" }]),
        }),
      });

      await expect(service.create(input)).rejects.toThrow(ConflictException);
      expect(mockInsert).not.toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("returns all users", async () => {
      const rows = [
        { id: "1", email: "a@example.com", name: "A", username: "a", color: "#4f6bff", role: "USER", isActive: true, avatar: null, passwordHash: null, googleId: null, githubId: null, createdAt: new Date(), updatedAt: new Date() },
        { id: "2", email: "b@example.com", name: "B", username: "b", color: "#8b6cf5", role: "USER", isActive: true, avatar: null, passwordHash: null, googleId: null, githubId: null, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockSelect.mockReturnValue({
        from: vi.fn().mockResolvedValue(rows),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].email).toBe("a@example.com");
      expect(result[1].email).toBe("b@example.com");
    });
  });

  describe("findById", () => {
    it("returns user when found", async () => {
      const row = { id: "user-123", email: "test@example.com", name: "Test", username: "testuser", color: "#4f6bff", role: "USER", isActive: true, avatar: null, passwordHash: null, googleId: null, githubId: null, createdAt: new Date(), updatedAt: new Date() };
      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([row]),
        }),
      });

      const result = await service.findById("user-123");

      expect(result.id).toBe("user-123");
      expect(result.email).toBe("test@example.com");
    });

    it("throws NotFoundException when user not found", async () => {
      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      await expect(service.findById("nonexistent")).rejects.toThrow(NotFoundException);
    });
  });
});