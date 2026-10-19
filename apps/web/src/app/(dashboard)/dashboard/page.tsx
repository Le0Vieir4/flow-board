import type { Metadata } from "next";
import { BoardsHome } from "@/components/dashboard/boards-home";

export const metadata: Metadata = {
  title: "Boards — FlowBoard",
  description: "Your workspaces, live. Boards update the moment your team moves a task.",
};

export default function BoardsPage() {
  return <BoardsHome />;
}
