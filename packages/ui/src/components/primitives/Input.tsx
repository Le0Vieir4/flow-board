"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const inputVariants = cva(
  "w-full rounded-field bg-field text-foreground text-sm outline-none transition-colors duration-150 placeholder:text-muted-foreground",
  {
    variants: {
      state: {
        default: "border border-line focus:border-primary-2/60 focus:shadow-[0_0_0_3px_rgba(79,107,255,0.18)]",
        error: "border border-error/60 focus:border-error focus:shadow-[0_0_0_3px_rgba(229,72,77,0.15)]",
      },
      withIcon: {
        true: "pl-10 pr-4 py-3",
        false: "px-4 py-3",
      },
    },
    defaultVariants: {
      state: "default",
      withIcon: false,
    },
  }
);

const labelVariants = cva("block text-label text-label mb-2");

const iconWrapperVariants = cva("pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5", {
  variants: {
    state: {
      default: "text-muted-foreground",
      error: "text-error",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, error, helperText, state, withIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
      <div className="mb-4.5">
        {label && <label htmlFor={inputId} className={labelVariants()}>{label}</label>}
        <div className="relative">
          {icon && (
            <span className={cn(iconWrapperVariants({ state: error ? "error" : "default" }))}>
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(inputVariants({ state: error ? "error" : state, withIcon: !!icon, className }))}
            aria-invalid={error ? true : undefined}
            aria-describedby={cn(errorId, helperId)}
            {...props}
          />
        </div>
        {error && (
          <p id={errorId} className="flex items-start gap-1.5 text-micro text-error leading-[1.45] mt-1.5" role="alert">
            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 flex-shrink-0 mt-0.5" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-micro text-muted-foreground mt-1.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";