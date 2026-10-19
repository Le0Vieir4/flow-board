import { createTRPCClient as createBaseTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@flow/server/trpc";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function createTRPCClient() {
  return createBaseTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${API_URL}/trpc`,
        fetch: async (input, init) =>
          fetch(input, { ...init, credentials: "include" }),
      }),
    ],
  });
}

export const trpcClient = createTRPCClient();

export const trpcUrl = `${API_URL}/trpc`;
