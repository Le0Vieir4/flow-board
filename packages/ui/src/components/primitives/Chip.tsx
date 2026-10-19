"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-2 rounded-button border px-3 font-semibold transition-colors duration-150",
  {
    variants: {
      variant: {
        default: "border-line bg-white/3 text-foreground hover:bg-white/6",
        active: "border-white/6 bg-white/6 text-foreground",
        ghost: "border-transparent bg-transparent text-muted-foreground hover:bg-white/4 hover:text-foreground",
        primary: "border-none bg-primary-gradient text-white shadow-button",
      },
      size: {
        sm: "h-chip-sm text-meta px-2.5",
        md: "h-chip text-label px-3",
      },
      withIcon: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      withIcon: false,
    },
  }
);

export interface ChipProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  icon?: ReactNode;
  badge?: number | string;
  badgeVariant?: "default" | "electric";
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant, size, withIcon, icon, badge, badgeVariant = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(chipVariants({ variant, size, withIcon: !!icon, className }))}
        {...props}
      >
        {icon && <span className="flex items-center">{icon}</span>}
        <span className="flex-1">{children}</span>
        {badge !== undefined && badge !== null && badge !== "" && (
          <span
            className={cn(
              "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
              badgeVariant === "electric" ? "bg-tag-electric text-white" : "bg-white/5 text-muted-foreground"
            )}
          >
            {badge}
          </span>
        )}
      </button>
    );
  }
);

Chip.displayName = "Chip";