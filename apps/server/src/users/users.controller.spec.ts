import { describe, it, expect, vi, beforeEach } from "vitest";
import { BadRequestException } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { CreateUser } from "@flow/shared";

const mockUsersService = {
  create: vi.fn(),
  findAll: vi.fn(),
};

describe("UsersController", () => {
  let controller: UsersController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new UsersController(mockUsersService as any);
  });

  describe("create", () => {
    it("creates user and returns it", async () => {
      const input = { email: "new@example.com", name: "New User", username: "newuser", password: "password123" };
      const user = { id: "user-123", ...input, role: "USER", isActive: true, avatar: null, color: "#4f6bff" };

      mockUsersService.create.mockResolvedValue(user);

      const result = await controller.create(input);

      expect(mockUsersService.create).toHaveBeenCalledWith(expect.objectContaining(input));
      expect(result).toEqual(user);
    });

    it("throws BadRequestException for invalid input", async () => {
      await expect(controller.create({ email: "invalid" })).rejects.toThrow(BadRequestException);
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it("throws BadRequestException when required fields missing", async () => {
      await expect(controller.create({})).rejects.toThrow(BadRequestException);
    });
  });

  describe("findAll", () => {
    it("returns all users", async () => {
      const users = [
        { id: "1", email: "a@example.com", name: "A", username: "a", role: "USER", isActive: true, color: "#4f6bff" },
        { id: "2", email: "b@example.com", name: "B", username: "b", role: "USER", isActive: true, color: "#8b6cf5" },
      ];

      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(mockUsersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it("returns empty array when no users", async () => {
      mockUsersService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });
});