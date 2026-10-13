import { useEffect, useState } from "react";

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  for (const fn of listeners) fn();
}

/** Fires a one-shot "open new board" signal from any page to the shell. */
export function openNewBoard() {
  notify();
}

export function useNewBoardSignal(onOpen: () => void) {
  useEffect(() => {
    listeners.add(onOpen);
    return () => {
      listeners.delete(onOpen);
    };
  }, [onOpen]);
}

/** Holds the shell's modal state; pages trigger it through openNewBoard(). */
export function useNewBoardModalState() {
  const [open, setOpen] = useState(false);
  useNewBoardSignal(() => setOpen(true));
  return { open, setOpen };
}
