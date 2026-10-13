"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBoard } from "@/lib/boards-store";
import { Modal } from "./modal";

export function NewBoardModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const board = createBoard(trimmed);
    onClose();
    router.push(`/boards/${board.id}`);
  }

  return (
    <Modal onClose={onClose} width="max-w-[420px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex flex-col p-6"
      >
        <h2 className="text-[18px] font-bold -tracking-[0.01em]">Create a new board</h2>
        <p className="mt-[6px] text-[13px] leading-[1.55] text-muted">
          A new workspace starts with Backlog, Todo and In Progress. You can rename columns right on the board.
        </p>
        <label htmlFor="new-board-name" className="mt-6 text-[12.5px] font-semibold text-label">
          Board name
        </label>
        <input
          id="new-board-name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Product Launch v2"
          className="mt-2 w-full rounded-[10px] border border-line bg-field px-3.5 py-[10px] text-[14.5px] placeholder:text-muted-foreground focus:border-primary-2/60 focus:outline-none"
        />
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] border border-line bg-white/[0.03] px-4 py-[10px] text-[14.5px] font-semibold hover:bg-white/[0.06]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="rounded-[10px] bg-gradient-to-br from-[#5b76ff] to-[#3f56e8] px-4 py-[10px] text-[14.5px] font-bold text-white shadow-[0_6px_20px_rgba(63,90,255,0.35)] transition-all duration-150 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(63,90,255,0.45)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_6px_20px_rgba(63,90,255,0.35)]"
          >
            Create board
          </button>
        </div>
      </form>
    </Modal>
  );
}
