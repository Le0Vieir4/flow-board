import type { TagType } from "@flow/shared";

const STYLES = new Map<TagType, string>([
  ["electric", "bg-tag-electric"],
  ["design", "bg-tag-design"],
  ["high", "bg-tag-high"],
  ["medium", "bg-tag-medium"],
  ["low", "bg-tag-low"],
]);

function getLabel(type: TagType): string {
  switch (type) {
    case "electric": return "Electric";
    case "design": return "Design";
    case "high": return "High";
    case "medium": return "Medium";
    case "low": return "Low";
    default: return String(type);
  }
}

export function Tag({ type }: { type: TagType }) {
  return (
    <span
      className={`inline-flex items-center rounded-[6px] px-[7px] py-[2.5px] text-[10.5px] font-bold text-white whitespace-nowrap ${STYLES.get(type) ?? ""}`}
    >
      {getLabel(type)}
    </span>
  );
}