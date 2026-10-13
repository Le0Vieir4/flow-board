"use client";

import type { ReactNode } from "react";
import { AppShell } from "@/components/dashboard/app-shell";
import { AuthProvider } from "@/components/auth/auth-provider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AuthProvider><AppShell>{children}</AppShell></AuthProvider>;
}
