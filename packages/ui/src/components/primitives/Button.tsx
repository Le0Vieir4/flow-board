"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold rounded-button transition-all duration-150 focus-visible:outline-primary-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none",
  {
    variants: {
      variant: {
        primary: "bg-primary-gradient text-white shadow-button hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(63,90,255,0.4)]",
        outline: "bg-white/3 text-foreground border border-line hover:bg-white/6",
        ghost: "text-muted-foreground hover:bg-white/4 hover:text-foreground",
        destructive: "text-error hover:bg-error/10",
      },
      size: {
        sm: "px-3 py-2 text-label",
        md: "px-4 py-[11px] text-label",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, icon, iconPosition = "right", loading, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </span>
        ) : icon && iconPosition === "left" ? (
          <span className="flex items-center">{icon}</span>
        ) : null}
        {children}
        {icon && iconPosition === "right" && !loading && <span className="flex items-center">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";