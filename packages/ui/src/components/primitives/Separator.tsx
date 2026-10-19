"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const separatorVariants = cva("border-line", {
  variants: {
    orientation: {
      horizontal: "w-full",
      vertical: "h-full",
    },
    variant: {
      default: "border-line",
      soft: "border-line-soft",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    variant: "default",
  },
});

export interface SeparatorProps extends HTMLAttributes<HTMLHRElement>, VariantProps<typeof separatorVariants> {}

export const Separator = forwardRef<HTMLHRElement, SeparatorProps>(
  ({ className, orientation = "horizontal", variant = "default", ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn(separatorVariants({ orientation, variant, className }))}
        aria-orientation={orientation as "horizontal" | "vertical"}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";