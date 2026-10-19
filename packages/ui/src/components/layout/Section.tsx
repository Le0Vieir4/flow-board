"use client";

import { type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  heading?: ReactNode;
  headingLevel?: 1 | 2 | 3 | 4;
  description?: ReactNode;
}

const spacingStyles = {
  none: "",
  sm: "py-4",
  md: "py-8",
  lg: "py-12",
  xl: "py-16",
};

function Heading({ level, children }: { level: 1 | 2 | 3 | 4; children: ReactNode }) {
  switch (level) {
    case 1:
      return <h1 className="text-headline font-bold tracking-tight">{children}</h1>;
    case 2:
      return <h2 className="text-headline font-bold tracking-tight">{children}</h2>;
    case 3:
      return <h3 className="text-headline font-bold tracking-tight">{children}</h3>;
    case 4:
      return <h4 className="text-headline font-bold tracking-tight">{children}</h4>;
  }
}

export function Section({ children, spacing = "md", heading, headingLevel = 2, description, className, ...props }: SectionProps) {
  return (
    <section className={cn(spacingStyles[spacing], className)} {...props}>
      {(heading || description) && (
        <div className="mb-6">
          {heading && <Heading level={headingLevel}>{heading}</Heading>}
          {description && <p className="mt-2 text-body text-muted">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}