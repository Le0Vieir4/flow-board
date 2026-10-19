"use client";

import { type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Sidebar, type SidebarProps } from "./Sidebar";
import { Header, type HeaderProps } from "./Header";

interface AppShellProps {
  children: ReactNode;
  sidebar?: ReactNode;
  sidebarProps?: SidebarProps;
  header?: ReactNode;
  headerProps?: HeaderProps;
}

export function AppShell({ children, sidebar, sidebarProps, header, headerProps }: AppShellProps) {
  return (
    <div className="flex min-h-dvh bg-bg">
      {sidebar || <Sidebar {...sidebarProps} />}
      <div className="flex min-w-0 flex-1 flex-col">
        {header || <Header {...headerProps} />}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}