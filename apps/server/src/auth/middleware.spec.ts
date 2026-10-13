import { describe, it, expect, vi, beforeEach } from "vitest";
import { UnauthorizedException } from "@nestjs/common";
import { AuthMiddleware, AuthGuard } from "./middleware";
import { verifyAccessToken, ACCESS_COOKIE } from "./utils";

vi.mock("./utils", () => ({
  verifyAccessToken: vi.fn(),
  ACCESS_COOKIE: "fb_access",
}));

const mockVerifyAccessToken = vi.mocked(verifyAccessToken);

describe("AuthMiddleware", () => {
  let middleware: AuthMiddleware;
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    middleware = new AuthMiddleware();
    mockReq = { cookies: {} };
    mockRes = {};
    mockNext = vi.fn();
  });

  it("attaches user to request when valid access token in cookie", () => {
    mockReq.cookies = { fb_access: "valid-token" };
    mockVerifyAccessToken.mockReturnValue({ id: "user-123", role: "USER" });

    middleware.use(mockReq, mockRes, mockNext);

    expect(mockVerifyAccessToken).toHaveBeenCalledWith("valid-token");
    expect(mockReq.user).toEqual({ id: "user-123", role: "USER" });
    expect(mockNext).toHaveBeenCalled();
  });

  it("does not attach user when token is invalid", () => {
    mockReq.cookies = { fb_access: "invalid-token" };
    mockVerifyAccessToken.mockReturnValue(null);

    middleware.use(mockReq, mockRes, mockNext);

    expect(mockReq.user).toBeUndefined();
    expect(mockNext).toHaveBeenCalled();
  });

  it("does not attach user when no cookie present", () => {
    mockReq.cookies = {};

    middleware.use(mockReq, mockRes, mockNext);

    expect(mockVerifyAccessToken).not.toHaveBeenCalled();
    expect(mockReq.user).toBeUndefined();
    expect(mockNext).toHaveBeenCalled();
  });

  it("continues even when cookie is empty string", () => {
    mockReq.cookies = { fb_access: "" };

    middleware.use(mockReq, mockRes, mockNext);

    // Empty string is falsy, so verifyAccessToken is not called
    expect(mockVerifyAccessToken).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });
});

describe("AuthGuard", () => {
  let guard: AuthGuard;
  let mockContext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    guard = new AuthGuard();
    mockContext = {
      switchToHttp: vi.fn().mockReturnValue({
        getRequest: vi.fn(),
      }),
    };
  });

  it("allows request when user is attached", () => {
    const mockRequest = { user: { id: "user-123", role: "USER" } };
    mockContext.switchToHttp().getRequest.mockReturnValue(mockRequest);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it("throws UnauthorizedException when user not attached", () => {
    const mockRequest = { user: undefined };
    mockContext.switchToHttp().getRequest.mockReturnValue(mockRequest);

    expect(() => guard.canActivate(mockContext)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(mockContext)).toThrow("Authentication required");
  });

  it("throws UnauthorizedException when user is null", () => {
    const mockRequest = { user: null };
    mockContext.switchToHttp().getRequest.mockReturnValue(mockRequest);

    expect(() => guard.canActivate(mockContext)).toThrow(UnauthorizedException);
  });
});