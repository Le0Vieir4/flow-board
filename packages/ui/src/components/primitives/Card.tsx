"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const cardVariants = cva("rounded-card border bg-card", {
  variants: {
    variant: {
      default: "border-line-soft p-card",
      elevated: "border-line-soft p-card shadow-elevated",
      interactive: "border-line-soft p-card transition-all duration-150 hover:border-white/14 focus-visible:outline-primary-2 cursor-pointer",
    },
    padding: {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
      card: "p-[11px_12px]",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "card",
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";