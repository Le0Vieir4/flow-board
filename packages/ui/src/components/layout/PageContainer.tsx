"use client";

import { type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

const maxWidths = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "2xl": "max-w-[1440px]",
  full: "max-full",
};

const paddings = {
  none: "",
  sm: "px-4",
  md: "px-6",
  lg: "px-8",
  xl: "px-[64px]",
};

export function PageContainer({ children, maxWidth = "2xl", padding = "md", className, ...props }: PageContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full", maxWidths[maxWidth], paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
}