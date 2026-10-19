import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "@/lib/trpc/client";

export const USER_KEY = (id: string) => ["user", id];

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: USER_KEY(id ?? ""),
    queryFn: () => trpcClient.users.getById.query({ id: id! }),
    enabled: !!id,
  });
}

export function useUsers(ids: string[]) {
  const uniqueIds = [...new Set(ids)];
  return useQuery({
    queryKey: ["users", uniqueIds.sort()],
    queryFn: async () => {
      const users = await Promise.all(
        uniqueIds.map((id) => trpcClient.users.getById.query({ id })),
      );
      return Object.fromEntries(users.map((u) => [u.id, u]));
    },
    enabled: uniqueIds.length > 0,
  });
}
