import { vi } from "vitest";

const createDbMock = () => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([]),
    values: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  };

  return {
    select: vi.fn(() => chain),
    from: vi.fn(() => chain),
    where: vi.fn(() => chain),
    returning: vi.fn(() => chain),
    values: vi.fn(() => chain),
    set: vi.fn(() => chain),
    update: vi.fn(() => chain),
    insert: vi.fn(() => chain),
    delete: vi.fn(() => chain),
  };
};

vi.mock("../db", () => ({
  db: createDbMock(),
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed-password"),
    compare: vi.fn().mockResolvedValue(true),
  },
  hash: vi.fn().mockResolvedValue("hashed-password"),
  compare: vi.fn().mockResolvedValue(true),
}));

export const createMockUser = (overrides = {}) => ({
  id: "user-123",
  email: "test@example.com",
  name: "Test User",
  username: "testuser",
  avatar: null,
  color: "#4f6bff",
  role: "USER",
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockUserRow = (overrides = {}) => ({
  id: "user-123",
  email: "test@example.com",
  name: "Test User",
  username: "testuser",
  avatar: null,
  color: "#4f6bff",
  passwordHash: "hashed-password",
  googleId: null,
  githubId: null,
  role: "USER",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockRequest = (overrides = {}) => ({
  cookies: {},
  user: undefined,
  ...overrides,
});

export const createMockResponse = () => {
  const cookies: Record<string, { value: string; options: any }> = {};
  const res = {
    cookies: {} as Record<string, { value: string; options: any }>,
    statusCode: 200,
    cookie: vi.fn((name: string, value: string, options: any) => {
      cookies[name] = { value, options };
      return res;
    }),
    clearCookie: vi.fn((name: string, options?: any) => {
      delete cookies[name];
      return res;
    }),
    redirect: vi.fn(),
    json: vi.fn((data: any) => {
      res.body = data;
      return res;
    }),
    body: undefined as any,
  };
  return res;
};