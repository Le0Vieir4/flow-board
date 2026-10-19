"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateBoard } from "@/hooks/queries/boards";
import { Modal, Button, Input } from "@flow/ui";

export function NewBoardModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const createBoard = useCreateBoard();

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    createBoard.mutate(trimmed, {
      onSuccess: (board: { id: string }) => {
        onClose();
        router.push(`/dashboard/boards/${board.id}`);
      },
    });
  }

  return (
    <Modal open onClose={onClose} size="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex flex-col p-6"
      >
        <h2 className="text-headline font-bold tracking-tighter">Create a new board</h2>
        <p className="mt-1.5 text-label leading-relaxed text-muted">
          A new workspace starts with Backlog, Todo and In Progress. You can rename columns right on the board.
        </p>
        <Input
          id="new-board-name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Product Launch v2"
          label="Board name"
        />
        <div className="mt-6 flex justify-end gap-2.5">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!name.trim() || createBoard.isPending}
          >
            Create board
          </Button>
        </div>
      </form>
    </Modal>
  );
}
