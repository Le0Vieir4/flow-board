import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import jwt from "jsonwebtoken";

const originalEnv = process.env.JWT_SECRET;

beforeEach(() => {
  vi.resetModules();
  vi.doUnmock("../auth/utils");
  process.env.JWT_SECRET = "test-secret";
});

afterAll(() => {
  process.env.JWT_SECRET = originalEnv;
});

describe("Auth Utils", () => {
  describe("signAccessToken", () => {
    it("generates a valid JWT token", async () => {
      const { signAccessToken } = await import("./utils.js");
      const user = { id: "user-123", role: "USER" };
      const token = signAccessToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("includes user id as subject", async () => {
      const { signAccessToken } = await import("./utils.js");
      const user = { id: "user-123", role: "USER" };
      const token = signAccessToken(user);
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());

      expect(payload.sub).toBe("user-123");
    });

    it("includes role in payload", async () => {
      const { signAccessToken } = await import("./utils.js");
      const user = { id: "user-123", role: "ADMIN" };
      const token = signAccessToken(user);
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());

      expect(payload.role).toBe("ADMIN");
    });

    it("sets expiration", async () => {
      const { signAccessToken, ACCESS_TTL_SECONDS } = await import("./utils.js");
      const user = { id: "user-123", role: "USER" };
      const token = signAccessToken(user);
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());

      expect(payload.exp).toBeDefined();
      expect(payload.exp - payload.iat).toBe(ACCESS_TTL_SECONDS);
    });
  });

  describe("verifyAccessToken", () => {
    it("returns payload for valid token", async () => {
      const { signAccessToken, verifyAccessToken } = await import("./utils.js");
      const user = { id: "user-123", role: "USER" };
      const token = signAccessToken(user);
      const result = verifyAccessToken(token);

      expect(result).toEqual({ id: "user-123", role: "USER" });
    });

    it("returns null for invalid token", async () => {
      const { verifyAccessToken } = await import("./utils.js");
      const result = verifyAccessToken("invalid.token.here");

      expect(result).toBeNull();
    });

    it("returns null for expired token", async () => {
      const { verifyAccessToken } = await import("./utils.js");
      const expiredToken = jwt.sign({ sub: "user-123", role: "USER" }, "test-secret", { expiresIn: "-1h" });
      const result = verifyAccessToken(expiredToken);

      expect(result).toBeNull();
    });

    it("returns null for token signed with different secret", async () => {
      const { verifyAccessToken } = await import("./utils.js");
      const token = jwt.sign({ sub: "user-123", role: "USER" }, "different-secret", { expiresIn: "1h" });
      const result = verifyAccessToken(token);

      expect(result).toBeNull();
    });
  });

  describe("newRefreshToken", () => {
    it("generates a random token", async () => {
      const { newRefreshToken } = await import("./utils.js");
      const token1 = newRefreshToken();
      const token2 = newRefreshToken();

      expect(token1).toBeDefined();
      expect(typeof token1).toBe("string");
      expect(token1).not.toBe(token2);
      expect(token1.length).toBeGreaterThan(20);
    });

    it("generates URL-safe base64 token", async () => {
      const { newRefreshToken } = await import("./utils.js");
      const token = newRefreshToken();

      expect(token).not.toMatch(/[+/=]/);
    });
  });

  describe("hashToken", () => {
    it("produces consistent hash for same input", async () => {
      const { hashToken } = await import("./utils.js");
      const token = "test-refresh-token";
      const hash1 = hashToken(token);
      const hash2 = hashToken(token);

      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(64);
    });

    it("produces different hashes for different inputs", async () => {
      const { hashToken } = await import("./utils.js");
      const hash1 = hashToken("token-1");
      const hash2 = hashToken("token-2");

      expect(hash1).not.toBe(hash2);
    });

    it("produces hex string", async () => {
      const { hashToken } = await import("./utils.js");
      const hash = hashToken("token");

      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });
  });

  describe("constants", () => {
    it("has correct TTL values", async () => {
      const { ACCESS_TTL_SECONDS, REFRESH_TTL_SECONDS } = await import("./utils.js");

      expect(ACCESS_TTL_SECONDS).toBe(900);
      expect(REFRESH_TTL_SECONDS).toBe(2592000);
    });
  });
});