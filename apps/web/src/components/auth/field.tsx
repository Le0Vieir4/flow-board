import type { ReactNode } from "react";
import { Icons } from "@flow/ui";

export const fieldInputClass =
  "w-full pl-10 pr-4 py-3 rounded-field border border-line bg-field text-foreground text-sm outline-none transition-colors duration-150 placeholder:text-muted-foreground focus:border-primary focus:shadow-[0_0_0_3px_rgba(79,107,255,0.18)]";

export const fieldErrorClass =
  "w-full pl-10 pr-4 py-3 rounded-field border border-error/60 bg-field text-foreground text-sm outline-none transition-colors duration-150 placeholder:text-muted-foreground focus:border-error focus:shadow-[0_0_0_3px_rgba(229,72,77,0.15)]";

export function Field({
  label,
  htmlFor,
  icon,
  children,
  error,
  className,
}: {
  label: string;
  htmlFor: string;
  icon: ReactNode;
  children: ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <div className={`mb-4.5 ${className ?? ""}`}>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-label mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground">
          {icon}
        </span>
        {children}
      </div>
      {error && <FieldError id={`${htmlFor}-error`} message={error} />}
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="flex items-start gap-1.5 text-xs text-error leading-[1.45] mt-1.5">
      <Icons.AlertCircleIcon className="w-3 h-3 flex-shrink-0 mt-0.5" />
      {message}
    </p>
  );
}

export function FormError({ id, message }: { id: string; message: string }) {
  return (
    <div
      id={id}
      role="alert"
      className="flex items-start gap-2.5 rounded-field border border-error/40 bg-error/10 px-3.5 py-3 text-sm text-error mb-5"
    >
      <Icons.AlertCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
      {message}
    </div>
  );
}
