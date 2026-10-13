import { describe, it, expect, vi, beforeEach } from "vitest";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { RegisterRequest, LoginRequest, RefreshTokenRequest } from "@flow/shared";
import type { Response } from "express";

const mockAuthService = {
  register: vi.fn(),
  login: vi.fn(),
  issueTokens: vi.fn(),
  refresh: vi.fn(),
  logout: vi.fn(),
  oauthLogin: vi.fn(),
};

const mockUsersService = {
  findById: vi.fn(),
};

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new AuthController(mockAuthService as any, mockUsersService as any);
  });

  const createMockResponse = (): Response => {
    const cookies: Record<string, { value: string; options: any }> = {};
    const mockRes: any = {
      cookies,
    };
    mockRes.cookie = vi.fn((name: string, value: string, options: any) => {
      cookies[name] = { value, options };
      return mockRes;
    });
    mockRes.clearCookie = vi.fn((name: string) => {
      delete cookies[name];
      return mockRes;
    });
    mockRes.redirect = vi.fn().mockReturnValue(mockRes);
    mockRes.json = vi.fn().mockReturnValue(mockRes);
    mockRes.status = vi.fn().mockReturnValue(mockRes);
    mockRes.send = vi.fn().mockReturnValue(mockRes);
    mockRes.sendStatus = vi.fn().mockReturnValue(mockRes);
    return mockRes as Response;
  };

  const createMockRequest = (overrides = {}) => ({
    cookies: {},
    user: undefined,
    ...overrides,
  });

  describe("register", () => {
    it("registers user and sets auth cookies", async () => {
      const input = { email: "new@example.com", password: "Password123!", name: "New User", username: "newuser" };
      const user = { id: "user-123", ...input, role: "USER", isActive: true };
      const tokens = { accessToken: "access-token", refreshToken: "refresh-token" };

      mockAuthService.register.mockResolvedValue(user);
      mockAuthService.issueTokens.mockResolvedValue(tokens);

      const res = createMockResponse();
      const result = await controller.register(input, res);

      expect(mockAuthService.register).toHaveBeenCalledWith(input);
      expect(mockAuthService.issueTokens).toHaveBeenCalledWith(user);
      expect(res.cookie).toHaveBeenCalledWith("fb_access", "access-token", expect.any(Object));
      expect(res.cookie).toHaveBeenCalledWith("fb_refresh", "refresh-token", expect.any(Object));
      expect(result).toEqual({ user });
    });

    it("throws BadRequestException for invalid input", async () => {
      const res = createMockResponse();

      await expect(controller.register({ email: "invalid" }, res)).rejects.toThrow(BadRequestException);
      expect(mockAuthService.register).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("logs in user and sets auth cookies", async () => {
      const input = { email: "test@example.com", password: "Password123!" };
      const user = { id: "user-123", ...input, name: "Test", username: "testuser", role: "USER", isActive: true };
      const tokens = { accessToken: "access-token", refreshToken: "refresh-token" };

      mockAuthService.login.mockResolvedValue(user);
      mockAuthService.issueTokens.mockResolvedValue(tokens);

      const res = createMockResponse();
      const result = await controller.login(input, res);

      expect(mockAuthService.login).toHaveBeenCalledWith(input);
      expect(mockAuthService.issueTokens).toHaveBeenCalledWith(user);
      expect(res.cookie).toHaveBeenCalledWith("fb_access", "access-token", expect.any(Object));
      expect(res.cookie).toHaveBeenCalledWith("fb_refresh", "refresh-token", expect.any(Object));
      expect(result).toEqual({ user });
    });

    it("throws BadRequestException for invalid input", async () => {
      const res = createMockResponse();

      await expect(controller.login({ email: "invalid" }, res)).rejects.toThrow(BadRequestException);
    });
  });

  describe("refresh", () => {
    it("refreshes tokens from cookie", async () => {
      const req = createMockRequest({ cookies: { fb_refresh: "refresh-token" } });
      const user = { id: "user-123", email: "test@example.com", name: "Test", username: "testuser", role: "USER", isActive: true };
      const tokens = { accessToken: "new-access", refreshToken: "new-refresh" };

      mockAuthService.refresh.mockResolvedValue({ user, tokens });

      const res = createMockResponse();
      const result = await controller.refresh(req as any, {}, res);

      expect(mockAuthService.refresh).toHaveBeenCalledWith("refresh-token");
      expect(res.cookie).toHaveBeenCalledWith("fb_access", "new-access", expect.any(Object));
      expect(res.cookie).toHaveBeenCalledWith("fb_refresh", "new-refresh", expect.any(Object));
      expect(result).toEqual({ user });
    });

    it("refreshes tokens from body when cookie not present", async () => {
      const req = createMockRequest({ cookies: {} });
      const user = { id: "user-123", email: "test@example.com", name: "Test", username: "testuser", role: "USER", isActive: true };
      const tokens = { accessToken: "new-access", refreshToken: "new-refresh" };

      mockAuthService.refresh.mockResolvedValue({ user, tokens });

      const res = createMockResponse();
      const result = await controller.refresh(req as any, { refreshToken: "body-refresh-token" }, res);

      expect(mockAuthService.refresh).toHaveBeenCalledWith("body-refresh-token");
      expect(result).toEqual({ user });
    });

    it("throws UnauthorizedException when no refresh token provided", async () => {
      const req = createMockRequest({ cookies: {} });
      const res = createMockResponse();

      await expect(controller.refresh(req as any, {}, res)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("logout", () => {
    it("clears auth cookies and calls logout service", async () => {
      const req = createMockRequest({ cookies: { fb_refresh: "refresh-token" } });
      const res = createMockResponse();

      await controller.logout(req as any, res);

      expect(mockAuthService.logout).toHaveBeenCalledWith("refresh-token");
      expect(res.clearCookie).toHaveBeenCalledWith("fb_access", { path: "/" });
      expect(res.clearCookie).toHaveBeenCalledWith("fb_refresh", { path: "/" });
    });

    it("handles missing refresh token gracefully", async () => {
      const req = createMockRequest({ cookies: {} });
      const res = createMockResponse();

      await controller.logout(req as any, res);

      expect(mockAuthService.logout).toHaveBeenCalledWith(undefined);
      expect(res.clearCookie).toHaveBeenCalledWith("fb_access", { path: "/" });
      expect(res.clearCookie).toHaveBeenCalledWith("fb_refresh", { path: "/" });
    });
  });

  describe("me", () => {
    it("returns current user", async () => {
      const req = createMockRequest({ user: { id: "user-123", role: "USER" } });
      const user = { id: "user-123", email: "test@example.com", name: "Test", username: "testuser", role: "USER", isActive: true };

      mockUsersService.findById.mockResolvedValue(user);

      const result = await controller.me(req as any);

      expect(mockUsersService.findById).toHaveBeenCalledWith("user-123");
      expect(result).toEqual(user);
    });
  });

  describe("oauthResponse", () => {
    it("redirects with auth=failed when no profile", async () => {
      const req = createMockRequest({ user: undefined });
      const res = createMockResponse();

      await controller["oauthResponse"](res, undefined);

      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining("auth=failed"));
      expect(mockAuthService.oauthLogin).not.toHaveBeenCalled();
    });

    it("sets cookies and redirects on successful OAuth login", async () => {
      const profile = { provider: "google" as const, providerId: "google-123", email: "oauth@example.com", name: "OAuth User" };
      const user = { id: "user-123", email: "oauth@example.com", name: "OAuth User", username: "oauthuser", role: "USER", isActive: true };
      const tokens = { accessToken: "access-token", refreshToken: "refresh-token" };
      const req = createMockRequest({ user: profile });
      const res = createMockResponse();

      mockAuthService.oauthLogin.mockResolvedValue({ user, tokens });

      await controller["oauthResponse"](res, profile);

      expect(mockAuthService.oauthLogin).toHaveBeenCalledWith(profile);
      expect(res.cookie).toHaveBeenCalledWith("fb_access", "access-token", expect.any(Object));
      expect(res.cookie).toHaveBeenCalledWith("fb_refresh", "refresh-token", expect.any(Object));
      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining("localhost:3000/boards"));
    });
  });
});