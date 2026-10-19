export function darken(hex: string, amount = 28): string {
  const n = hex.replace("#", "");
  const c = (i: number) => Math.max(0, parseInt(n.slice(i, i + 2), 16) - amount);
  return `rgb(${c(0)}, ${c(2)}, ${c(4)})`;
}

export function getGradient(color: string): string {
  return `linear-gradient(135deg, ${color}, ${darken(color)})`;
}

export const TAG_COLORS = {
  electric: "#3b5bff",
  design: "#6a4fd6",
  high: "#c24545",
  medium: "#9c6327",
  low: "#217a4d",
} as const;

export type TagColor = keyof typeof TAG_COLORS;

export function getTagColor(type: TagColor): string {
  return TAG_COLORS[type];
}

export function getTagGradient(type: TagColor): string {
  return getGradient(getTagColor(type));
}