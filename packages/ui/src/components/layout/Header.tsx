"use client";

import { type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

export function Header({ children, left, center, right, className, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-header-height items-center justify-between border-b border-line bg-bg px-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">{left}</div>
      <div className="flex items-center justify-center gap-4">{center}</div>
      <div className="flex items-center justify-end gap-2">{right}</div>
      {children}
    </header>
  );
}