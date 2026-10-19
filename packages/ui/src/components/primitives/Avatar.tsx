"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { darken } from "../../lib/color-utils";

export interface User {
  id: string;
  name: string;
  color: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

const avatarSizes = {
  xs: 18,
  sm: 24,
  md: 28,
  lg: 32,
  xl: 36,
} as const;

export type AvatarSize = keyof typeof avatarSizes | number;

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  user: User;
  size?: AvatarSize;
  online?: boolean;
  ringColor?: string;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ user, size = "md", online, ringColor = "rgb(5,7,13)", className, style, ...props }, ref) => {
    const sizeValue = typeof size === "number" ? size : avatarSizes[size];
    const fontSize = sizeValue >= 26 ? 11 : sizeValue >= 20 ? 10 : 8.5;
    const ringSize = sizeValue / 3.1;
    const ringOffset = sizeValue / 22;

    return (
      <span
        ref={ref}
        className={cn("relative inline-flex flex-shrink-0 items-center justify-center rounded-full font-bold text-white select-none", className)}
        style={{
          width: sizeValue,
          height: sizeValue,
          fontSize,
          background: `linear-gradient(135deg, ${user.color}, ${darken(user.color)})`,
          ...style,
        }}
        title={user.name}
        {...props}
      >
        {initials(user.name)}
        {online !== undefined && (
          <span
            className="absolute rounded-full border-[1.5px]"
            style={{
              width: ringSize,
              height: ringSize,
              right: ringOffset,
              bottom: ringOffset,
              background: online ? "var(--color-success)" : "var(--color-presence-offline)",
              borderColor: ringColor,
            }}
            aria-hidden="true"
          />
        )}
      </span>
    );
  }
);

Avatar.displayName = "Avatar";

export interface AvatarStackProps extends HTMLAttributes<HTMLSpanElement> {
  users: User[];
  presence?: Record<string, boolean>;
  size?: AvatarSize;
  max?: number;
  ringColor?: string;
}

export function AvatarStack({ users, presence, size = "md", max = 4, ringColor = "rgb(5,7,13)", className, ...props }: AvatarStackProps) {
  const shown = users.slice(0, max);
  const rest = users.length - shown.length;
  const sizeValue = typeof size === "number" ? size : avatarSizes[size];

  return (
    <span className={cn("inline-flex items-center", className)} {...props}>
      {shown.map((u, i) => (
        <span key={u.id} style={{ marginLeft: i === 0 ? 0 : -sizeValue / 3.6 }}>
          <Avatar user={u} size={size} online={presence ? presence[u.id] : undefined} ringColor={ringColor} />
        </span>
      ))}
      {rest > 0 && (
        <span
          className="inline-flex items-center justify-center rounded-full bg-white/6 font-semibold text-muted-foreground"
          style={{ width: sizeValue, height: sizeValue, marginLeft: -sizeValue / 3.6, fontSize: sizeValue / 2.2 }}
        >
          +{rest}
        </span>
      )}
    </span>
  );
}