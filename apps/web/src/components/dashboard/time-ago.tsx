"use client";

import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/time";

/** Renders relative time client-side only, so SSR and hydration always agree. */
export function TimeAgo({ iso }: { iso: string }) {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    const update = () => setLabel(timeAgo(iso));
    update();
    const t = setInterval(update, 30_000);
    return () => clearInterval(t);
  }, [iso]);
  return <>{label ?? ""}</>;
}
