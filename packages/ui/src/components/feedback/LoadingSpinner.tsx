"use client";

import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const spinnerVariants = cva("animate-spin rounded-full border-2 border-current border-t-transparent", {
  variants: {
    size: {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof spinnerVariants> {}

export function LoadingSpinner({ className, size = "md", ...props }: LoadingSpinnerProps) {
  return (
    <span
      className={cn(spinnerVariants({ size, className }))}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </span>
  );
}