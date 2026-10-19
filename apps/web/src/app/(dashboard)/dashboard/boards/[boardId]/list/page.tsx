import { ListView } from "@/components/dashboard/list-view";

export default async function ListPage({ params }: { params: Promise<{ boardId: string }> }) {
  return <ListView boardId={await params.then((p) => p.boardId)} />;
}
