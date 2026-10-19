"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { getTagColor, getTagGradient, type TagColor } from "../../lib/color-utils";

const tagVariants = cva(
  "inline-flex items-center rounded-tag px-[7px] py-[2.5px] text-micro font-bold text-white whitespace-nowrap",
  {
    variants: {
      type: {
        electric: `bg-[${getTagColor("electric")}]`,
        design: `bg-[${getTagColor("design")}]`,
        high: `bg-[${getTagColor("high")}]`,
        medium: `bg-[${getTagColor("medium")}]`,
        low: `bg-[${getTagColor("low")}]`,
      },
      variant: {
        solid: "",
        gradient: "",
      },
    },
    defaultVariants: {
      type: "electric",
      variant: "solid",
    },
  }
);

export interface TagProps extends VariantProps<typeof tagVariants> {
  children: React.ReactNode;
  type?: TagColor;
  className?: string;
}

export function Tag({ children, type = "electric", variant = "solid", className, ...props }: TagProps) {
  const color = getTagColor(type);

  return (
    <span
      className={cn(tagVariants({ type, variant, className }))}
      style={variant === "gradient" ? { background: getTagGradient(type) } : undefined}
      {...props}
    >
      {children}
    </span>
  );
}

export function TagLabel(type: TagColor): string {
  switch (type) {
    case "electric":
      return "Electric";
    case "design":
      return "Design";
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    default:
      return type;
  }
}