"use client";

import { type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  width?: number;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ children, width = 232, collapsed = false, onToggle, className, ...props }: SidebarProps) {
  return (
    <aside
      aria-label="Workspace sidebar"
      className={cn(
        "sticky top-0 hidden h-dvh flex-shrink-0 border-r border-line bg-panel transition-all duration-200 max-[899px]:hidden min-[900px]:block",
        collapsed ? `w-[72px]` : `w-[${width}px]`,
        className
      )}
      style={{ width: collapsed ? 72 : width }}
      {...props}
    >
      {children}
    </aside>
  );
}