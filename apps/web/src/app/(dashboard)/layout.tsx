"use client";

import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRealtime } from "@/hooks/useRealtime";
import { AppShell } from "@/components/dashboard/app-shell";
import { AuthProvider } from "@/components/auth/auth-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DashboardShell>{children}</DashboardShell>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function DashboardShell({ children }: { children: ReactNode }) {
  // Keep the WebSocket connection alive across dashboard pages so presence
  // and notification invalidation work everywhere. Rendered inside the
  // QueryClientProvider because useRealtime requires the query client.
  useRealtime();

  return <AppShell>{children}</AppShell>;
}
