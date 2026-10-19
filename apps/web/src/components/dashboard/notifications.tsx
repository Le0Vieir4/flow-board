"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useNotifications, useMarkRead, useMarkAllRead } from "@/hooks/queries/notifications";
import { useBoard } from "@/hooks/queries/boards";
import type { AppNotification } from "@/hooks/queries/notifications";
import { TimeAgo } from "./time-ago";
import { Icons } from "@flow/ui/icons";
import { Button } from "@flow/ui";

type NotificationMessage = AppNotification;

function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function groupKey(iso: string, today: string): string {
  const key = dayKey(new Date(iso));
  if (key === today) return "Today";
  if (key === dayKey(new Date(Date.now() - 86_400_000))) return "Yesterday";
  return "Earlier";
}

function Message({ n }: { n: NotificationMessage }) {
  switch (n.kind) {
    case "moved":
      return (
        <>
          moved <strong className="font-semibold text-foreground">{n.taskLabel}</strong>
          {n.taskTitle ? <span className="text-muted-foreground"> · {n.taskTitle}</span> : null} to{" "}
          <strong className="font-semibold text-foreground">{n.columnName}</strong>
        </>
      );
    case "created":
      return (
        <>
          created <strong className="font-semibold text-foreground">{n.taskLabel}</strong>
          {n.taskTitle ? <span className="text-muted-foreground"> · {n.taskTitle}</span> : null}
        </>
      );
    case "assigned":
      return (
        <>
          assigned you <strong className="font-semibold text-foreground">{n.taskLabel}</strong>
          {n.taskTitle ? <span className="text-muted-foreground"> · {n.taskTitle}</span> : null}
        </>
      );
    case "comment":
      return (
        <>
          commented on <strong className="font-semibold text-foreground">{n.taskLabel}</strong>
          {n.taskTitle ? <span className="text-muted-foreground"> · {n.taskTitle}</span> : null}
        </>
      );
    case "mention":
      return (
        <>
          mentioned you on <strong className="font-semibold text-foreground">{n.taskLabel}</strong>
          {n.taskTitle ? <span className="text-muted-foreground"> · {n.taskTitle}</span> : null}
        </>
      );
  }
}

function Row({ n }: { n: NotificationMessage }) {
  const router = useRouter();
  const markRead = useMarkRead();
  const { data: board } = useBoard(n.boardId);

  function actorName() {
    return n.actorId ? "You" : "Someone";
  }

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`${n.kind} — open board`}
      onClick={() => {
        markRead.mutate(n.id);
        router.push(`/dashboard/boards/${n.boardId}`);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          markRead.mutate(n.id);
          router.push(`/dashboard/boards/${n.boardId}`);
        }
      }}
      className={`group flex cursor-pointer items-start gap-3 rounded-lg px-3 py-3 transition-colors duration-150 focus-visible:outline-2 ${
        n.read ? "hover:bg-white/3" : "bg-white/3 hover:bg-white/5"
      }`}
    >
      <span className="flex w-[10px] flex-shrink-0 items-center justify-center pt-1.5" aria-hidden>
        {n.read ? (
          <span className="h-[5px] w-[5px] rounded-full bg-white/6" />
        ) : (
          <span className="h-[6px] w-[6px] rounded-full bg-tag-electric" />
        )}
      </span>
      <div className="flex w-[10px] flex-shrink-0 items-center justify-center" aria-hidden>
        <Icons.BellIcon size={16} className={`text-${n.read ? "muted-foreground" : "primary"}`} />
      </div>
      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-1 text-label leading-relaxed">
          <span className={`font-semibold ${n.read ? "text-muted" : "text-foreground"}`}>{actorName()}</span>
          <span className={n.read ? "text-muted" : "text-label"}>
            <Message n={n} />
          </span>
        </span>
        <span className="mt-1 flex items-center gap-2 text-meta-small text-muted-foreground">
          <span className="max-w-[220px] truncate">{board?.name ?? "Board"}</span>
          <span aria-hidden>·</span>
          <TimeAgo iso={n.at} />
        </span>
      </span>
    </div>
  );
}

function Section({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <section className="pt-6 first:pt-0">
      <div className="flex items-center gap-2.5 px-1">
        <h2 className="text-label font-bold">{label}</h2>
        <span className="rounded-full border border-line bg-white/4 px-2 py-0.5 text-meta-small font-semibold text-muted-foreground">
          {count}
        </span>
      </div>
      <div className="mt-2 flex flex-col">{children}</div>
    </section>
  );
}

export function Notifications() {
  const { data: items = [], isLoading } = useNotifications();
  const markAllRead = useMarkAllRead();
  const today = dayKey(new Date());

  const sections = useMemo(() => {
    const groups = new Map<string, NotificationMessage[]>();
    for (const n of items) {
      const key = groupKey(n.at, today);
      const list = groups.get(key) ?? [];
      list.push(n);
      groups.set(key, list);
    }
    return Array.from(groups.entries()).map(([label, list]) => ({ label, list }));
  }, [items, today]);

  const unread = items.reduce((acc, n) => acc + (n.read ? 0 : 1), 0);

  if (isLoading) {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-3 border-primary border-t-transparent animate-spin" />
          <p className="text-[14px] text-muted-foreground">Loading notifications…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-stub-heading font-extrabold tracking-tight">Notifications</h1>
          <span className="text-label font-medium text-muted-foreground">{unread === 0 ? "All caught up" : `${unread} unread`}</span>
        </div>
        {unread > 0 && (
          <Button variant="outline" onClick={() => markAllRead.mutate()}>
            Mark all read
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="relative flex min-h-[60dvh] flex-col items-center justify-center p-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
            <Icons.BellIcon size={24} />
          </span>
          <h1 className="mt-5 text-stub-heading font-extrabold tracking-tight">All caught up</h1>
          <p className="mt-2 max-w-[330px] text-body leading-relaxed text-muted">
            Moves, assignments, and mentions land here the moment your team makes them — and on the bell in your sidebar.
          </p>
        </div>
      ) : (
        <div className="max-w-[860px]">
          {sections.map((s) => (
            <Section key={s.label} label={s.label} count={s.list.length}>
              {s.list.map((n) => (
                <Row key={n.id} n={n} />
              ))}
            </Section>
          ))}
        </div>
      )}
    </div>
  );
}
