import { CalendarView } from "@/components/dashboard/calendar-view";

export default async function CalendarPage({ params }: { params: Promise<{ boardId: string }> }) {
  return <CalendarView boardId={await params.then((p) => p.boardId)} />;
}
