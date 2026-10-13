import type { Metadata } from "next";
import { MyTasks } from "@/components/dashboard/my-tasks";

export const metadata: Metadata = {
  title: "My Tasks — FlowBoard",
  description: "Your assigned tasks across boards, grouped by what's due.",
};

export default function MyTasksPage() {
  return <MyTasks />;
}