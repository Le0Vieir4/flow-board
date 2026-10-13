import type { Metadata } from "next";
import { Notifications } from "@/components/dashboard/notifications";

export const metadata: Metadata = {
  title: "Notifications — FlowBoard",
  description: "Moves, assignments, mentions, and comments across your boards — in real time.",
};

export default function NotificationsPage() {
  return <Notifications />;
}