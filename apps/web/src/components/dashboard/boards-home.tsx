"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Board } from "@flow/shared";
import { useBoards, useUpdateBoard, useCreateBoard } from "@/hooks/queries/boards";
import { SECTIONS, countTasks, userById } from "@/lib/mock-data";
import { usePresence } from "@/lib/boards-store";
import { AvatarStack } from "./avatar";
import { TimeAgo } from "./time-ago";
import { Icons } from "@flow/ui/icons";
import { TemplatePicker } from "./template-picker";

function ColumnStrip({ board }: { board: import("@flow/shared").Board }) {
  const max = Math.max(1, ...board.columns.map((c: import("@flow/shared").Column) => c.tasks.length));
  return (
    <div className="mt-3.5 flex gap-1.5" aria-hidden>
      {board.columns.map((c: import("@flow/shared").Column) => (
        <div
          key={c.id}
          title={`${c.name} · ${c.tasks.length} ${c.tasks.length === 1 ? "card" : "cards"}`}
          className="h-[6px] flex-1 overflow-hidden rounded-full bg-panel-2"
        >
          <div
            className="h-full rounded-full bg-muted/30"
            style={{ width: `${Math.max(8, (c.tasks.length / max) * 100)}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function BoardCard({ board }: { board: Board }) {
  const router = useRouter();
  const presence = usePresence(board.id);
  const members = board.members.map(userById);
  const [fresh, setFresh] = useState(false);
  const updateBoard = useUpdateBoard(board.id);

  useEffect(() => {
    const check = () => setFresh(Date.now() - new Date(board.updatedAt).getTime() < 60_000);
    check();
    const t = setInterval(check, 15_000);
    return () => clearInterval(t);
  }, [board.updatedAt]);

  function toggleFavorite() {
    updateBoard.mutate({ favorite: !board.favorite });
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/dashboard/boards/${board.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/dashboard/boards/${board.id}`);
        }
      }}
      className="group cursor-pointer rounded-[14px] border border-line-soft bg-panel p-4 transition-all duration-200 hover:border-line hover:bg-panel-2 hover:-translate-y-[2px]"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[9px] bg-panel-2 text-muted-foreground">
          <Icons.BoardIcon size={16} />
        </span>
        <Link
          href={`/dashboard/boards/${board.id}`}
          className="min-w-0 flex-1 truncate text-[14.5px] font-bold hover:text-primary-2"
        >
          {board.name}
        </Link>
        <button
          type="button"
          aria-label={board.favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={board.favorite}
          disabled={updateBoard.isPending}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
          className={`flex h-7 w-7 items-center justify-center rounded-[8px] transition-colors ${
            board.favorite ? "text-star" : "text-muted-foreground/60 hover:bg-white/[0.06] hover:text-foreground"
          }`}
        >
          <Icons.StarIcon size={14} fill={board.favorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-2 text-meta text-muted-foreground">
        {countTasks(board)} {countTasks(board) === 1 ? "task" : "tasks"} · {board.columns.length}{" "}
        {board.columns.length === 1 ? "column" : "columns"}
      </div>
      <ColumnStrip board={board} />

      <div className="mt-4 flex items-center justify-between">
        <AvatarStack users={members} presence={presence} size={20} ringColor="#10131c" />
        <span className={`flex items-center gap-[6px] text-meta-small font-medium ${fresh ? "text-muted" : "text-muted-foreground"}`}>
          {fresh && <span className="h-[5px] w-[5px] rounded-full bg-success" aria-hidden />}
          Updated <TimeAgo iso={board.updatedAt} />
        </span>
      </div>
    </div>
  );
}

function Section({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <section className="pt-7 first:pt-0">
      <div className="flex items-center gap-2.5">
        <h2 className="text-headline">{label}</h2>
        <span className="rounded-full border border-line bg-panel-2 px-[8px] py-[1.5px] text-meta-small font-semibold text-muted-foreground">
          {count}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(248px,1fr))] gap-3.5">{children}</div>
    </section>
  );
}

export function BoardsHome() {
  const router = useRouter();
  const { data: boards = [], isLoading, isError } = useBoards();
  const createBoard = useCreateBoard();
  const [showTemplatePicker, setShowTemplatePicker] = useState(true);

  const bySection = useMemo(
    () =>
      SECTIONS.map((s) => ({
        ...s,
        boards: boards.filter((b) => b.status === s.key),
      })),
    [boards]
  );

  if (isLoading) {
    return (
      <div className="relative p-6">
        <div className="globe-glow-primary" aria-hidden />
        <div className="globe-glow-secondary" aria-hidden />
        <div className="globe-starfield" aria-hidden />
        <div className="relative z-10">
          <div className="h-[30px] w-[96px] animate-pulse rounded-[10px] bg-panel-2" />
          <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(248px,1fr))] gap-3.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[132px] animate-pulse rounded-[14px] bg-panel-2" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative flex min-h-[70dvh] flex-col items-center justify-center p-6 text-center">
        <div className="globe-glow-primary" aria-hidden />
        <div className="globe-glow-secondary" aria-hidden />
        <div className="globe-starfield" aria-hidden />
        <div className="relative z-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-panel-2 text-muted-foreground">
            <Icons.BoardIcon size={24} />
          </span>
          <h1 className="mt-5 text-stub-heading">Unable to load boards</h1>
          <p className="mt-2 max-w-[300px] text-body leading-relaxed text-muted">
            Could not fetch your boards from the server. Please try again later.
          </p>
          <button
            type="button"
            onClick={() => createBoard.mutate("New Board")}
            className="mt-6 inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-br from-[#5b76ff] to-[#3f56e8] px-5 py-[11px] text-[14.5px] font-bold text-white shadow-button transition-all duration-150 hover:-translate-y-px hover:shadow-[0_10px_28px_rgba(63,90,255,0.5)]"
          >
            <Icons.PlusIcon size={15} />
            Create your first board
          </button>
        </div>
      </div>
    );
  }

  const total = boards.length;
  const activeCount = boards.filter((b) => b.status === "active").length;
  const visible = bySection.filter((s) => s.boards.length > 0);

  if (total === 0) {
    return (
      <div className="relative flex min-h-[70dvh] flex-col items-center justify-center p-6">
        <div className="globe-glow-primary" aria-hidden />
        <div className="globe-glow-secondary" aria-hidden />
        <div className="globe-starfield" aria-hidden />
        <div className="relative flex flex-col items-center text-center z-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-panel-2 text-muted-foreground">
            <Icons.BoardIcon size={24} />
          </span>
          <h1 className="mt-5 text-stub-heading">No boards yet</h1>
          <p className="mt-2 max-w-[300px] text-body leading-relaxed text-muted">
            Boards are where your team works in real time. Create one to get started.
          </p>
          {showTemplatePicker ? (
            <TemplatePicker
              onClose={() => setShowTemplatePicker(false)}
              onTemplateSelected={(boardId: string) => router.push(`/dashboard/boards/${boardId}`)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowTemplatePicker(true)}
              disabled={createBoard.isPending}
              className="mt-6 inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-br from-[#5b76ff] to-[#3f56e8] px-5 py-[11px] text-[14.5px] font-bold text-white shadow-button transition-all duration-150 hover:-translate-y-px hover:shadow-[0_10px_28px_rgba(63,90,255,0.5)]"
            >
              <Icons.PlusIcon size={15} />
              Create your first board
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6 pb-10">
      <div className="globe-glow-primary" aria-hidden />
      <div className="globe-glow-secondary" aria-hidden />
      <div className="globe-starfield" aria-hidden />
      <div className="relative z-10">
        <header className="mb-8">
          <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-stub-heading">Boards</h1>
              <p className="text-body text-muted-foreground">
                {total} {total === 1 ? "workspace" : "workspaces"} · {activeCount} active
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowTemplatePicker(true)}
              disabled={createBoard.isPending}
              className="inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-br from-[#5b76ff] to-[#3f56e8] px-4 py-[10px] text-[14.5px] font-bold text-white shadow-button transition-all duration-150 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(63,90,255,0.45)] self-start md:self-end"
            >
              <Icons.PlusIcon size={15} />
              New board
            </button>
          </div>
        </header>

        {visible.map((s) => (
          <Section key={s.key} label={s.label} count={s.boards.length}>
            {s.boards.map((b) => (
              <BoardCard key={b.id} board={b} />
            ))}
          </Section>
        ))}
      </div>
    </div>
  );
}
