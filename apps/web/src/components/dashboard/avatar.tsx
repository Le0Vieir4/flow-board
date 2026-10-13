import type { User } from "@flow/shared";

function darken(hex: string, amount = 28): string {
  const n = hex.replace("#", "");
  const c = (i: number) => Math.max(0, parseInt(n.slice(i, i + 2), 16) - amount);
  return `rgb(${c(0)}, ${c(2)}, ${c(4)})`;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export function Avatar({
  user,
  size = 24,
  online,
  ringColor = "rgb(5,7,13)",
}: {
  user: User;
  size?: number;
  online?: boolean;
  ringColor?: string;
}) {
  const font = size >= 26 ? 11 : size >= 20 ? 10 : 8.5;
  return (
    <span
      className="relative inline-flex flex-shrink-0 items-center justify-center rounded-full font-bold text-white select-none"
      style={{
        width: size,
        height: size,
        fontSize: font,
        background: `linear-gradient(135deg, ${user.color}, ${darken(user.color)})`,
      }}
      title={user.name}
    >
      {initials(user.name)}
      {online !== undefined && (
        <span
          className="absolute rounded-full border-[1.5px]"
          style={{
            width: size / 3.1,
            height: size / 3.1,
            right: size / 22,
            bottom: size / 22,
            background: online ? "#34c77b" : "#3a3f4e",
            borderColor: ringColor,
          }}
          aria-hidden
        />
      )}
    </span>
  );
}

export function AvatarStack({
  users,
  presence,
  size = 24,
  max = 4,
  ringColor = "rgb(5,7,13)",
}: {
  users: User[];
  presence?: Record<string, boolean>;
  size?: number;
  max?: number;
  ringColor?: string;
}) {
  const shown = users.slice(0, max);
  const rest = users.length - shown.length;
  return (
    <span className="inline-flex items-center">
      {shown.map((u, i) => (
        <span key={u.id} style={{ marginLeft: i === 0 ? 0 : -size / 3.6 }}>
          <Avatar user={u} size={size} online={presence ? presence[u.id] : undefined} ringColor={ringColor} />
        </span>
      ))}
      {rest > 0 && (
        <span
          className="inline-flex items-center justify-center rounded-full bg-white/[0.06] font-semibold text-muted-foreground"
          style={{ width: size, height: size, marginLeft: -size / 3.6, fontSize: size / 2.2 }}
        >
          +{rest}
        </span>
      )}
    </span>
  );
}
