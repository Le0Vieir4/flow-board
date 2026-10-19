import { useEffect, useRef } from "react";
import type { RefObject } from "react";

export function useClickOutside(isOpen: boolean, onClose: () => void, ...refs: RefObject<HTMLElement | null>[]) {
  const onCloseRef = useRef(onClose);
  const refsRef = useRef(refs);

  useEffect(() => {
    onCloseRef.current = onClose;
    refsRef.current = refs;
  });

  useEffect(() => {
    if (!isOpen) return;

    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (refsRef.current.every((ref) => !ref.current?.contains(target))) {
        onCloseRef.current();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
      }
    };

    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);
}
