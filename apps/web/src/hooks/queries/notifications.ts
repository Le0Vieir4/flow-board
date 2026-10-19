import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@flow/server/trpc";
import { trpcClient } from "@/lib/trpc/client";

export type AppNotification = inferRouterOutputs<AppRouter>["notifications"]["getAll"][number];

export const NOTIFICATIONS_KEY = ["notifications"];
export const UNREAD_COUNT_KEY = ["notifications", "unread"];

export function useNotifications() {
  return useQuery<AppNotification[]>({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: () => trpcClient.notifications.getAll.query(),
  });
}

export function useUnreadCount() {
  return useQuery<number>({
    queryKey: UNREAD_COUNT_KEY,
    queryFn: () => trpcClient.notifications.unreadCount.query(),
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trpcClient.notifications.markRead.mutate({ id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      qc.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
    },
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => trpcClient.notifications.markAllRead.mutate(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      qc.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
    },
  });
}
