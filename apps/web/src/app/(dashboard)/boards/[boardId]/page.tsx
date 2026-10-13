import type { Metadata } from "next";
import { BoardView } from "@/components/dashboard/board-view";

export const metadata: Metadata = {
  title: "Board — FlowBoard",
  description: "A live Kanban board — every move, comment and presence update syncs in real time.",
};

export default async function BoardPage({ params }: { params: Promise<{ boardId: string }> }) {
  const { boardId } = await params;
  return <BoardView boardId={boardId} />;
}
