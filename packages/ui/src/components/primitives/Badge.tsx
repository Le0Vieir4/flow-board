"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-micro font-semibold",
  {
    variants: {
      variant: {
        new: "border-transparent bg-primary-gradient text-white",
        soon: "border-line bg-white/3 text-muted-foreground",
        unread: "border-none bg-tag-electric text-white",
        default: "border-line bg-white/3 text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, variant = "default", className, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {children}
    </span>
  );
}